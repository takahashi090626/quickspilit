import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateExpensePaidStatus, inviteUserToGroup, deleteExpense, searchUsers } from '../utils/database';
import ExpenseInput from '../components/ExpenseInput';
import SettlementSummary from '../components/SettlementSummary';
import QRCode from 'qrcode.react';
import { Typography, Avatar, Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemAvatar, ListItemText, Grid, CardContent, Box, Chip, Card, CardHeader, CardActions, IconButton, Collapse, Snackbar, Alert, Autocomplete } from '@mui/material';
import { Add as AddIcon, PanTool as PanToolIcon, CheckCircle as CheckCircleIcon, ExpandMore as ExpandMoreIcon, Delete as DeleteIcon, Home as HomeIcon, QrCode as QrCodeIcon } from '@mui/icons-material';
import { PageContainer, Header, StyledButton } from '../styles/CommonStyles';
import { onSnapshot, doc, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const GroupScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { groupId } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

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

  const handleSearchUser = async (value) => {
    if (value.length >= 2) {
      try {
        const results = await searchUsers(value);
        setSearchResults(results);
      } catch (error) {
        console.error('ユーザー検索エラー:', error);
        setSnackbar({ open: true, message: 'ユーザーの検索中にエラーが発生しました', severity: 'error' });
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInvite = async () => {
    if (selectedUser) {
      try {
        const result = await inviteUserToGroup(groupId, selectedUser.id);
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setInviteDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('招待エラー:', error);
        setSnackbar({ open: true, message: `招待の送信に失敗しました: ${error.message}`, severity: 'error' });
      }
    } else {
      setSnackbar({ open: true, message: 'ユーザーを選択してください', severity: 'warning' });
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

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(groupId, expenseId);
      setSnackbar({ open: true, message: '支出を削除しました', severity: 'success' });
    } catch (error) {
      console.error('支出の削除エラー:', error);
      setSnackbar({ open: true, message: '支出の削除に失敗しました', severity: 'error' });
    }
  };

  const handleExpandClick = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <PageContainer>
      <Header>
        <Typography variant="h4" gutterBottom>{groupName}</Typography>
        <Box>
          <StyledButton startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ mr: 2 }}>
            {/* ホームに戻る */}
          </StyledButton>
          <StyledButton startIcon={<AddIcon />} onClick={() => setInviteDialogOpen(true)}>
            {/* メンバーを招待 */}
          </StyledButton>
          <StyledButton startIcon={<QrCodeIcon />} onClick={handleShareQR}>
            {/* QRコードで招待 */}
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
                  action={
                    <IconButton onClick={() => handleDeleteExpense(expense.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCode value={`https://quickaplit.web.app/join/${groupId}`} size={256} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              このQRコードをスキャンしてグループに参加できます。
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={inviteDialogOpen} 
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>メンバーを招待</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => option.userId}
            renderOption={(props, option) => (
              <ListItem {...props}>
                <ListItemAvatar>
                  <Avatar src={option.avatarUrl} />
                </ListItemAvatar>
                <ListItemText primary={option.userId} secondary={option.username} />
              </ListItem>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ユーザーIDを検索"
                variant="outlined"
                fullWidth
                onChange={(e) => handleSearchUser(e.target.value)}
              />
            )}
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            ListboxProps={{
              style: { maxHeight: 200, overflow: 'auto' }
            }}
          />
          <Box sx={{ mt: 2 }}>
            <StyledButton 
              onClick={handleInvite} 
              color="primary" 
              disabled={!selectedUser}
              fullWidth
            >
              招待を送信
            </StyledButton>
          </Box>
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