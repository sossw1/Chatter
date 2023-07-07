import { useState, FormEvent } from 'react';
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !newPasswordConfirm) return;

    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  return (
    <Paper sx={{ p: '2rem', width: xs ? '100%' : '75%', mb: '1rem' }}>
      <Box
        component='form'
        title='password-change-form'
        display='flex'
        flexDirection='column'
        alignItems='center'
        onSubmit={handleSubmit}
      >
        <Typography variant='h5' component='h2' mb='1rem'>
          Change Password
        </Typography>
        <TextField
          id='current-password'
          label='Current Password'
          value={currentPassword}
          sx={{ mb: '1rem' }}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          id='new-password'
          label='New Password'
          value={newPassword}
          sx={{ mb: '1rem' }}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          id='new-password-confirm'
          label='Re-enter New Password'
          value={newPasswordConfirm}
          sx={{ mb: '1rem' }}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
        />
        <Button variant='contained' type='submit' sx={{ width: '13rem' }}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
