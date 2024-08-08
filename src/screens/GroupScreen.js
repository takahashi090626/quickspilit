import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateExpensePaidStatus, updateUserPaymentStatus, inviteUserToGroup } from '../utils/database';
import ExpenseInput from '../components/ExpenseInput';
import SettlementSummary from '../components/SettlementSummary';
import QRCode from 'qrcode.react';
import { Typography, Avatar, Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemAvatar, ListItemText, Grid, CardContent, Box, Chip, Card, CardHeader, CardActions, IconButton, Collapse, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, Share as ShareIcon, PanTool as PanToolIcon, CheckCircle as CheckCircleIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { PageContainer, Header, StyledButton } from '../styles/CommonStyles';
import { onSnapshot, doc, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const GroupScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { groupId } = useParams();

  useEffect(() => {
    const unsubscribeGroup = onSnapshot(doc(db, 'groups', groupId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGroupName(docSnapshot.data().name);
      } else {
        setSnackbar({ open: true, message: 'グループが見つかりません', severity: 'error' });
      }
    });

    const unsubscribeExpenses = onSnapshot(collection(db, 'groups', groupId, 'expenses'), (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeMembers = onSnapshot(doc(db, 'groups', groupId), async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const memberIds = docSnapshot.data().members;
        const memberPromises = memberIds.map(async (memberId) => {
          const userDocRef = doc(db, 'users', memberId);
          const userDocSnapshot = await getDoc(userDocRef);
          return { id: memberId, ...userDocSnapshot.data() };
        });
        const fetchedMembers = await Promise.all(memberPromises);
        setMembers(fetchedMembers);
      }
    });

    return () => {
      unsubscribeGroup();
      unsubscribeExpenses();
      unsubscribeMembers();
    };
  }, [groupId]);

  const handleShareQR = () => {
    setQrDialogOpen(true);
  };

  const handleInvite = async () => {
    try {
      const result = await inviteUserToGroup(groupId, inviteEmail);
      setSnackbar({ open: true, message: result.message, severity: 'success' });
      setInviteDialogOpen(false);
      setInviteEmail('');
    } catch (error) {
      console.error('招待エラー:', error);
      setSnackbar({ open: true, message: '招待の送信に失敗しました: ' + error.message, severity: 'error' });
    }
  };

  const handleToggleExpensePaidStatus = async (expenseId, userId) => {
    try {
      const expense = expenses.find(e => e.id === expenseId);
      const currentStatus = expense.paidStatus?.[userId] || false;
      await updateExpensePaidStatus(groupId, expenseId, userId, !currentStatus);
      setSnackbar({ open: true, message: '支払い状態を更新しました', severity: 'success' });
    } catch (error) {
      console.error('支払い状態の更新エラー:', error);
      setSnackbar({ open: true, message: '支払い状態の更新に失敗しました', severity: 'error' });
    }
  };

  const handleToggleUserPaymentStatus = async (userId) => {
    const member = members.find(m => m.id === userId);
    const currentStatus = member.paymentStatus || false;
    await updateUserPaymentStatus(groupId, userId, !currentStatus);
    
    setMembers(members.map(m => {
      if (m.id === userId) {
        return {
          ...m,
          paymentStatus: !currentStatus
        };
      }
      return m;
    }));
  };

  const handleExpandClick = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
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
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="メンバー" subheader={`${members.length}人`} />
            <CardContent>
              <List>
                {members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar src={member.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={member.username} />
                    <Chip
                      icon={member.paymentStatus ? <CheckCircleIcon /> : <PanToolIcon />}
                      label={member.paymentStatus ? "支払い済み" : "未払い"}
                      color={member.paymentStatus ? "primary" : "default"}
                      onClick={() => handleToggleUserPaymentStatus(member.id)}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <SettlementSummary expenses={expenses} members={members} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <ExpenseInput groupId={groupId} />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>支出一覧</Typography>
            {expenses.map(expense => (
              <Card key={expense.id} sx={{ mb: 2 }}>
                <CardHeader
                  title={expense.description}
                  subheader={`金額: ¥${expense.amount} `}
                />
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => handleExpandClick(expense.id)}
                    aria-expanded={expandedCard === expense.id}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expandedCard === expense.id} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {members.map(member => (
                        <Chip
                          key={member.id}
                          avatar={<Avatar src={member.avatarUrl} />}
                          label={member.username}
                          color={expense.paidStatus?.[member.id] ? "primary" : "default"}
                          onClick={() => handleToggleExpensePaidStatus(expense.id, member.id)}
                          icon={expense.paidStatus?.[member.id] ? <CheckCircleIcon /> : <PanToolIcon />}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
        <DialogTitle>グループ招待QRコード</DialogTitle>
        <DialogContent>
          <QRCode value={`https://quickaplit.web.app/group/${groupId}`} size={256} />
        </DialogContent>
      </Dialog>

      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>メンバーを招待</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ユーザーID"
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

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default GroupScreen;
