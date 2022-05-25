import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/auth';
import theme from '../Providers/theme';

export default function Signup() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const down450 = useMediaQuery(theme.breakpoints.down(450));

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    switch (event.target.id) {
      case 'username':
        setUsername(event.target.value);
        break;
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await auth.signUp(username, email, password);
    if (response.type === 'confirmation') {
      navigate('/rooms');
    } else {
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.dark,
        minHeight: '100vh'
      }}
    >
      <Container maxWidth='sm' sx={{ width: smDown ? '85%' : '70%' }}>
        <Box
          sx={{
            backgroundColor: theme.palette.common.white,
            minHeight: '100vh',
            padding: '3rem'
          }}
        >
          <Grid container direction='column' sx={{ mt: '5rem' }}>
            <Grid item textAlign='center'>
              <Typography component='h1' variant='h4'>
                Sign Up
              </Typography>
            </Grid>
            <Grid item>
              <Box component='form' onSubmit={handleSubmit}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  name='username'
                  autoComplete='username'
                  autoFocus
                  onChange={handleChange}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  onChange={handleChange}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  onChange={handleChange}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='password2'
                  label='Re-enter password'
                  type='password2'
                  id='password2'
                  onChange={handleChange}
                  sx={{ mb: '1rem' }}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disableTouchRipple
                >
                  Create Account
                </Button>
                <Grid
                  container
                  sx={{
                    mt: '.5rem'
                  }}
                  direction={down450 ? 'column' : 'row'}
                >
                  <Grid item xs textAlign={down450 ? 'center' : 'right'}>
                    <Link href='/' variant='subtitle1' underline='hover'>
                      Sign In
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
