import UserCollection, { IUser, IUserDoc } from '../../models/User';
import express from 'express';

const router = express.Router();

router.post('/api/users', async (req, res) => {
  try {
    const user: IUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      rooms: []
    };
    const userDocument: IUserDoc = new UserCollection(user);
    await userDocument.save();
    res.status(201).send({ user: userDocument });
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

    res.sendStatus(500);
  }
});

export default router;
