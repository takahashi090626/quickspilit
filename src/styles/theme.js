import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00BFA5', // メインカラー
      light: '#1DE9B6', // 明るいバージョン
      dark: '#00897B', // 暗いバージョン
    },
    secondary: {
      main: '#FF6F61', // アクセントカラー
    },
    background: {
      default: '#E0F2F1', // 背景色
      paper: '#FFFFFF', // ペーパーの背景色
    },
    text: {
      primary: '#263238', // 主に使用するテキスト色
      secondary: '#546E7A', // セカンダリテキスト色
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12, // 一貫性のある角丸
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 25,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
          },
          '&:disabled': {
            opacity: 0.5,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#00BFA5', // ボーダーの色
            },
            '&:hover fieldset': {
              borderColor: '#1DE9B6', // ホバー時のボーダーの色
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00BFA5', // フォーカス時のボーダーの色
            },
          },
        },
      },
    },
  },
});

export default theme;
