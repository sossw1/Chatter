import { MouseEvent } from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../../Providers/theme';
import { IRoomDoc } from '../../types/Rooms';

interface Props {
  room: IRoomDoc;
  selectedChatId: string | null;
  handleChatSelection: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function ChatListItem({
  room,
  selectedChatId,
  handleChatSelection
}: Props) {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
        disableRipple
        sx={{
          borderRadius: '5px',
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.light,
            color: 'common.white'
          },
          '&.Mui-selected:hover': {
            backgroundColor: theme.palette.primary.light,
            opacity: 0.8
          }
        }}
        id={room._id}
        selected={selectedChatId === room._id}
        onClick={handleChatSelection}
      >
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
              {room.name}
            </Typography>
          }
          secondary={
            <Typography
              variant='body2'
              sx={{
                width: mdDown ? (smDown ? '8rem' : '13rem') : '23rem',
                opacity: 0.8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Laboris est sint velit Lorem adipisicing et. Pariatur eiusmod
              labore esse excepteur in veniam enim ipsum sunt.
            </Typography>
          }
        ></ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
