import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Typography, Avatar, Box, CircularProgress } from '@mui/material';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { PageContainer, StyledCard } from '../styles/CommonStyles';

const UserProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || '');
          setUserId(userDoc.data().userId || '');
          setAvatarUrl(userDoc.data().avatarUrl || user.photoURL || '');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        let newAvatarUrl = avatarUrl;
        if (avatar) {
          const avatarRef = ref(storage, `avatars/${user.uid}`);
          await uploadBytes(avatarRef, avatar);
          newAvatarUrl = await getDownloadURL(avatarRef);
        }

        await updateProfile(user, { displayName: username, photoURL: newAvatarUrl });
        await setDoc(doc(db, 'users', user.uid), { 
          username, 
          userId,
          avatarUrl: newAvatarUrl, 
          email: user.email 
        }, { merge: true });
        
        alert('プロフィールを更新しました！');
        navigate('/');
      } catch (error) {
        console.error('プロフィール更新エラー:', error);
        alert('プロフィールの更新に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <PageContainer>
      <StyledCard sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={avatarUrl} sx={{ width: 120, height: 120, mb: 2 }} />
          <input
            accept="image/*"
            type="file"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
            id="avatar-input"
          />
          <label htmlFor="avatar-input">
            <Button variant="contained" component="span" startIcon={<CameraIcon />}>
              アイコンを変更
            </Button>
          </label>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mt: 2 }}>
            プロフィール編集
          </Typography>
          <TextField
            label="ユーザーネーム"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="ユーザーID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateProfile}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'プロフィールを更新'}
          </Button>
        </Box>
      </StyledCard>
    </PageContainer>
  );
};

export default UserProfileScreen;