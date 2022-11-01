import express from 'express';
import Filter from 'bad-words';

import { MessageCollection } from '../../models/Room';
import auth from '../../middleware/auth';
import inRoom from '../../middleware/inRoom';

const router = express.Router();

// Read messages in room

router.get('/api/rooms/:roomId/messages', auth, inRoom, async (req, res) => {
  res.status(200).send(req.room.messages);
});

// Send message to room

router.post('/api/rooms/:roomId/messages', auth, inRoom, async (req, res) => {
  try {
    const message = {
      username: req.user.username,
      text: '' + req.body.text,
      roomId: req.room._id
    };

    const filter = new Filter();
    if (filter.isProfane(message.text))
      return res.status(400).send({ error: 'Message fails profanity check' });

    const messageDocument = new MessageCollection(message);
    await messageDocument.save();

    req.room.messages.push(messageDocument);
    await req.room.save();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Delete message from history

router.delete(
  '/api/rooms/:roomId/messages/:messageId',
  auth,
  inRoom,
  async (req, res) => {
    try {
      const messageId = req.params.messageId;
      if (!messageId) return res.sendStatus(404);

      const message = await MessageCollection.findById(messageId);
      if (!message) return res.sendStatus(404);

      if (!message.roomId.equals(req.room._id)) return res.sendStatus(404);

      if (message.username !== req.user.username) return res.sendStatus(401);

      const result = await MessageCollection.findByIdAndDelete(messageId);

      req.room.messages = req.room.messages.filter(
        (message) => !message._id.equals(messageId)
      );
      await req.room.save();

      res.send(result);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

export default router;
