import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  AlertColor
} from '@mui/material';
import theme from '../../Providers/theme';

interface SnackbarData {
  isOpen: boolean;
  severity: AlertColor | undefined;
  contents: string;
}

const defaultSnackbarData: SnackbarData = {
  isOpen: false,
  severity: undefined,
  contents: ''
};

const defaultError = { error: false, text: '' };

export default function AccountChangePassword() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(defaultError);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState(defaultError);
  const [snackbarData, setSnackbarData] = useState(defaultSnackbarData);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    switch (event.target.id) {
      case 'current-password':
        setCurrentPassword(input);
        break;
      case 'new-password':
        setNewPassword(input);
        if (input.length < 8 || input.length > 20) {
          setNewPasswordError({
            error: true,
            text: 'Invalid new password length'
          });
        } else {
          setNewPasswordError(defaultError);
        }
        break;
      case 'new-password-confirm':
        setNewPasswordConfirm(input);
        if (input !== newPassword) {
          setConfirmPasswordError({
            error: true,
            text: 'Passwords must match'
          });
        } else {
          setConfirmPasswordError(defaultError);
        }
        break;
      default:
        break;
    }
  };

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarData(defaultSnackbarData);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !newPasswordConfirm) return;
    if (newPassword !== newPasswordConfirm) return;

    if (newPasswordError.error || confirmPasswordError.error) return;

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
          onChange={handleChange}
        />
        <TextField
          id='new-password'
          label='New Password'
          type='password'
          value={newPassword}
          error={newPasswordError.error}
          helperText={newPasswordError.text}
          sx={{ mb: '1rem' }}
          onChange={handleChange}
        />
        <TextField
          id='new-password-confirm'
          label='Re-enter New Password'
          type='password'
          value={newPasswordConfirm}
          error={confirmPasswordError.error}
          helperText={confirmPasswordError.text}
          sx={{ mb: '1rem' }}
          onChange={handleChange}
        />
        <Button variant='contained' type='submit' sx={{ width: '13rem' }}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
