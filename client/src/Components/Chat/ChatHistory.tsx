import { Avatar, Box, Typography } from '@mui/material';
import theme from '../../Providers/theme';

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
          <Box sx={{ mb: '0.25rem' }}>
            <Typography
              sx={{
                m: '0 0 0 auto',
                color: sentByUser
                  ? theme.palette.common.white
                  : 'rgba(58, 53, 65, 0.87)',
                fontWeight: 400,
                boxShadow:
                  'rgb(58 53 65 / 20%) 0px 2px 1px -1px, rgb(58 53 65 / 14%) 0px 1px 1px 0px, rgb(58 53 65 / 12%) 0px 1px 3px 0px',
                borderRadius: `${sentByUser ? '6px' : '0'} ${
                  sentByUser ? '0' : '6px'
                } 6px 6px`,
                width: 'fit-content',
                padding: '0.875rem',
                backgroundColor: sentByUser
                  ? theme.palette.primary.main
                  : theme.palette.common.white
              }}
            >
              Lorem sint sit est nulla officia.
            </Typography>
          </Box>
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
