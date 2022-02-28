import express from 'express';
import path from 'path';

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));

export default app;
