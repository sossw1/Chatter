import RoomCollection, { IRoom, IRoomDoc } from '../../models/Room';
import express from 'express';
import auth from '../../middleware/auth';
import Filter from 'bad-words';
import UserCollection from '../../models/User';

const router = express.Router();

router.get('/api/rooms/:id', auth, async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(404);
    if (!room.users.includes(req.user.username)) return res.sendStatus(404);
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
    if (!room.users.includes(req.user.username))
      return res
        .status(400)
        .send({ error: 'Room users must contain own username' });
    const filter = new Filter();
    if (filter.isProfane(room.name))
      return res.status(400).send({ error: 'Room name fails profanity check' });
    const roomDocument: IRoomDoc = new RoomCollection(room);
    await roomDocument.save();
    res.status(201).send(roomDocument);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/api/rooms/:id', auth, async (req, res) => {
  try {
    const name: string = req.body.name;
    if (!name && name !== '')
      return res.status(400).send({ error: 'Invalid updates' });
    const roomId: string = req.params.id;
    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(404);
    if (!room.users.includes(req.user.username)) return res.sendStatus(404);
    room.name = name;
    await room.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.patch('/api/rooms/:id/add', auth, async (req, res) => {
  try {
    const newRoomMember: string = req.body.username;
    if (!newRoomMember)
      return res.status(400).send({ error: 'Invalid updates' });
    const roomId: string = req.params.id;
    const room = await RoomCollection.findById(roomId);
    if (!room) return res.sendStatus(404);
    if (!room.users.includes(req.user.username)) return res.sendStatus(404);
    if (room.users.includes(newRoomMember))
      return res.status(400).send({ error: 'User already member of room' });
    const user = await UserCollection.findOne({ username: newRoomMember });
    if (!user) return res.sendStatus(404);
    room.users.push(newRoomMember);
    await room.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ error });
  }
});

export default router;
