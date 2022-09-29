import { Request, Response, NextFunction } from 'express';
import RoomCollection from '../models/Room';

const inRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = req.params.roomId;
    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(401);
    if (!room.users.includes(req.user.username)) return res.sendStatus(401);
    req.room = room;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

export default inRoom;
