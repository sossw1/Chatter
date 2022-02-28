import chalk from 'chalk';
import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;
const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));

app.listen(PORT, () => {
  console.log('Server running on port', chalk.yellow(PORT));
});
