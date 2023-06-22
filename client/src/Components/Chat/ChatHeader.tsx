import { useState, FormEvent } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Box,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Delete, Menu as MenuIcon, PersonAdd } from '@mui/icons-material';
import { IRoomDoc } from '../../types/Rooms';
import { getRoomName } from '../../utils/parse';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';
import { useChat } from '../../Providers/chat';

interface Props {
  handleDrawerToggle: () => void;
  selectedRoom: IRoomDoc | null;
}

export default function ChatHeader({
  handleDrawerToggle,
  selectedRoom
}: Props) {
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { user } = useAuth();
  const chat = useChat();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [formErrorText, setFormErrorText] = useState('');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const selectedRoomName =
    selectedRoom && user ? getRoomName(selectedRoom, user.username) : '';

  const handleInviteFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedRoom) {
      setInviteUsername('');
      return;
    }

    const username = inviteUsername;
    setInviteUsername('');

    const url = `api/rooms/${selectedRoom._id}/invite`;
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (!response.ok) {
      const { error } = await response.json();
      setFormErrorText(error);
    }
  };

  const handleLeaveConfirm = (roomId?: string) => {
    if (!roomId) return;
    setIsLeaveModalOpen(true);
  };

  const handleLeaveRoom = (roomId?: string) => {
    if (!roomId) return;

    const url = `api/rooms/${roomId}/leave`;
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      }
    });
  };

  return (
    <Box
      sx={{
        padding: selectedRoom?.isDirect ? '1.125rem 1.25rem' : '1.25rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Grid
        container
        direction='row'
        sx={{ height: '100%' }}
        alignItems='center'
      >
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerToggle}
          sx={{ mr: '0.5rem', display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        {selectedRoomName && (
          <>
            <Grid item sx={{ mr: '1rem' }}>
              {selectedRoom?.isDirect && (
                <Badge
                  overlap='circular'
                  variant='dot'
                  color={
                    selectedRoom?.isDirect
                      ? chat.findFriendStatus(selectedRoomName)?.statusColor
                      : 'neutral'
                  }
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{
                    '& .MuiBadge-badge': {
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                    }
                  }}
                >
                  <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
                </Badge>
              )}
              {!selectedRoom?.isDirect && (
                <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
              )}
            </Grid>
            <Grid item>
              <Grid container direction='column'>
                <Typography
                  variant='body1'
                  sx={{
                    width: downSM
                      ? 'calc(100vw - 15.5rem)'
                      : downMD
                      ? 'calc(100vw - 27.5rem)'
                      : downLG
                      ? 'calc(100vw - 32.5rem)'
                      : 'calc(100vw - 42.5rem)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {selectedRoomName}
                </Typography>
                {selectedRoom?.isDirect && (
                  <Grid item>
                    <Typography variant='body2' color='text.secondary'>
                      {selectedRoom?.isDirect
                        ? chat.findFriendStatus(selectedRoomName)?.status
                        : 'Loading'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {!selectedRoom?.isDirect && (
              <>
                <Grid item ml='auto'>
                  <Button
                    onClick={() => handleLeaveConfirm(selectedRoom?._id)}
                    sx={{ minWidth: 'unset' }}
                  >
                    <Delete />
                  </Button>
                  <Button
                    onClick={() => setIsInviteModalOpen(true)}
                    sx={{ minWidth: 'unset' }}
                  >
                    <PersonAdd />
                  </Button>
                </Grid>
                <Modal
                  onClose={() => setIsLeaveModalOpen(false)}
                  open={isLeaveModalOpen}
                  aria-labelledby='modal-form'
                  aria-describedby='modal-leave-form'
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
                    <Typography variant='h6' mb='1rem'>
                      Are you sure you want to leave this room?
                    </Typography>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='center'
                    >
                      <Button
                        variant='contained'
                        sx={{ mr: '2rem' }}
                        onClick={() => {
                          handleLeaveRoom(selectedRoom?._id || '');
                          setIsLeaveModalOpen(false);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        variant='contained'
                        onClick={() => setIsLeaveModalOpen(false)}
                      >
                        No
                      </Button>
                    </Box>
                  </Paper>
                </Modal>
                <Modal
                  onClose={() => setIsInviteModalOpen(false)}
                  open={isInviteModalOpen}
                  aria-labelledby='modal-form'
                  aria-describedby='modal-invite-form'
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
                    <Box
                      component='form'
                      title='invite-form'
                      display='flex'
                      flexDirection='column'
                      onSubmit={handleInviteFormSubmit}
                    >
                      <Typography variant='h5' mb='1rem'>
                        Invite friend to {selectedRoomName}
                      </Typography>
                      <TextField
                        id='username'
                        label='Username'
                        variant='outlined'
                        value={inviteUsername}
                        autoFocus
                        onChange={(e) => {
                          setInviteUsername(e.target.value);
                          setFormErrorText('');
                        }}
                        sx={{ mb: '0.5rem' }}
                      />
                      {formErrorText && (
                        <Typography
                          variant='caption'
                          color='error'
                          fontSize='0.85rem'
                          mb='0.5rem'
                        >
                          {formErrorText}
                        </Typography>
                      )}
                      <Button variant='contained' type='submit'>
                        Submit
                      </Button>
                    </Box>
                  </Paper>
                </Modal>
              </>
            )}
          </>
        )}
        {!selectedRoomName && <Box height='2.5rem'></Box>}
      </Grid>
    </Box>
  );
}
