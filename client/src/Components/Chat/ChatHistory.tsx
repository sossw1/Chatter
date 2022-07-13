import { Avatar, Box, Typography } from '@mui/material';
import ChatMessage from './ChatMessage';

const sentByUser = false;

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
    username: 'jason',
    text: 'Eiusmod nisi ullamco pariatur consequat sint.',
    timestamp: '3:53 PM'
  },
  {
    username: 'asdfasdf',
    text: 'Veniam aute duis et in nostrud ipsum.',
    timestamp: '3:55 PM'
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
  return (
    <Box sx={{ p: '1.25rem 1.25rem 5.25rem', height: '49.5rem' }}>
      <Box
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
          <ChatMessage
            sentByUser={sentByUser}
            text={'Est labore ipsum sint ex.'}
          />
          <Typography
            variant='body2'
            sx={{
              textAlign: sentByUser ? 'right' : 'left',
              fontWeight: 400,
              opacity: '70%'
            }}
          >
            12:00 PM
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
