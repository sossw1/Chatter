import { useState, FormEvent } from 'react';
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

export default function Account() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAuth();
  const [isUserUpdatingEmail, setIsUserUpdatingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!emailInput) return;
    const email = emailInput;

    setEmailInput(null);
    setIsUserUpdatingEmail(false);
  };

  return (
    <Box
      p={xs ? '1rem' : '2rem'}
      bgcolor={theme.palette.grey[100]}
      height={`calc(100vh - ${xs ? '56' : '64'}px)`}
    >
      <Link to='/chat'>
        <Box display='flex' flexDirection='row' alignItems='center' mb='1rem'>
          <ArrowBack sx={{ width: '1.5rem', height: '1.5rem', mr: '0.5rem' }} />
          <Typography variant='h6'>Go back to Chat</Typography>
        </Box>
      </Link>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: xs ? '100%' : '75%'
          }}
        >
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            bgcolor={theme.palette.primary.main}
            height='5rem'
            pt='2rem'
            sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
          >
            <Avatar sx={{ width: '6rem', height: '6rem' }} />
          </Box>
          <Box
            p='3.5rem 0 2rem'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Typography variant='h5' component='p'>
              {auth.user?.username}
            </Typography>
            <Typography
              variant='subtitle2'
              component='p'
              mb='1.5rem'
              fontWeight={300}
            >
              Joined:{' '}
              {auth.user
                ? format(new Date(auth.user?.createdAt), 'M/d/yyyy')
                : ''}
            </Typography>
            <Box
              display='flex'
              flexDirection={xs ? 'column' : 'row'}
              alignItems='center'
              justifyContent='center'
            >
              {isUserUpdatingEmail ? (
                <Box
                  component='form'
                  title='email-form'
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  onSubmit={handleSubmit}
                >
                  <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    autoComplete='email'
                    sx={{ mb: '1rem' }}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <Box display='flex' flexDirection='row'>
                    <Button
                      type='submit'
                      variant='contained'
                      sx={{ minWidth: 'unset', mr: '1rem' }}
                    >
                      Submit
                    </Button>
                    <Button
                      sx={{ minWidth: 'unset' }}
                      variant='outlined'
                      onClick={() => {
                        setEmailInput(null);
                        setIsUserUpdatingEmail(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography
                    variant='h6'
                    component='p'
                    mr={xs ? 0 : '1rem'}
                    fontSize={xs ? '1.5rem' : undefined}
                  >
                    Email
                  </Typography>
                  <Typography
                    variant='body1'
                    component='p'
                    fontSize='1.25rem'
                    mr={xs ? 0 : '1rem'}
                    mb={xs ? '1rem' : 0}
                  >
                    {auth.user?.email}
                  </Typography>
                  <Button
                    variant='contained'
                    onClick={() => setIsUserUpdatingEmail(true)}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
