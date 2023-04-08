import mongoose from 'mongoose';
import chalk from 'chalk';
import { deleteAllDocs } from './deleteAllDocs';
import { UserCollection } from '../../models/User';

const insertUsers = async () => {
  const userCount = parseInt(process.argv[2]);

  if (Number.isNaN(userCount)) return console.log('Users inserted: ', 0);

  for (let i = 0; i < userCount; i++) {
    const user = new UserCollection({
      username: `username${i + 1}`,
      password: 'asdfasdf',
      email: 'example@email.com',
      status: 'Offline',
      rooms: [],
      notifications: [],
      roomInvites: [],
      friends: [],
      friendInvites: [],
      socketIds: [],
      tokens: []
    });

    await user.save();
  }

  console.log('Users inserted: ', userCount);
};

const mongoURL =
  (process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/chatter') +
  '?retryWrites=true&w=majority';

mongoose.connect(mongoURL).then(async () => {
  console.log('MongoDB ' + chalk.green('connected'));

  await deleteAllDocs();
  await insertUsers();

  mongoose.disconnect();
});
