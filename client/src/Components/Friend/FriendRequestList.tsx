import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import theme from '../../Providers/theme';

export default function FriendRequestList() {
  return (
    <Box display='flex' flexDirection='column'>
      <Typography variant='h3' mb='1.5rem'>
        Friend Requests
      </Typography>
      <Divider />
      <List>
        <ListItem>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            p='0.25rem 0'
          >
            <Avatar sx={{ width: '2.5rem', height: '2.5rem', mr: '1.5rem' }} />
            <Typography variant='h5' mr='1rem'>
              asdfasdf3
            </Typography>
            <Button sx={{ color: theme.palette.success.main }}>
              <Check />
            </Button>
            <Button sx={{ color: theme.palette.error.main }}>
              <Close />
            </Button>
          </Box>
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
}
