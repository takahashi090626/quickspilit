// src/styles/CommonStyles.js
import { styled } from '@mui/system';
import { Box, Card, Button } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#F3F4F6',
  minHeight: '100vh',
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: '10px 30px',
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
}));