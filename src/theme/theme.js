import * as eva from '@eva-design/eva';
import custom from './theme.json';

// eva.dark + marka renk override
export const darkTheme = {
  ...eva.dark,
  ...custom,
};

export const customMapping = {};

export const theme = {
  colors: {
    primary: '#ff0000', // Tam kırmızı - GitHub projesindeki ana renk
    primaryHover: '#e60000', // Kırmızı üzerine gelince daha koyu ton
    background: '#07141e', // Koyu arka plan
    cardBg: 'rgba(7, 20, 30, 0.8)',
    headerBg: 'rgba(7, 20, 30, 0.8)',
    text: '#e9ecef',
    textSecondary: '#adb5bd',
    border: 'rgba(255, 255, 255, 0.18)',
    inputBg: '#2d3748',
    inputBorder: '#4a5568',
    success: '#28a745',
    info: '#007bff',
    white: '#ffffff',
    black: '#000000',
    gray: '#666666',
    lightGray: '#999999',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  shadows: {
    card: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    hover: '0 12px 32px 0 rgba(0, 0, 0, 0.45)',
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },
};
