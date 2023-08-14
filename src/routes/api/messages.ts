import express from 'express';
import Filter from 'bad-words';
import { MessageCollection, IMessage } from '../../models/Room';
import auth from '../../middleware/auth';
import inRoom from '../../middleware/inRoom';

const router = express.Router();

// Send message to room

router.post('/api/rooms/:roomId/messages', auth, inRoom, async (req, res) => {
  try {
    const message: IMessage = {
      isSystemMessage: false,
      username: req.user.username,
      text: '' + req.body.text,
      roomId: req.room._id,
      hidden: false
    };

    const filter = new Filter();
    if (filter.isProfane(message.text))
      return res.status(400).send({ error: 'Message fails profanity check' });

    const messageDocument = new MessageCollection(message);
    await messageDocument.save();

    req.room.messages.push(messageDocument);
    await req.room.save();

    res.status(200).send(messageDocument);
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

      const messageDocument = await MessageCollection.findById(messageId);
      if (!messageDocument) return res.sendStatus(404);

      if (!messageDocument.roomId.equals(req.room._id))
        return res.sendStatus(404);

      if (messageDocument.username !== req.user.username)
        return res.sendStatus(401);

      messageDocument.hidden = true;
      await messageDocument.save();

      const roomMessage = req.room.messages.find((message) =>
        message._id.equals(messageId)
      );
      if (roomMessage) {
        roomMessage.hidden = true;
        await req.room.save();
      }

      res.status(200).send(messageDocument);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

export default router;
