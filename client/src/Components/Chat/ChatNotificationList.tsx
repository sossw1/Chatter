import { useState, MouseEvent } from 'react';
import { Badge, Button, Box, Paper, Popper, Tooltip } from '@mui/material';
import { Mail } from '@mui/icons-material';

interface Props {
  unreadNotificationCount: number;
}

export default function ChatNotificationList({
  unreadNotificationCount
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popper' : undefined;

  return (
    <Box>
      <Tooltip title='Notifications'>
        <Button
          size='large'
          sx={{
            p: 0,
            minWidth: 'unset'
          }}
          onClick={handleClick}
        >
          <Badge badgeContent={unreadNotificationCount} color='primary'>
            <Mail color='action' />
          </Badge>
        </Button>
      </Tooltip>
      <Popper id={id} open={open} anchorEl={anchorEl} sx={{ zIndex: 1201 }}>
        <Paper></Paper>
      </Popper>
    </Box>
  );
}
