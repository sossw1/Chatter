import express from 'express';

import userRouter from './users';
import roomRouter from './rooms';
import messageRouter from './messages';
import friendRouter from './friends';

const router = express.Router();

router.use(userRouter, roomRouter, messageRouter, friendRouter);

export default router;
