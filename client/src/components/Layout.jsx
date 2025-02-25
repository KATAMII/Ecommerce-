import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            E-Commerce
          </Typography>
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/">
                Home
              </Button>
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/admin/products">
                  Manage Products
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
