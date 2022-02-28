import app from './app';
import chalk from 'chalk';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('App listening on port', chalk.yellow(PORT));
});
