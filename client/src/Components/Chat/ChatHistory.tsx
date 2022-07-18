import { Avatar, Box, Typography, useMediaQuery } from '@mui/material';
import ChatMessage from './ChatMessage';
import { useAuth } from '../../Providers/auth';
import { v4 as uuid } from 'uuid';
import theme from '../../Providers/theme';

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

const messages: Message[] = [
  {
    username: 'asdfasdf',
    text: 'Nulla cillum quis est velit reprehenderit fugiat mollit aliqua dolore cupidatat.',
    timestamp: '3:50 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Consequat nulla amet ut qui.',
    timestamp: '3:51 PM'
  },
  {
    username: 'username',
    text: 'Eiusmod nisi ullamco pariatur consequat sint.',
    timestamp: '3:53 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Veniam aute duis et in nostrud ipsum.',
    timestamp: '3:55 PM'
  },
  {
    username: 'username',
    text: 'Eiusmod nisi ullamco pariatur consequat sint.',
    timestamp: '3:57 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Veniam aute duis et in nostrud ipsum.',
    timestamp: '3:59 PM'
  },
  {
    username: 'username',
    text: 'Eiusmod nisi ullamco pariatur consequat sint.',
    timestamp: '4:00 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Veniam aute duis et in nostrud ipsum.',
    timestamp: '4:01 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Veniam aute duis et in nostrud ipsum.',
    timestamp: '4:02 PM'
  },
  {
    username: 'username',
    text: 'Eiusmod nisi ullamco pariatur consequat sint.',
    timestamp: '4:02 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Veniam aute duis et in nostrud ipsum.',
    timestamp: '4:03 PM'
  }
];

const groupMessagesByUsername = (messages: Message[]) => {
  const groupedMessages: Message[][] = [];
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

export default function ChatHistory() {
  const { user } = useAuth();
  const username = user ? user.username : '';
  const groupedMessages = groupMessagesByUsername(messages);

  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        p: '1.25rem 1.25rem 0',
        height: `calc(100vh - 5.5rem - 94px - ${xs ? '56' : '64'}px)`,
        overflowY: 'scroll'
      }}
    >
      {groupedMessages.map((groupOfMessages) => {
        const sentByUser = groupOfMessages[0].username === username;
        return (
          <Box
            key={uuid()}
            sx={{
              display: 'flex',
              flexDirection: sentByUser ? 'row-reverse' : 'row',
              mb: '1rem'
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
                  key={uuid()}
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
                {groupOfMessages[0].timestamp}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
