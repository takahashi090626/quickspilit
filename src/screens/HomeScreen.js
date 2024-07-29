import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGroups, getInvitations, acceptInvitation, declineInvitation, createGroup } from '../utils/database';
import { signOut } from '../utils/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Typography, 
  Avatar, 
  Grid, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Box,
  CardContent,
  CardActions
} from '@mui/material';
import { Add as AddIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { PageContainer, Header, StyledCard, StyledButton } from '../styles/CommonStyles';

const HomeScreen = () => {
  const [groups, setGroups] = useState([]);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || '名無しさん');
          setAvatarUrl(userDoc.data().avatarUrl || user.photoURL || '');
        } else {
          setUsername('名無しさん');
        }
        const fetchedGroups = await getGroups(user.uid);
        setGroups(fetchedGroups);
        const fetchedInvitations = await getInvitations(user);
        setInvitations(fetchedInvitations);
      }
    };

    fetchUserData();
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      const user = auth.currentUser;
      const newGroup = await acceptInvitation(invitationId, user.uid);
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      setGroups(prevGroups => [...prevGroups, newGroup]);
    } catch (error) {
      console.error('招待の受諾に失敗しました:', error);
      alert('招待の受諾に失敗しました。もう一度お試しください。');
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      await declineInvitation(invitationId);
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error('招待の拒否に失敗しました:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await createGroup({ name: newGroupName, members: [auth.currentUser.uid] });
      setOpenCreateGroupDialog(false);
      setNewGroupName('');
      const fetchedGroups = await getGroups(auth.currentUser.uid);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('グループの作成に失敗しました:', error);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={avatarUrl} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{username}</Typography>
        </Box>
        <Box>
          <IconButton onClick={() => navigate('/profile')} sx={{ mr: 1 }}>
            <Avatar src={avatarUrl} sx={{ width: 40, height: 40 }} />
          </IconButton>
          <IconButton onClick={handleSignOut} color="error">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Header>

      {invitations.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>招待</Typography>
          <Grid container spacing={2}>
            {invitations.map((invitation) => (
              <Grid item xs={12} sm={6} md={4} key={invitation.id}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="body1">{invitation.groupName}グループからの招待</Typography>
                  </CardContent>
                  <CardActions>
                    <StyledButton size="small" color="primary" onClick={() => handleAcceptInvitation(invitation.id)}>
                      参加する
                    </StyledButton>
                    <StyledButton size="small" color="secondary" onClick={() => handleDeclineInvitation(invitation.id)}>
                      断る
                    </StyledButton>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>あなたのグループ</Typography>
      <Grid container spacing={2}>
        {groups.map(group => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <StyledCard component={Link} to={`/group/${group.id}`} sx={{ textDecoration: 'none' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{group.name}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IconButton onClick={() => setOpenCreateGroupDialog(true)} color="primary" sx={{ width: 60, height: 60 }}>
              <AddIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </StyledCard>
        </Grid>
      </Grid>

      <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
        <DialogTitle>新しいグループを作成</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="グループ名"
            type="text"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenCreateGroupDialog(false)}>キャンセル</StyledButton>
          <StyledButton onClick={handleCreateGroup} color="primary">作成</StyledButton>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default HomeScreen;