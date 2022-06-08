import { Box, Paper, useMediaQuery } from '@mui/material';
import theme from '../Providers/theme';

export default function Chat() {
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[200],
        p: '1rem'
      }}
    >
      <Paper
        sx={{ height: `calc(100vh - ${xsDown ? '5.5rem' : '6rem'})` }}
      ></Paper>
    </Box>
  );
}
