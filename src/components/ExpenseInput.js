import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { auth } from '../firebaseConfig'; // auth をインポート
import { addExpense } from '../utils/database'; // addExpense をインポート

// スタイリングのためのカスタムコンポーネント
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
}));

const ExpenseInput = ({ groupId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleAddExpense = async () => {
    try {
      const userId = auth.currentUser.uid;
      const expenseData = {
        description,
        amount: parseFloat(amount),
        category,
        paidBy: userId,
        createdAt: new Date()
      };
      await addExpense(groupId, expenseData);
      setDescription('');
      setAmount('');
      setCategory('');
      // TODO: Add notification of success
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Expense could not be added. Please try again.');
    }
  };

  return (
    <FormContainer>
      <Typography variant="h6">割り勘内容追加</Typography>
      {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
      <Box component="form" sx={{ width: '100%', mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="内容"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          type="number"
          label="値段(税込み)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        
        <SubmitButton
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddExpense}
        >
          
        </SubmitButton>
      </Box>
    </FormContainer>
  );
};

export default ExpenseInput;
