import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../../Providers/theme';

export default function ChatList() {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box sx={{ padding: '1.5rem .75rem .75rem' }}>
      <Grid container direction='column'>
        <Grid item sx={{ width: '100%' }}>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Chats
          </Typography>
          <List sx={{ mb: '1rem' }}>
            <ListItem sx={{ p: 0 }}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        width: mdDown ? (smDown ? '8rem' : '13rem') : '23rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      username/roomname
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        width: mdDown ? (smDown ? '8rem' : '13rem') : '23rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Laboris est sint velit Lorem adipisicing et. Pariatur
                      eiusmod labore esse excepteur in veniam enim ipsum sunt.
                    </Typography>
                  }
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
        <Grid item>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Friends
          </Typography>
          <List>
            <ListItem sx={{ p: 0 }}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        width: mdDown ? (smDown ? '8rem' : '13rem') : '23rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      username
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        width: mdDown ? (smDown ? '8rem' : '13rem') : '23rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Duis do consequat est ut ex mollit sunt fugiat
                      pariatur.Veniam sit id do deserunt et.
                    </Typography>
                  }
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
