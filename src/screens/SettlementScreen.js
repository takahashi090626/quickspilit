import React from 'react';
import { Container, Typography } from '@mui/material';
import SettlementSummary from '../components/SettlementSummary';

const SettlementScreen = () => {
  const expenses = [
    { description: 'Dinner', amount: 50.0 },
    { description: 'Taxi', amount: 20.0 },
  ]; // デモ用の固定データ

  return (
    <Container>
      <Typography variant="h4">Settlement</Typography>
      <SettlementSummary expenses={expenses} />
    </Container>
  );
};

export default SettlementScreen;
