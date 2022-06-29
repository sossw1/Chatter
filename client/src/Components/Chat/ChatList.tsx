import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';

export default function ChatList() {
  return (
    <Box sx={{ padding: '1.5rem .5rem .5rem' }}>
      <Grid container direction='column'>
        <Grid item>
          <Typography variant='h5' color='primary' sx={{ ml: '.75rem' }}>
            Chats
          </Typography>
          <List sx={{ mb: '1rem' }}>
            <ListItem sx={{ padding: '.5rem .75rem' }}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary='username/roomname'
                secondary={
                  <Typography variant='body2' color='text.secondary'>
                    Laboris est sint velit Lorem adipisicing et.
                  </Typography>
                }
              ></ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid item>
          <Typography variant='h5' color='primary' sx={{ ml: '.75rem' }}>
            Friends
          </Typography>
          <List>
            <ListItem sx={{ padding: '.5rem .75rem' }}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary='username'
                secondary={
                  <Typography variant='body2' color='text.secondary'>
                    Qui aliqua Lorem proident nisi officia aliquip adipisicing
                    commodo nulla amet ad incididunt ipsum.
                  </Typography>
                }
              ></ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
