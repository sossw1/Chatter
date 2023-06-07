import { useState, MouseEvent } from 'react';
import { Badge, Button, Menu, MenuItem } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import theme from '../Providers/theme';
import { useChat, UserStatusText, StatusColor } from '../Providers/chat';
import { useSocket } from '../Providers/socket';

const statusOptions: UserStatusText[] = ['Online', 'Away', 'Invisible'];
const statusOptionColors: StatusColor[] = ['success', 'warning', 'neutral'];

export default function StatusMenu() {
  const chat = useChat();
  const socket = useSocket();

  const [statusMenuAnchorEl, setStatusMenuAnchorEl] =
    useState<HTMLElement | null>(null);

  const isStatusMenuOpen = Boolean(statusMenuAnchorEl);

  const handleStatusMenuClick = (event: MouseEvent<HTMLButtonElement>) =>
    setStatusMenuAnchorEl(event.currentTarget);

  const handleStatusMenuClose = (selectedStatus: UserStatusText | null) => {
    if (selectedStatus) {
      chat.updateUserStatus(selectedStatus);
      socket.emit('status-update', selectedStatus);
    }

    setStatusMenuAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='text'
        id='status-button'
        aria-controls={isStatusMenuOpen ? 'status-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={isStatusMenuOpen ? 'true' : undefined}
        color='primary'
        disableRipple
        sx={{
          fontSize: '0.875rem',
          p: '0',
          minWidth: 'unset',
          textTransform: 'none'
        }}
        onClick={handleStatusMenuClick}
      >
        {chat.userStatus}
        {isStatusMenuOpen && <ArrowDropUp />}
        {!isStatusMenuOpen && <ArrowDropDown />}
      </Button>
      <Menu
        id='status-menu'
        anchorEl={statusMenuAnchorEl}
        open={isStatusMenuOpen}
        onClose={() => handleStatusMenuClose(null)}
        MenuListProps={{
          'aria-labelledby': 'status-button'
        }}
      >
        {statusOptions.map((status, index) => (
          <MenuItem key={status} onClick={() => handleStatusMenuClose(status)}>
            <Badge
              variant='dot'
              color={statusOptionColors[index]}
              sx={{
                mr: '0.5rem',
                border: '7px solid #ddd',
                borderRadius: '7px',
                '& .MuiBadge-badge': {
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                }
              }}
            />
            {status}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
