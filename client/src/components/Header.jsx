import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  InputBase,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const socket = io(import.meta.env.VITE_API_URL);
      
      socket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
    setUnreadCount(0);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Online Store
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search products..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{user?.name || 'User'}</Typography>
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.name ? user.name.charAt(0) : 'U'}
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              {user?.role === 'ADMIN' && (
                <MenuItem onClick={() => navigate('/admin/products')}>
                  Manage Products
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <Popover
              open={Boolean(notificationAnchor)}
              anchorEl={notificationAnchor}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <List sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
                {notifications.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No notifications" />
                  </ListItem>
                ) : (
                  notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={notification.title}
                          secondary={notification.message}
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            </Popover>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
