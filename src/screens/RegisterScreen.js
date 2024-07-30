import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { PageContainer, StyledCard } from '../styles/CommonStyles';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Check if userId is unique
      const userQuery = query(collection(db, 'users'), where('userId', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        setError('このユーザーIDは既に使用されています。');
        return;
      }

      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);

      // Add user data to Firestore
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        email,
        userId,
        username: userId,
        createdAt: new Date(),
      });

      setSnackbar({ open: true, message: 'ユーザー登録が完了しました。ログインしてください。', severity: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に使用されています。');
      } else {
        setError(`登録エラー: ${error.message}`);
      }
      setSnackbar({ open: true, message: 'ユーザー登録に失敗しました', severity: 'error' });
    }
  };

  return (
    <PageContainer>
      <StyledCard sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>ユーザー登録</Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="ユーザーID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            登録
          </Button>
        </form>
      </StyledCard>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default RegisterScreen;