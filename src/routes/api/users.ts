import UserCollection, { IUser, IUserDoc } from '../../models/User';
import auth from '../../middleware/auth';
import express from 'express';

const router = express.Router();

router.get('/api/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.post('/api/users', async (req, res) => {
  try {
    const user: IUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      tokens: [],
      rooms: []
    };
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

    res.status(500).send({ error: error });
  }
});

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

router.post('/api/users/logout/all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;

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

router.delete('/api/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error: any) {
    res.sendStatus(500);
  }
});
