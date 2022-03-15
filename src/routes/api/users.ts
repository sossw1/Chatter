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
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
