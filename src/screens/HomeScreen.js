import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, getInvitations, acceptInvitation, declineInvitation, createGroup, deleteGroup } from '../utils/database';
import { auth } from '../firebaseConfig';
import { 
  Typography, 
  Grid, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Box,
  CardContent,
  CardActions,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PageContainer, StyledCard, StyledButton, InvitationCard, 
  InvitationContent, 
  InvitationActions, 
  InvitationButton } from '../styles/CommonStyles';

  const HomeScreen = () => {
    const [groups, setGroups] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            const fetchedGroups = await getGroups(user.uid);
            setGroups(fetchedGroups);
            const fetchedInvitations = await getInvitations(user);
            setInvitations(fetchedInvitations);
          }
        } catch (error) {
          console.error('ユーザーデータの取得エラー:', error);
          setSnackbar({ open: true, message: 'データの取得に失敗しました', severity: 'error' });
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleAcceptInvitation = async (invitationId) => {
      try {
        const user = auth.currentUser;
        const newGroup = await acceptInvitation(invitationId, user.uid);
        setInvitations(invitations.filter(inv => inv.id !== invitationId));
        setGroups(prevGroups => [...prevGroups, newGroup]);
        setSnackbar({ open: true, message: 'グループに参加しました', severity: 'success' });
      } catch (error) {
        console.error('招待の受諾に失敗しました:', error);
        setSnackbar({ open: true, message: '招待の受諾に失敗しました', severity: 'error' });
      }
    };
  
    const handleDeclineInvitation = async (invitationId) => {
      try {
        await declineInvitation(invitationId);
        setInvitations(invitations.filter(inv => inv.id !== invitationId));
        setSnackbar({ open: true, message: '招待を断りました', severity: 'info' });
      } catch (error) {
        console.error('招待の拒否に失敗しました:', error);
        setSnackbar({ open: true, message: '招待の拒否に失敗しました', severity: 'error' });
      }
    };
  
    const handleCreateGroup = async () => {
      try {
        await createGroup({ name: newGroupName, members: [auth.currentUser.uid] });
        setOpenCreateGroupDialog(false);
        setNewGroupName('');
        const fetchedGroups = await getGroups(auth.currentUser.uid);
        setGroups(fetchedGroups);
        setSnackbar({ open: true, message: '新しいグループを作成しました', severity: 'success' });
      } catch (error) {
        console.error('グループの作成に失敗しました:', error);
        setSnackbar({ open: true, message: 'グループの作成に失敗しました', severity: 'error' });
      }
    };
  
    const handleDeleteGroup = async (groupId) => {
      if (window.confirm('本当にこのグループを削除しますか？')) {
        try {
          await deleteGroup(groupId);
          setGroups(groups.filter(group => group.id !== groupId));
          setSnackbar({ open: true, message: 'グループを削除しました', severity: 'success' });
        } catch (error) {
          console.error('グループの削除に失敗しました:', error);
          setSnackbar({ open: true, message: 'グループの削除に失敗しました', severity: 'error' });
        }
      }
    };
  return (
    <PageContainer>
      {invitations.length > 0 && (
        <Box sx={{ mb: 4, width: '100%', maxWidth: '1200px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>招待</Typography>
          <Grid container spacing={2}>
            {invitations.map((invitation) => (
              <Grid item xs={12} sm={6} md={4} key={invitation.id}>
                <InvitationCard>
                  <InvitationContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{invitation.groupName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      グループからの招待が届いています。参加しますか？
                    </Typography>
                  </InvitationContent>
                  <InvitationActions>
                    <InvitationButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleAcceptInvitation(invitation.id)}
                    >
                      参加する
                    </InvitationButton>
                    <InvitationButton 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleDeclineInvitation(invitation.id)}
                    >
                      断る
                    </InvitationButton>
                  </InvitationActions>
                </InvitationCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>あなたのグループ</Typography>
      <Grid container spacing={2}>
        {groups.map(group => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{group.name}</Typography>
              </CardContent>
              <CardActions>
                <StyledButton component={Link} to={`/group/${group.id}`}>
                  詳細
                </StyledButton>
                <IconButton onClick={() => handleDeleteGroup(group.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
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

export default HomeScreen;