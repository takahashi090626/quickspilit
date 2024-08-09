import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { TextField,Typography, Box } from '@mui/material';
import { GradientBackground, GlassCard, StyledButton } from '../styles/CommonStyles';

const LoginScreen = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userQuery = query(collection(db, 'users'), where('userId', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        setError('ユーザーが見つかりません。');
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const email = userDoc.data().email;

      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      setError('ログインに失敗しました。ユーザーIDとパスワードを確認してください。');
    }
  };

  return (
    <GradientBackground>
      <GlassCard>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>ログイン</Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="userId"
            label="ユーザーID"
            name="userId"
            autoComplete="username"
            autoFocus
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </StyledButton>
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            アカウントをお持ちでない方は <Link to="/register" style={{ color: '#3f51b5', fontWeight: 'bold' }}>こちらから新規登録</Link>
          </Typography>
        </Box>
      </GlassCard>
    </GradientBackground>
  );
};

export default LoginScreen;