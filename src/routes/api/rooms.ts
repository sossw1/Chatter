import RoomCollection, { IRoom, IRoomDoc } from '../../models/Room';
import express from 'express';
import auth from '../../middleware/auth';
import Filter from 'bad-words';
import UserCollection from '../../models/User';
import inRoom from '../../middleware/inRoom';
import { IUserDoc } from '../../models/User';

const router = express.Router();

// Get room by id

router.get('/api/rooms/:roomId', auth, inRoom, async (req, res) => {
  res.status(200).send(req.room);
});

// Create a room

router.post('/api/rooms', auth, async (req, res) => {
  try {
    const room: IRoom = {
      name: req.body.name,
      users: req.body.users,
      invitedUsers: [],
      messages: []
    };

    if (!room.users.includes(req.user.username))
      return res
        .status(400)
        .send({ error: 'Room users must contain own username' });

    const filter = new Filter();
    if (filter.isProfane(room.name))
      return res.status(400).send({ error: 'Room name fails profanity check' });

    // Ensure all users exist
    const otherUsers: string[] = room.users.filter(
      (user) => user !== req.user.username
    );
    let roomUsers: IUserDoc[] = [req.user];
    for (let i = 0; i < otherUsers.length; i++) {
      const dbUser = await UserCollection.findOne({ username: otherUsers[i] });
      if (!dbUser)
        return res
          .status(404)
          .send({ error: `User '${otherUsers[i]}' not found` });
      roomUsers.push(dbUser);
    }

    const roomDocument: IRoomDoc = new RoomCollection(room);
    await roomDocument.save();

    for (let j = 0; j < roomUsers.length; j++) {
      const user = roomUsers[j];
      user.rooms.push(roomDocument._id);
      await user.save();
    }

    res.status(201).send(roomDocument);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update room name

router.patch('/api/rooms/:roomId', auth, inRoom, async (req, res) => {
  try {
    const { room } = req;
    const name: string = req.body.name;

    if (!name && name !== '')
      return res.status(400).send({ error: 'Invalid updates' });

    room.name = name;
    await room.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Invite user to room

router.patch('/api/rooms/:roomId/invite', auth, inRoom, async (req, res) => {
  try {
    const newRoomMember: string = req.body.username;
    if (!newRoomMember)
      return res.status(400).send({ error: 'Invalid updates' });

    const { room } = req;
    if (room.users.includes(newRoomMember))
      return res.status(400).send({ error: 'User already member of room' });

    const user = await UserCollection.findOne({ username: newRoomMember });
    if (!user) return res.sendStatus(404);

    room.invitedUsers.push(newRoomMember);
    await room.save();

    user.invites.push(room._id);
    await user.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Accept room invite

router.patch('/api/rooms/:roomId/accept', auth, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    if (!roomId) return res.status(400).send({ error: 'Invalid updates' });

    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(404);

    if (
      !req.user.invites.includes(room._id) ||
      !room.invitedUsers.includes(req.user.username)
    )
      return res.sendStatus(401);

    req.user.invites = req.user.invites.filter(
      (invite) => !invite.equals(room._id)
    );
    req.user.rooms.push(room._id);
    req.user.save();

    room.invitedUsers = room.invitedUsers.filter(
      (user) => user !== req.user.username
    );
    room.users.push(req.user.username);
    room.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error });
  }
});

export default router;
