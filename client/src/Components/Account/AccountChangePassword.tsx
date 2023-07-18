import { useState, FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../../Providers/theme';

interface SnackbarData {
  isOpen: boolean;
  severity: 'success' | 'error' | 'info';
  contents: string;
}

const defaultSnackbarData: SnackbarData = {
  isOpen: false,
  severity: 'info',
  contents: ''
};

export default function AccountChangePassword() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [snackbarData, setSnackbarData] =
    useState<SnackbarData>(defaultSnackbarData);

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarData(defaultSnackbarData);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !newPasswordConfirm) return;
    if (newPassword !== newPasswordConfirm) return;

    const data = { currentPassword, newPassword };

    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');

    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const response = await fetch('/api/users/password', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      setSnackbarData({
        isOpen: true,
        severity: 'success',
        contents: 'Successfully changed password'
      });
    } else {
      const { error } = await response.json();
      setSnackbarData({
        isOpen: true,
        severity: 'error',
        contents: 'Error: ' + error
      });
    }
  };

  return (
    <Paper sx={{ p: '2rem', width: xs ? '100%' : '75%', mb: '1rem' }}>
      <Snackbar
        open={snackbarData.isOpen}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarData.severity}
          elevation={6}
          variant='filled'
        >
          {snackbarData.contents}
        </Alert>
      </Snackbar>
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
          type='password'
          value={currentPassword}
          sx={{ mb: '1rem' }}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          id='new-password'
          label='New Password'
          type='password'
          value={newPassword}
          sx={{ mb: '1rem' }}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          id='new-password-confirm'
          label='Re-enter New Password'
          type='password'
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
