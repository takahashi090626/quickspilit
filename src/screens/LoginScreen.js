import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { TextField, Button, Typography, Box } from '@mui/material';
import { PageContainer, StyledCard } from '../styles/CommonStyles';

const LoginScreen = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ユーザーIDからメールアドレスを取得
      const userQuery = query(collection(db, 'users'), where('userId', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        setError('ユーザーが見つかりません。');
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const email = userDoc.data().email;

      // メールアドレスとパスワードでログイン
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      setError('ログインに失敗しました。ユーザーIDとパスワードを確認してください。');
    }
  };

  return (
    <PageContainer>
      <StyledCard>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <Typography variant="h4" gutterBottom>ログイン</Typography>
          {error && <Typography color="error">{error}</Typography>}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
          <Typography>
            アカウントをお持ちでない方は <Link to="/register">こちらから新規登録</Link>
          </Typography>
        </Box>
      </StyledCard>
    </PageContainer>
  );
};

export default LoginScreen;