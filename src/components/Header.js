import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Avatar, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ExitToApp as LogoutIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { auth, db } from '../firebaseConfig';
import { signOut } from '../utils/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import logo from '../assets/images/QuickSplit-logo-black.png'; // ロゴ画像のパスを適切に設定してください

const Header = () => {
  const [userInfo, setUserInfo] = useState({ username: '名無しさん', avatarUrl: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setUserInfo({
            username: doc.data().username || '名無しさん',
            avatarUrl: doc.data().avatarUrl || user.photoURL || '',
          });
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="home"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="QuickSplit Logo" style={{ height: 80, width: 'auto' }} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={() => navigate('/profile')}
          >
            {userInfo.avatarUrl ? (
              <Avatar src={userInfo.avatarUrl} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
          <Typography variant="subtitle1" sx={{ ml: 1, mr: 2 }}>
            {userInfo.username}
          </Typography>
          <IconButton color="inherit" onClick={handleSignOut}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;