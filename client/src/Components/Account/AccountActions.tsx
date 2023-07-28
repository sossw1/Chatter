import { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Paper,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

export default function AccountActions() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogoutAll = async () => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const response = await fetch('/api/users/logout/all', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) auth.logout();
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    await fetch('/api/users/me', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      }
    });

    auth.logout();
  };

  return (
    <Paper sx={{ p: '2rem', width: xs ? '100%' : '75%', mb: '1rem' }}>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Typography variant='h5' component='h2' mb='2rem'>
          Account Management
        </Typography>
        <Button
          variant='contained'
          onClick={handleLogoutAll}
          sx={{ mb: '2rem' }}
        >
          Log out of all sessions
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete my account permanently
        </Button>
        <Modal
          onClose={() => setIsDeleteModalOpen(false)}
          open={isDeleteModalOpen}
          aria-labelledby='modal'
          aria-describedby='modal-delete'
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: 12,
              p: '2rem'
            }}
          >
            <Typography variant='h6' mb='2rem'>
              You are about to delete your account. This is a <b>permanent</b>{' '}
              action and <b>cannot be undone</b>. Do you wish to continue?
            </Typography>
            <Box display='flex' flexDirection='row' justifyContent='center'>
              <Button
                variant='contained'
                color='error'
                sx={{ mr: '2rem' }}
                onClick={() => {
                  handleDeleteAccount();
                  setIsDeleteModalOpen(false);
                }}
              >
                Yes, delete my account
              </Button>
              <Button
                variant='contained'
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No, do not delete my account
              </Button>
            </Box>
          </Paper>
        </Modal>
      </Box>
    </Paper>
  );
}
