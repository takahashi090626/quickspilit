import React from 'react';
import { calculateEqualSplit } from '../utils/calculations';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const SettlementSummary = ({ expenses, members }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const splitAmount = calculateEqualSplit(totalAmount, members.length);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>精算サマリー</Typography>
      <Typography variant="body1">総支出: {formatCurrency(totalAmount)}</Typography>
      <Typography variant="body1">1人あたりの支払額: {formatCurrency(splitAmount)}</Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>支出内訳:</Typography>
      <List>
        {expenses.map((expense, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${expense.description}: ${formatCurrency(expense.amount)}`}
              secondary={`支払者: ${members.find(m => m.id === expense.paidBy)?.username || '不明'}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SettlementSummary;