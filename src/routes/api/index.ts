import express from 'express';

import userRouter from './users';
import roomRouter from './rooms';
import messageRouter from './messages';
import friendRouter from './friends';
import notificationRouter from './notifications';

const router = express.Router();

router.use(
  userRouter,
  roomRouter,
  messageRouter,
  friendRouter,
  notificationRouter
);

export default router;
