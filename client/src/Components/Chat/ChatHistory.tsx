import { Avatar, Box, Typography } from '@mui/material';
import ChatMessage from './ChatMessage';

const sentByUser = false;

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
