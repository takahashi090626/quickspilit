import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { onAuthStateChanged } from 'firebase/auth';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import GroupScreen from './screens/GroupScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import SettlementScreen from './screens/SettlementScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import { auth } from './firebaseConfig';
import theme from './styles/theme';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginScreen />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterScreen />} />
          <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
          <Route path="/group/:groupId" element={user ? <GroupScreen /> : <Navigate to="/login" />} />
          <Route path="/add-expense/:groupId" element={user ? <AddExpenseScreen /> : <Navigate to="/login" />} />
          <Route path="/settlement/:groupId" element={user ? <SettlementScreen /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <UserProfileScreen /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;