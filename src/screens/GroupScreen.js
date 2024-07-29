import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getExpenses, getGroupMembers, inviteUserToGroup, getGroupDetails } from '../utils/database';
import ExpenseInput from '../components/ExpenseInput';
import SettlementSummary from '../components/SettlementSummary';
import QRCode from 'qrcode.react';
import { Typography, Avatar, Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemAvatar, ListItemText, Grid, CardContent, Box } from '@mui/material';
import { Add as AddIcon, Share as ShareIcon } from '@mui/icons-material';
import { PageContainer, Header, StyledCard, StyledButton } from '../styles/CommonStyles';

const GroupScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const { groupId } = useParams();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupDetails = await getGroupDetails(groupId);
        setGroupName(groupDetails.name);
        const fetchedExpenses = await getExpenses(groupId);
        setExpenses(fetchedExpenses);
        const fetchedMembers = await getGroupMembers(groupId);
        setMembers(fetchedMembers);
      } catch (error) {
        console.error('グループデータ取得エラー:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleShareQR = () => {
    setQrDialogOpen(true);
  };

  
  const handleInvite = async () => {
    try {
      const result = await inviteUserToGroup(groupId, inviteEmail);
      alert(result.message);
      setInviteDialogOpen(false);
      setInviteEmail('');
    } catch (error) {
      console.error('招待エラー:', error);
      alert('招待の送信に失敗しました: ' + error.message);
    }
  };
  return (
    <PageContainer>
      <Header>
        <Typography variant="h4" gutterBottom>{groupName}</Typography>
        <Box>
          <StyledButton startIcon={<ShareIcon />} onClick={handleShareQR} sx={{ mr: 2 }}>
            QRコードを共有
          </StyledButton>
          <StyledButton startIcon={<AddIcon />} onClick={() => setInviteDialogOpen(true)}>
            メンバーを招待
          </StyledButton>
        </Box>
      </Header>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>メンバー ({members.length}人)</Typography>
              <List>
                {members.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar src={member.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={member.username} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpenseInput groupId={groupId} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <SettlementSummary expenses={expenses} members={members} />
      </Box>

      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
        <DialogTitle>グループ招待QRコード</DialogTitle>
        <DialogContent>
          <QRCode value={`https://yourapp.com/join/${groupId}`} size={256} />
        </DialogContent>
      </Dialog>

      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>メンバーを招待</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="メールアドレス"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <StyledButton onClick={handleInvite} color="primary">
            招待を送信
          </StyledButton>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default GroupScreen;