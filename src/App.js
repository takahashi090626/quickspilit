import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import GroupScreen from './screens/GroupScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import SettlementScreen from './screens/SettlementScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import { auth } from './firebaseConfig';
import theme from './styles/theme';

const PrivateRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/" element={<PrivateRoute><HomeScreen /></PrivateRoute>} />
          <Route path="/group/:groupId" element={<PrivateRoute><GroupScreen /></PrivateRoute>} />
          <Route path="/add-expense/:groupId" element={<PrivateRoute><AddExpenseScreen /></PrivateRoute>} />
          <Route path="/settlement/:groupId" element={<PrivateRoute><SettlementScreen /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfileScreen /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;