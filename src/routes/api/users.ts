import UserCollection, { IUser, IUserDoc } from '../../models/User';
import { IRoom, IRoomDoc, RoomCollection } from '../../models/Room';
import auth from '../../middleware/auth';
import express from 'express';
import Filter from 'bad-words';

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
      tokens: [],
      rooms: [],
      roomInvites: [],
      friendInvites: [],
      friends: [],
      currentSocketId: ''
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

// Update email or password

router.patch('/api/users/me', auth, async (req, res) => {
  try {
    const user = req.user;
    const updates = Object.keys(req.body);

    const allowedUpdates = ['email', 'password'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates' });
    }

    const { email, password }: IUser = req.body;
    if (email || email === '') {
      user.email = email;
    }
    if (password || password === '') {
      user.password = password;
    }

    await user.save();

    res.send(user);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      let errorMessage = 'Invalid user data provided - ';
      const { errors } = error;

      if (errors.email) {
        errorMessage += errors.email.message;
      } else if (errors.password) {
        errorMessage += errors.password.message;
      } else {
        errorMessage = errorMessage.slice(0, -3);
      }

      return res.status(400).send({ error: errorMessage });
    }
    res.sendStatus(500);
  }
});

// Delete own user data

router.delete('/api/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (error: any) {
    res.sendStatus(500);
  }
});

// Invite user to be friends

router.post('/api/users/friend-request', auth, async (req, res) => {
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

router.post('/api/users/friend-request/reply', auth, async (req, res) => {
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
        messages: []
      };

      const roomDocument: IRoomDoc = new RoomCollection(room);

      await roomDocument.save();
      await req.user.save();
      await userDocument.save();

      return res.status(201).send(roomDocument);
    }

    await req.user.save();
    await userDocument.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
