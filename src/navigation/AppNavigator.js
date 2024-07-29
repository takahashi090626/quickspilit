import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import GroupScreen from '../screens/GroupScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SettlementScreen from '../screens/SettlementScreen';

const AppNavigator = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/group" element={<GroupScreen />} />
        <Route path="/add-expense" element={<AddExpenseScreen />} />
        <Route path="/settlement" element={<SettlementScreen />} />
      </Routes>
    </Router>
  );
};

export default AppNavigator;
