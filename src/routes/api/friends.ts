import UserCollection from '../../models/User';
import { IRoom, IRoomDoc, RoomCollection } from '../../models/Room';
import auth from '../../middleware/auth';
import express from 'express';
import { io } from '../../index';

const router = express.Router();

// Invite user to be friends

router.post('/api/users/friend/invite', auth, async (req, res) => {
  try {
    const username = req.body.username;
    if (!username || typeof username !== 'string')
      return res.status(400).send({ error: 'Please provide a username' });

    if (username === req.user.username)
      return res.status(400).send({ error: 'Cannot invite self' });

    if (req.user.friends.includes(username))
      return res.status(400).send({ error: 'Already friends' });

    const userDocument = await UserCollection.findOne({ username });
    if (!userDocument) return res.status(404).send({ error: 'User not found' });

    if (userDocument.friendInvites.includes(req.user.username))
      return res.status(400).send({ error: 'Already invited' });

    userDocument.friendInvites.push(req.user.username);
    await userDocument.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Accept/Decline friend request

router.post('/api/users/friend/reply', auth, async (req, res) => {
  try {
    const { username, accept } = req.body;

    if (!username || typeof username !== 'string')
      return res.status(400).send({ error: 'Please provide a username' });

    if (!req.user.friendInvites.includes(username))
      return res.status(404).send({ error: 'Cannot find invite' });

    if (accept !== true && accept !== false)
      return res
        .status(400)
        .send({ error: 'Property `accept` must be a boolean value' });

    const userDocument = await UserCollection.findOne({ username });
    if (!userDocument)
      return res.status(404).send({ error: 'Cannot find user' });

    req.user.friendInvites = req.user.friendInvites.filter(
      (user) => user !== username
    );

    userDocument.friendInvites = userDocument.friendInvites.filter(
      (user) => user !== req.user.username
    );

    if (accept) {
      req.user.friends.push(username);
      userDocument.friends.push(req.user.username);

      const room: IRoom = {
        isDirect: true,
        users: [req.user.username, username],
        messages: [],
        disabled: false
      };

      const roomDocument: IRoomDoc = new RoomCollection(room);

      await roomDocument.save();

      req.user.rooms.push(roomDocument._id);
      userDocument.rooms.push(roomDocument._id);

      await req.user.save();
      await userDocument.save();

      io.to([...req.user.socketIds, ...userDocument.socketIds]).emit(
        'friend-request-accepted',
        roomDocument
      );

      return res.status(201).send(roomDocument);
    }

    await req.user.save();
    await userDocument.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Remove friend

router.delete('/api/users/friend', auth, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string')
      return res.status(400).send({ error: 'Please provide a username' });

    if (!req.user.friends.includes(username))
      return res.status(404).send({ error: 'Friend not found' });

    const userDocument = await UserCollection.findOne({ username });
    if (!userDocument) return res.status(404).send({ error: 'User not found' });

    const directRooms = await RoomCollection.find({ isDirect: true })
      .where('users')
      .all([username, req.user.username])
      .size(2);

    for (let currentRoom of directRooms) {
      req.user.rooms = req.user.rooms.filter(
        (room) => !room.equals(currentRoom._id)
      );
      userDocument.rooms = userDocument.rooms.filter(
        (room) => !room.equals(currentRoom._id)
      );

      if (currentRoom.messages.length === 0) {
        await currentRoom.remove();
      } else {
        currentRoom.users = [];
        currentRoom.disabled = true;
        await currentRoom.save();
      }
    }

    req.user.friends = req.user.friends.filter((user) => user !== username);
    await req.user.save();

    userDocument.friends = userDocument.friends.filter(
      (user) => user !== req.user.username
    );
    await userDocument.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
