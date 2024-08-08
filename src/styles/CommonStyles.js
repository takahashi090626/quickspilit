// src/styles/CommonStyles.js
import { styled } from '@mui/system';
import { Box, Card, Button } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f0f2f5',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '1200px',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2, 3),
  backgroundColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '12px 30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.15s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
  },
}));

export const GradientBackground = styled(Box)({
  background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.25)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  padding: theme.spacing(4),
  maxWidth: '400px',
  width: '100%',
}));
export const InvitationCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)',
  },
}));

export const InvitationContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

export const InvitationActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  borderTop: '1px solid #eee',
}));

export const InvitationButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '6px 16px',
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
}));