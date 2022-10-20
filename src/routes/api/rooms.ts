import {
  IRoom,
  IRoomDoc,
  RoomCollection,
  MessageCollection
} from '../../models/Room';
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
      messages: []
    };

    if (!room.users.includes(req.user.username))
      return res
        .status(400)
        .send({ error: 'Room users must contain own username' });

    const filter = new Filter();
    if (filter.isProfane(room.name))
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

    if (newRoomMember === req.user.username)
      return res.status(400).send({ error: 'Cannot invite self' });

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
      req.user.invites = req.user.invites.filter(
        (invite) => !invite.equals(room._id)
      );
      await req.user.save();

      room.invitedUsers = room.invitedUsers.filter(
        (user) => user !== req.user.username
      );
      await room.save();

      return res.sendStatus(200);
    }

    if (
      !req.user.invites.includes(room._id) ||
      !room.invitedUsers.includes(req.user.username)
    )
      return res.sendStatus(401);

    req.user.invites = req.user.invites.filter(
      (invite) => !invite.equals(room._id)
    );
    req.user.rooms.push(room._id);
    await req.user.save();

    room.invitedUsers = room.invitedUsers.filter(
      (user) => user !== req.user.username
    );
    room.users.push(req.user.username);
    await room.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Leave room

router.patch('/api/rooms/:roomId/leave', auth, inRoom, async (req, res) => {
  req.room.users = req.room.users.filter((user) => user !== req.user.username);
  await req.room.save();

  req.user.rooms = req.user.rooms.filter(
    (room) => !room.equals(req.params.roomId)
  );
  await req.user.save();

  res.sendStatus(200);
});

// Delete room

router.delete('/api/rooms/:roomId', auth, inRoom, async (req, res) => {
  const { users } = req.room;

  for (let user of users) {
    const userDocument = await UserCollection.findOne({ username: user });
    if (!userDocument) continue;

    userDocument.rooms = userDocument.rooms.filter(
      (room) => !room.equals(req.params.roomId)
    );

    await userDocument.save();
  }

  const deletedRoom = await req.room.remove();

  res.status(200).send(deletedRoom);
});

// Read messages in room

router.get('/api/rooms/:roomId/messages', auth, inRoom, async (req, res) => {
  res.status(200).send(req.room.messages);
});

// Send message to room

router.post('/api/rooms/:roomId/messages', auth, inRoom, async (req, res) => {
  try {
    const message = {
      username: req.user.username,
      text: '' + req.body.text,
      roomId: req.room._id
    };

    const messageDocument = new MessageCollection(message);
    await messageDocument.save();

    req.room.messages.push(messageDocument);
    await req.room.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Delete message from history

router.delete(
  '/api/rooms/:roomId/messages/:messageId',
  auth,
  inRoom,
  async (req, res) => {
    const messageId = req.params.messageId;
    if (!messageId) return res.sendStatus(404);

    const message = await MessageCollection.findById(messageId);
    if (!message) return res.sendStatus(404);

    if (!message.roomId.equals(req.room._id)) return res.sendStatus(404);

    if (message.username !== req.user.username) return res.sendStatus(401);

    const result = await MessageCollection.findByIdAndDelete(messageId);

    req.room.messages = req.room.messages.filter(
      (message) => !message._id.equals(messageId)
    );
    await req.room.save();

    res.send(result);
  }
);

export default router;
