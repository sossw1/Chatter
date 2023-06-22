import mongoose from 'mongoose';
import chalk from 'chalk';

const mongoURL =
  (process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/chatter') +
  '?retryWrites=true&w=majority';

const mongooseConnect = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB ' + chalk.green('connected'));
  } catch (error: any) {
    chalk.red(error.message);
  }
};

mongooseConnect();
