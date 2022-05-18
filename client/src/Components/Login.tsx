import { FormEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../Providers/theme';

export default function SignIn() {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
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
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  autoFocus
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
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value='remember'
                      color='primary'
                      disableRipple
                      sx={{ '&:hover': { backgroundColor: 'transparent' } }}
                    />
                  }
                  label='Remember me'
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disableTouchRipple
                >
                  Sign In
                </Button>
                <Grid container sx={{ mt: '.5rem' }}>
                  <Grid item xs>
                    <Link href='#' variant='subtitle1' underline='hover'>
                      Forgot password
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href='#' variant='subtitle1' underline='hover'>
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
