import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

import { useAuth } from '../Providers/auth';
import theme from '../Providers/theme';

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function SignIn() {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const { from } = (location.state as LocationState) || {
    from: { pathname: '/rooms' }
  };
  const nextPage = from.pathname;

  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const down450 = useMediaQuery(theme.breakpoints.down(450));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const response = await auth.setUserWithToken();
      if (response.type === 'confirmation') {
        navigate(nextPage, { replace: true });
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLoginError('');
    switch (event.target.id) {
      case 'username':
        setUsername(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await auth.login(username, password);
    if (response.type === 'confirmation') {
      navigate(nextPage);
    } else {
      setLoginError(response.error);
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
                Sign In
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
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  onChange={handleChange}
                  sx={{ mb: '1rem' }}
                />
                {loginError !== '' && (
                  <Alert severity='error' sx={{ mb: '1rem' }}>
                    {loginError}
                  </Alert>
                )}
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disableTouchRipple
                >
                  Sign In
                </Button>
                <Grid
                  container
                  sx={{
                    mt: '.5rem'
                  }}
                  direction={down450 ? 'column' : 'row'}
                >
                  <Grid item xs textAlign={down450 ? 'center' : 'left'}>
                    <Link href='#' variant='subtitle1' underline='hover'>
                      Forgot password
                    </Link>
                  </Grid>
                  <Grid item xs textAlign={down450 ? 'center' : 'right'}>
                    <Link href='/signup' variant='subtitle1' underline='hover'>
                      Sign Up
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
