import { Avatar, Box, Paper, useMediaQuery } from '@mui/material';
import theme from '../../Providers/theme';

export default function Account() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      p='5%'
      bgcolor={theme.palette.grey[100]}
      height={`calc(100vh - ${xs ? '56' : '64'}px)`}
    >
      <Paper sx={{ width: '100%' }}>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          bgcolor={theme.palette.primary.main}
          height='6rem'
          pt='3rem'
          sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
        >
          <Avatar sx={{ width: '6rem', height: '6rem' }} />
        </Box>
        <Box p='5rem 2rem 2rem'></Box>
      </Paper>
    </Box>
  );
}
