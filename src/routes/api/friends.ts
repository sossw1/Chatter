import {
  INotificationDoc,
  IRoomData,
  NotificationCollection,
  UserCollection
} from '../../models/User';
import { IRoom, IRoomDoc, RoomCollection } from '../../models/Room';
import auth from '../../middleware/auth';
import express from 'express';
import { io } from '../../index';

const router = express.Router();

// Get friend's status

router.post('/api/users/friend/status', auth, async (req, res) => {
  try {
    const username = req.body.username;

    if (!username)
      return res.status(400).send({ error: 'Invalid friend username' });

    if (!req.user.friends.includes(username))
      return res.status(404).send({ error: 'Friend not found' });

    const userDocument = await UserCollection.findOne({ username });

    if (!userDocument)
      return res.status(404).send({ error: 'Friend not found' });

    const { status } = userDocument;

    if (status === 'Invisible') {
      return res.status(200).send({ status: 'Offline' });
    }

    res.status(200).send({ status });
  } catch (error) {
    res.sendStatus(500);
  }
});

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

      const newRoomData: IRoomData = {
        roomId: roomDocument._id,
        lastReadAt: JSON.stringify(Date.now())
      };

      req.user.rooms.push(newRoomData);
      userDocument.rooms.push(newRoomData);

      const notification = new NotificationCollection({
        type: 'friend-request-accepted',
        text: `${req.user.username}`,
        isRead: false
      });

      userDocument.notifications.unshift(notification);
      await notification.save();

      await req.user.save();
      await userDocument.save();

      const reqUserStatus =
        req.user.status === 'Invisible' ? 'Offline' : req.user.status;

      const friendStatus =
        userDocument.status === 'Invisible' ? 'Offline' : req.user.status;

      io.to([...req.user.socketIds]).emit(
        'friend-request-accepted',
        roomDocument,
        userDocument.username,
        friendStatus
      );

      io.to([...userDocument.socketIds]).emit(
        'friend-request-accepted',
        roomDocument,
        req.user.username,
        reqUserStatus,
        notification
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
        (room) => !room.roomId.equals(currentRoom._id)
      );
      userDocument.rooms = userDocument.rooms.filter(
        (room) => !room.roomId.equals(currentRoom._id)
      );

      if (currentRoom.messages.length === 0) {
        await currentRoom.remove();
      } else {
        currentRoom.users = [];
        currentRoom.disabled = true;
        await currentRoom.save();
      }
    }

    const requesterNotificationsToDelete: string[] = [];
    const friendNotificationsToDelete: string[] = [];

    req.user.friends = req.user.friends.filter((user) => user !== username);
    req.user.notifications = req.user.notifications.filter((notification) => {
      if (notification.text === userDocument.username) {
        requesterNotificationsToDelete.push(notification._id);
        return false;
      }
      return true;
    });
    await req.user.save();

    userDocument.friends = userDocument.friends.filter(
      (user) => user !== req.user.username
    );
    userDocument.notifications = userDocument.notifications.filter(
      (notification) => {
        if (notification.text === req.user.username) {
          friendNotificationsToDelete.push(notification._id);
          return false;
        }
        return true;
      }
    );
    await userDocument.save();

    io.to([...req.user.socketIds]).emit('delete-friend', userDocument.username);
    io.to([...req.user.socketIds]).emit(
      'delete-notifications',
      requesterNotificationsToDelete
    );
    io.to([...userDocument.socketIds]).emit('delete-friend', req.user.username);
    io.to([...userDocument.socketIds]).emit(
      'delete-notifications',
      friendNotificationsToDelete
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
