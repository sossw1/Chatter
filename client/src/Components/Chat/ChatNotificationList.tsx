import { Badge, Button, Box, Tooltip } from '@mui/material';
import { Mail } from '@mui/icons-material';

interface Props {
  unreadNotificationCount: number;
}

export default function ChatNotificationList({
  unreadNotificationCount
}: Props) {
  return (
    <Box>
      <Tooltip title='Notifications'>
        <Button
          size='large'
          sx={{
            p: 0,
            minWidth: 'unset'
          }}
        >
          <Badge badgeContent={unreadNotificationCount} color='primary'>
            <Mail color='action' />
          </Badge>
        </Button>
      </Tooltip>
    </Box>
  );
}
