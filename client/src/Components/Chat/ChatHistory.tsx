import { Avatar, Box, Typography, useMediaQuery } from '@mui/material';
import ChatMessage from './ChatMessage';
import { useAuth } from '../../Providers/auth';
import { IMessageDoc } from '../../types/Rooms';
import { v4 as uuid } from 'uuid';
import theme from '../../Providers/theme';

interface Props {
  displayMessages: IMessageDoc[];
  messageRef: React.MutableRefObject<null | HTMLDivElement>;
}

const groupMessagesByUsername = (messages: IMessageDoc[]) => {
  const groupedMessages: IMessageDoc[][] = [];
  if (messages.length === 0) return groupedMessages;
  let currentGroup = [messages[0]];
  let currentUsername = messages[0].username;
  for (let i = 1; i < messages.length; i++) {
    const currentMessage = messages[i];
    if (currentMessage.username === currentUsername) {
      currentGroup.push(currentMessage);
    } else {
      groupedMessages.push(currentGroup);
      currentGroup = [currentMessage];
      currentUsername = currentMessage.username;
    }
  }
  groupedMessages.push(currentGroup);
  return groupedMessages;
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const shortYear = date.getFullYear().toString().slice(-2);
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = date.getHours() > 12 ? 'PM' : 'AM';
  return `${month}/${day}/${shortYear} ${hours}:${minutes}${amOrPm}`;
};

export default function ChatHistory({ displayMessages, messageRef }: Props) {
  const { user } = useAuth();
  const username = user ? user.username : '';
  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        p: '1.25rem 1.25rem 0',
        height: `calc(100vh - 5.5rem - 94px - ${xs ? '56' : '64'}px)`,
        overflowY: 'scroll'
      }}
      ref={messageRef}
    >
      {groupMessagesByUsername(displayMessages).map((groupOfMessages) => {
        const sentByUser = groupOfMessages[0].username === username;
        return (
          <Box
            key={uuid()}
            sx={{
              display: 'flex',
              flexDirection: sentByUser ? 'row-reverse' : 'row',
              pb: '1rem'
            }}
          >
            <Avatar
              sx={{
                width: '2.25rem',
                height: '2.25rem',
                ml: sentByUser ? '1rem' : undefined,
                mr: sentByUser ? undefined : '1rem'
              }}
            />
            <Box sx={{ maxWidth: '65%' }}>
              {groupOfMessages.map((message) => (
                <ChatMessage
                  key={message._id}
                  sentByUser={sentByUser}
                  text={message.text}
                />
              ))}
              <Typography
                variant='body2'
                sx={{
                  textAlign: sentByUser ? 'right' : 'left',
                  fontWeight: 400,
                  opacity: '70%'
                }}
              >
                {formatDate(groupOfMessages[0].createdAt)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
