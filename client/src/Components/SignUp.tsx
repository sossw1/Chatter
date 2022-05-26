import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Alert,
  AlertTitle,
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
import { v4 as uuid } from 'uuid';
import { useAuth } from '../Providers/auth';
import theme from '../Providers/theme';
import { validate, ValidationError } from '../validation/signup';

export default function Signup() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [displayAlert, setDisplayAlert] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<ValidationError[]>([]);

  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const down450 = useMediaQuery(theme.breakpoints.down(450));

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDisplayAlert(false);
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
      case 'password2':
        setPassword2(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { isValid, errors } = validate(username, email, password, password2);
    if (isValid) {
      const response = await auth.signUp(username, email, password);
      if (response.type === 'confirmation') {
        navigate('/rooms');
      } else {
      }
    } else {
      setInputErrors(errors);
      setDisplayAlert(true);
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
                  inputProps={{ maxLength: 20 }}
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
                  inputProps={{ maxLength: 20 }}
                  onChange={handleChange}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='password2'
                  label='Re-enter password'
                  type='password'
                  id='password2'
                  inputProps={{ maxLength: 20 }}
                  onChange={handleChange}
                  sx={{ mb: '1rem' }}
                />
                {displayAlert && (
                  <Alert severity='error' sx={{ mb: '1rem' }}>
                    <AlertTitle>Error</AlertTitle>
                    <ul style={{ paddingLeft: '1rem' }}>
                      {inputErrors.map((error) => {
                        const key = uuid();
                        return <li key={key}>{error.error}</li>;
                      })}
                    </ul>
                  </Alert>
                )}
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
