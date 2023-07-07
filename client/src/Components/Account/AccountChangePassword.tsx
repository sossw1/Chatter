import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../../Providers/theme';

export default function AccountChangePassword() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper sx={{ p: '2rem', width: xs ? '100%' : '75%', mb: '1rem' }}>
      <Box
        component='form'
        title='password-change-form'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        <Typography variant='h5' component='h2' mb='1rem'>
          Change Password
        </Typography>
        <TextField
          id='current-password'
          label='Current Password'
          sx={{ mb: '1rem' }}
        />
        <TextField id='new-password' label='New Password' sx={{ mb: '1rem' }} />
        <TextField
          id='new-password-confirm'
          label='Re-enter New Password'
          sx={{ mb: '1rem' }}
        />
        <Button variant='contained' type='submit' sx={{ width: '13rem' }}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
