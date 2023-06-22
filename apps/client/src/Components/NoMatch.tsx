import {
  Button,
  Box,
  Grid,
  Paper,
  useMediaQuery,
  Typography
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import theme from '../Providers/theme';

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function NoMatch() {
  const location = useLocation();
  const { from } = (location.state as LocationState) || {
    from: { pathname: '/chat' }
  };
  const prevPage = from.pathname;
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.dark,
        minHeight: '100vh',
        p: smDown ? '3rem 1.5rem' : '10rem 5rem'
      }}
    >
      <Paper sx={{ p: smDown ? '2rem' : '5rem' }}>
        <Grid container direction='column' alignItems='center'>
          <Grid item textAlign='center'>
            <Typography variant='h3' sx={{ mb: '0.5rem' }}>
              Oops!{' '}
              <span
                style={{
                  color: 'red',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                Error 404
              </span>
            </Typography>
            <Typography variant='h5' sx={{ mb: '1rem' }}>
              Looks like the page you were looking for isn't here.
            </Typography>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to={prevPage}
            >
              Return to previous page
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
