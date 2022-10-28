import express from 'express';

import userRouter from './users';
import roomRouter from './rooms';
import messageRouter from './messages';

const router = express.Router();

router.use(userRouter, roomRouter, messageRouter);

export default router;
