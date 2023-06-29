import './config';
import apiRouter from './routes/api';
import { IUserDoc } from './models/User';
import './db/mongoose';
import chalk from 'chalk';
import express from 'express';
import http from 'http';
import path from 'path';
import { setupSocketIO } from './socket/socket';
import { IRoomDoc } from './models/Room';

declare global {
  namespace Express {
    interface Request {
      user: IUserDoc;
      token: string;
      room: IRoomDoc;
    }
  }
}

export interface Location {
  latitude: string;
  longitude: string;
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const app = express();
const router = express.Router();

const server = http.createServer(app);
export const io = setupSocketIO(server);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));

router.use(apiRouter);
app.use(router);

server.listen(PORT, () => {
  console.log('Server running on PORT', chalk.yellow(PORT));
});
