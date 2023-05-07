import express from 'express';
import auth from '../../middleware/auth';
import { NotificationCollection } from '../../models/User';

const router = express.Router();

// Mark a notification as read

router.patch(
  '/api/notifications/:notificationId/mark-read',
  auth,
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notificationDoc = await NotificationCollection.findById(
        notificationId
      );

      if (!notificationDoc)
        return res.status(404).send({
          error: `Notification not found`
        });

      const matchingDoc = req.user.notifications.find((notification) =>
        notification._id.equals(notificationId)
      );

      if (!matchingDoc)
        return res.status(404).send({ error: 'Not authorized' });

      if (
        [
          'friend-request-received',
          'friend-request-accepted',
          'room-invite-received'
        ].includes(notificationDoc.type)
      ) {
        await notificationDoc.delete();

        req.user.notifications = req.user.notifications.filter(
          (notification) => !notification._id.equals(notificationId)
        );
        await req.user.save();

        return res.sendStatus(200);
      }

      notificationDoc.isRead = true;
      await notificationDoc.save();
      matchingDoc.isRead = true;
      await req.user.save();

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

// Delete a notification

router.delete('/api/notifications/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notificationDoc = await NotificationCollection.findByIdAndDelete(
      notificationId
    );

    if (!notificationDoc)
      return res.status(404).send({ error: 'Notification not found' });

    req.user.notifications = req.user.notifications.filter(
      (notification) => !notification._id.equals(notificationId)
    );

    await req.user.save();

    res.status(200).send(notificationDoc);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
