import express from 'express';
import Filter from 'bad-words';
import { io } from '../../index';
import auth from '../../middleware/auth';
import inRoom from '../../middleware/inRoom';
import {
  IRoom,
  IRoomDoc,
  MessageCollection,
  RoomCollection
} from '../../models/Room';
import {
  IRoomData,
  NotificationCollection,
  UserCollection,
  RoomInvite
} from '../../models/User';

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
      users: [req.user.username],
      invitedUsers: [],
      messages: [],
      disabled: false
    };

    if (!room.name)
      return res.status(400).send({ error: 'Must provide room name' });

    const filter = new Filter();
    if (room.name && filter.isProfane(room.name))
      return res.status(400).send({ error: 'Room name fails profanity check' });

    const roomDocument: IRoomDoc = new RoomCollection(room);
    await roomDocument.save();

    const newRoomData: IRoomData = {
      roomId: roomDocument._id,
      lastReadAt: JSON.stringify(Date.now())
    };

    req.user.rooms.push(newRoomData);
    await req.user.save();

    res.status(201).send(roomDocument);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Update room lastReadAt time

router.patch('/api/rooms/:roomId/last-read', auth, inRoom, async (req, res) => {
  try {
    const { room } = req;
    const roomId = room._id;

    if (!roomId) return res.status(400).send({ error: 'Invalid roomId' });

    const match = req.user.rooms.find((room) => roomId.equals(room.roomId));
    if (!match) return res.status(404).send({ error: 'Room not found' });

    match.lastReadAt = JSON.stringify(Date.now());
    await req.user.save();
    res.status(200).send({ lastReadAt: match.lastReadAt });
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
    if (!user) return res.status(404).send({ error: 'Friend not found' });

    if (
      !req.user.friends.includes(newRoomMember) ||
      !user.friends.includes(req.user.username)
    )
      return res.status(404).send({ error: 'Friend not found' });

    if (room.invitedUsers && !room.invitedUsers.includes(newRoomMember)) {
      room.invitedUsers.push(newRoomMember);
      await room.save();
    }

    const duplicateInvite = user.roomInvites.find((invite) =>
      invite.roomId.equals(room._id)
    );

    if (!duplicateInvite) {
      const newInvite: RoomInvite = {
        roomName: room.name || '',
        roomId: room._id
      };

      user.roomInvites.push(newInvite);

      const notification = new NotificationCollection({
        type: 'room-invite-received',
        text: `${room.name}`,
        isRead: false
      });

      user.notifications.unshift(notification);
      await notification.save();

      io.to([...user.socketIds]).emit('room-invite', newInvite, notification);
    }

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

    if (!roomId || (accept !== true && accept !== false)) {
      req.user.roomInvites = req.user.roomInvites.filter(
        (invite) => !invite.roomId.equals(roomId)
      );
      req.user.save();
      return res.status(400).send({ error: 'Invalid updates' });
    }

    const room = await RoomCollection.findById(roomId);
    if (!room) {
      req.user.roomInvites = req.user.roomInvites.filter(
        (invite) => !invite.roomId.equals(roomId)
      );
      req.user.save();
      return res.status(404).send({ error: 'Room not found' });
    }

    if (room.disabled) {
      req.user.roomInvites = req.user.roomInvites.filter(
        (invite) => !invite.roomId.equals(room._id)
      );
      req.user.save();
      return res.status(400).send({ error: 'Invalid invite' });
    }

    if (!accept) {
      req.user.roomInvites = req.user.roomInvites.filter(
        (invite) => !invite.roomId.equals(room._id)
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
      !req.user.roomInvites.find((invite) => invite.roomId.equals(room._id)) ||
      (room.invitedUsers && !room.invitedUsers.includes(req.user.username))
    )
      return res.status(400).send({ error: 'Invalid invite' });

    req.user.roomInvites = req.user.roomInvites.filter(
      (invite) => !invite.roomId.equals(room._id)
    );

    const newRoomData: IRoomData = {
      roomId: room._id,
      lastReadAt: JSON.stringify(Date.now())
    };

    req.user.rooms.push(newRoomData);
    await req.user.save();

    if (room.invitedUsers) {
      room.invitedUsers = room.invitedUsers.filter(
        (user) => user !== req.user.username
      );
      room.users.push(req.user.username);
    }

    const systemMessage = new MessageCollection({
      isSystemMessage: true,
      username: 'System',
      text: `${req.user.username} has joined the room.`,
      roomId: room._id,
      hidden: false
    });

    await systemMessage.save();
    room.messages.push(systemMessage);
    await room.save();

    room.users.map(async (username) => {
      if (username === req.user.username) return;
      const userDocument = await UserCollection.findOne({ username });
      if (userDocument) {
        io.to([...userDocument.socketIds]).emit('message', systemMessage);
      }
    });

    res.status(200).send(room);
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
    if (req.room.users.length === 0) {
      if (req.room.messages.length === 0) {
        await req.room.remove();
      } else {
        req.room.disabled = true;
        req.room.invitedUsers = [];
        await req.room.save();
      }

      if (req.room.invitedUsers) {
        for (let invitedUser of req.room.invitedUsers) {
          const invitedUserDocument = await UserCollection.findOne({
            username: invitedUser
          });
          if (invitedUserDocument) {
            io.to([...invitedUserDocument.socketIds]).emit(
              'delete-room-invite',
              req.room._id,
              req.room.name
            );
          }
        }
      }
    } else {
      const systemMessage = new MessageCollection({
        isSystemMessage: true,
        username: 'System',
        text: `${req.user.username} has left the room.`,
        roomId: req.room._id,
        hidden: false
      });

      req.room.messages.push(systemMessage);

      await systemMessage.save();
      await req.room.save();

      req.room.users.map(async (username) => {
        const userDocument = await UserCollection.findOne({ username });
        if (userDocument) {
          io.to([...userDocument.socketIds]).emit('message', systemMessage);
        }
      });
    }

    req.user.rooms = req.user.rooms.filter(
      (room) => !room.roomId.equals(req.params.roomId)
    );
    await req.user.save();

    io.to([...req.user.socketIds]).emit('leave-room', req.params.roomId);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
