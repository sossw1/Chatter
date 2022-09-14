import RoomCollection, { IRoom, IRoomDoc } from '../../models/Room';
import express from 'express';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/api/rooms/:id', auth, async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(404);
    res.status(200).send(room);
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.post('/api/rooms', auth, async (req, res) => {
  try {
    const room: IRoom = {
      name: req.body.name,
      users: req.body.users,
      messages: []
    };
    const roomDocument: IRoomDoc = new RoomCollection(room);
    await roomDocument.save();
    res.status(201).send(roomDocument);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
