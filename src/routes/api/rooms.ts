import { IRoom, IRoomDoc, RoomCollection } from '../../models/Room';
import express from 'express';
import auth from '../../middleware/auth';
import Filter from 'bad-words';
import UserCollection from '../../models/User';
import inRoom from '../../middleware/inRoom';

const router = express.Router();

// Get room by id

router.get('/api/rooms/:roomId', auth, inRoom, async (req, res) => {
  res.status(200).send(req.room);
});

// Create a group room

router.post('/api/rooms', auth, async (req, res) => {
  try {
    const room: IRoom = {
      name: req.body.name,
      isDirect: false,
      users: req.body.users,
      invitedUsers: [],
      messages: [],
      disabled: false
    };

    if (!room.users.includes(req.user.username))
      return res
        .status(400)
        .send({ error: 'Room users must contain own username' });

    const filter = new Filter();
    if (room.name && filter.isProfane(room.name))
      return res.status(400).send({ error: 'Room name fails profanity check' });

    const otherUsers: string[] = room.users.filter(
      (user) => user !== req.user.username
    );
    const otherUniqueUsers = [...new Set(otherUsers)];
    let roomUsers = [req.user];
    for (let i = 0; i < otherUniqueUsers.length; i++) {
      const dbUser = await UserCollection.findOne({
        username: otherUniqueUsers[i]
      });
      if (!dbUser)
        return res
          .status(404)
          .send({ error: `User '${otherUniqueUsers[i]}' not found` });
      roomUsers.push(dbUser);
    }

    room.users = [req.user.username, ...otherUniqueUsers];
    const roomDocument: IRoomDoc = new RoomCollection(room);
    await roomDocument.save();

    for (let j = 0; j < roomUsers.length; j++) {
      const user = roomUsers[j];
      user.rooms.push(roomDocument._id);
      await user.save();
    }

    res.status(201).send(roomDocument);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Update room name

router.patch('/api/rooms/:roomId', auth, inRoom, async (req, res) => {
  try {
    const { room } = req;
    const name: string = req.body.name;

    if (!name && name !== '')
      return res.status(400).send({ error: 'Invalid updates' });

    const filter = new Filter();
    if (filter.isProfane(name))
      return res.status(400).send({ error: 'Room name fails profanity check' });

    room.name = name;
    await room.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Invite user to room

router.patch('/api/rooms/:roomId/invite', auth, inRoom, async (req, res) => {
  try {
    if (req.room.isDirect)
      return res
        .status(400)
        .send({ error: 'Cannot invite new users to direct message' });

    const newRoomMember: string = req.body.username;
    if (!newRoomMember)
      return res.status(400).send({ error: 'Invalid updates' });

    if (newRoomMember === req.user.username)
      return res.status(400).send({ error: 'Cannot invite self' });

    const { room } = req;
    if (room.users.includes(newRoomMember))
      return res.status(400).send({ error: 'User already member of room' });

    const user = await UserCollection.findOne({ username: newRoomMember });
    if (!user) return res.sendStatus(404);

    if (
      !req.user.friends.includes(newRoomMember) ||
      !user.friends.includes(req.user.username)
    )
      return res.status(400).send({ error: 'Must be friends with user' });

    if (room.invitedUsers) {
      room.invitedUsers.push(newRoomMember);
      await room.save();
    }

    user.roomInvites.push(room._id);
    await user.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Accept or decline room invite

router.patch('/api/rooms/:roomId/respond-invite', auth, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const accept = req.body.accept;

    if (!roomId || (accept !== true && accept !== false))
      return res.status(400).send({ error: 'Invalid updates' });

    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(404);

    if (!accept) {
      req.user.roomInvites = req.user.roomInvites.filter(
        (invite) => !invite.equals(room._id)
      );
      await req.user.save();

      if (room.invitedUsers) {
        room.invitedUsers = room.invitedUsers.filter(
          (user) => user !== req.user.username
        );
        await room.save();
      }

      return res.sendStatus(200);
    }

    if (
      !req.user.roomInvites.includes(room._id) ||
      (room.invitedUsers && !room.invitedUsers.includes(req.user.username))
    )
      return res.sendStatus(401);

    req.user.roomInvites = req.user.roomInvites.filter(
      (invite) => !invite.equals(room._id)
    );
    req.user.rooms.push(room._id);
    await req.user.save();

    if (room.invitedUsers) {
      room.invitedUsers = room.invitedUsers.filter(
        (user) => user !== req.user.username
      );
      room.users.push(req.user.username);
      await room.save();
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Leave room

router.patch('/api/rooms/:roomId/leave', auth, inRoom, async (req, res) => {
  try {
    if (req.room.isDirect)
      return res
        .status(400)
        .send({ error: 'Unable to leave direct room, remove friend instead' });

    req.room.users = req.room.users.filter(
      (user) => user !== req.user.username
    );
    if (req.room.users.length < 1) {
      req.room.disabled = true;
      await req.room.save();
    } else {
      await req.room.save();
    }

    req.user.rooms = req.user.rooms.filter(
      (room) => !room.equals(req.params.roomId)
    );
    await req.user.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
