import { Box, Typography } from '@mui/material';
import theme from '../../Providers/theme';

interface Props {
  sentByUser: boolean;
  text: string;
}

export default function ChatMessage({ sentByUser, text }: Props) {
  return (
    <Box sx={{ mb: '0.25rem' }}>
      <Typography
        sx={{
          m: sentByUser ? '0 0 0 auto' : 0,
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
        {text}
      </Typography>
    </Box>
  );
}
