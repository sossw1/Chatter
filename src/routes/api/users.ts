import {
  UserCollection,
  IUser,
  IUserDoc,
  NotificationCollection
} from '../../models/User';
import auth from '../../middleware/auth';
import express from 'express';
import bcrypt from 'bcryptjs';
import Filter from 'bad-words';
import { RoomCollection } from '../../models/Room';

const router = express.Router();

// Get own user data

router.get('/api/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// Create new user

router.post('/api/users', async (req, res) => {
  try {
    const user: IUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      status: 'Offline',
      tokens: [],
      rooms: [],
      notifications: [],
      roomInvites: [],
      friendInvites: [],
      friends: [],
      socketIds: []
    };

    const filter = new Filter();
    if (filter.isProfane(user.username))
      return res.status(400).send({ error: 'Username fails profanity check' });

    const userDocument: IUserDoc = new UserCollection(user);
    await userDocument.save();

    const token = await userDocument.generateAuthToken();

    res.status(201).send({ user: userDocument, token });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      let errorMessage = 'Invalid user data provided - ';
      const { errors } = error;

      if (errors.username) {
        errorMessage += errors.username.message;
      } else if (errors.email) {
        errorMessage += errors.email.message;
      } else if (errors.password) {
        errorMessage += errors.password.message;
      } else {
        errorMessage = errorMessage.slice(0, -3);
      }

      return res.status(400).send({ error: errorMessage });
    }

    if (error.code === 11000 && error.keyPattern.username) {
      return res.status(400).send({ error: 'Username already in use' });
    }

    res.sendStatus(500);
  }
});

// Log in

router.post('/api/users/login', async (req, res) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;
    const user = await UserCollection.findByCredentials(username, password);

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Invalid username/password' });
  }
});

// Log out

router.post('/api/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Log out of all devices

router.post('/api/users/logout/all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Update email

router.patch('/api/users/email', auth, async (req, res) => {
  try {
    const user = req.user;
    const newEmail = req.body.email;

    if (!newEmail) return res.status(400).send({ error: 'Invalid email' });

    user.email = newEmail;
    await user.save();

    res.sendStatus(200);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      let errorMessage = '';
      const { errors } = error;

      if (errors.email) {
        errorMessage += errors.email.message;
      } else {
        errorMessage = errorMessage.slice(0, -3);
      }

      return res.status(400).send({ error: errorMessage });
    }
  }
});

// Update password

router.patch('/api/users/password', auth, async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || currentPassword === newPassword)
      return res.status(400).send({ error: 'Invalid update' });

    const isMatchingPassword = await bcrypt.compare(
      currentPassword,
      req.user.password
    );
    if (!isMatchingPassword)
      return res.status(401).send({ error: 'Invalid password' });

    if (newPassword.length < 8 || newPassword.length > 20)
      return res.status(400).send({ error: 'Invalid new password length' });

    req.user.password = newPassword;

    await user.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Delete own user data

router.delete('/api/users/me', auth, async (req, res) => {
  try {
    const friends = req.user.friends;
    for (let friend of friends) {
      const friendDocument = await UserCollection.findOne({ username: friend });
      if (!friendDocument) continue;

      friendDocument.friends = friendDocument.friends.filter(
        (user) => user !== req.user.username
      );
      await friendDocument.save();
    }

    const usersInvitedToBeFriends = await UserCollection.find()
      .where('friendInvites')
      .all([req.user.username]);
    for (let user of usersInvitedToBeFriends) {
      user.friendInvites = user.friendInvites.filter(
        (invite) => invite !== req.user.username
      );
      await user.save();
    }

    const rooms = req.user.rooms;
    for (let room of rooms) {
      const roomDocument = await RoomCollection.findById(room.roomId);
      if (!roomDocument) continue;

      if (roomDocument.isDirect) {
        roomDocument.disabled = true;

        const friend = roomDocument.users.find(
          (user) => user !== req.user.username
        );
        if (friend) {
          const friendDocument = await UserCollection.findOne({
            username: friend
          });
          if (friendDocument) {
            friendDocument.rooms = friendDocument.rooms.filter(
              (room) => !room.roomId.equals(roomDocument._id)
            );
            await friendDocument.save();
          }
        }

        roomDocument.users = [];
        await roomDocument.save();
      } else {
        roomDocument.users = roomDocument.users.filter(
          (user) => user !== req.user.username
        );

        if (roomDocument.users.length === 0) {
          if (roomDocument.messages.length === 0) {
            await roomDocument.remove();
          } else {
            roomDocument.disabled = true;
            roomDocument.invitedUsers = [];
            await roomDocument.save();
          }
        } else {
          await roomDocument.save();
        }
      }
    }

    const roomInvites = req.user.roomInvites;
    for (let invite of roomInvites) {
      const roomDocument = await RoomCollection.findById(invite.roomId);
      if (!roomDocument) continue;

      if (!roomDocument.isDirect) {
        if (roomDocument.invitedUsers) {
          roomDocument.invitedUsers = roomDocument.invitedUsers.filter(
            (user) => user !== req.user.username
          );

          await roomDocument.save();
        }
      }
    }

    const notifications = req.user.notifications;
    const deleteRequests = notifications.map((notification) =>
      NotificationCollection.findByIdAndDelete(notification._id)
    );
    await Promise.all(deleteRequests);

    await req.user.remove();

    res.send(req.user);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
