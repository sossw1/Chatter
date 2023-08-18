import { MouseEvent } from 'react';
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery
} from '@mui/material';
import theme from '../../Providers/theme';
import { IRoomDoc } from '../../types/Rooms';
import { useAuth } from '../../Providers/auth';
import { useChat } from '../../Providers/chat';

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
  const { user } = useAuth();
  const chat = useChat();
  let username: string = '';
  if (user) username = user.username;

  const friendUsername = room.isDirect
    ? room.users.find((user) => user !== username)
    : '';
  const friendStatus = friendUsername
    ? chat.findFriendStatus(friendUsername)
    : undefined;

  const roomDataMatch = chat.roomData.find((r) => r.roomId === room._id);

  const latestMessage =
    room.messages.length > 0 ? room.messages[room.messages.length - 1] : null;
  const secondaryTextUsername =
    latestMessage && latestMessage.username !== 'System'
      ? latestMessage.username + ': '
      : '';
  const secondaryTextMessage = latestMessage ? latestMessage.text : '';
  const secondaryText = secondaryTextUsername + secondaryTextMessage;

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
          {friendStatus && (
            <Badge
              overlap='circular'
              variant='dot'
              color={friendStatus.statusColor}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                }
              }}
            >
              <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
          )}
          {(!room.isDirect || !friendStatus) && <Avatar />}
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              sx={{
                width: mdDown ? (smDown ? '6rem' : '11rem') : '21rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {room.name || friendUsername}
            </Typography>
          }
          secondary={
            <Typography
              variant='body2'
              sx={{
                width: mdDown ? (smDown ? '6rem' : '11rem') : '21rem',
                opacity: 0.8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {secondaryText}
            </Typography>
          }
        ></ListItemText>
        {roomDataMatch && (
          <ListItemText sx={{ ml: '0.5rem' }}>
            <Badge
              color='neutral'
              badgeContent={roomDataMatch.unreadMessageCount}
            ></Badge>
          </ListItemText>
        )}
      </ListItemButton>
    </ListItem>
  );
}
