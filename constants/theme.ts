import { StyleSheet } from 'react-native';
import colors from './colors';

export const theme = {
  colors,
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
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    body: {
      fontSize: 16,
      color: colors.text,
    },
    bodySmall: {
      fontSize: 14,
      color: colors.textLight,
    },
    caption: {
      fontSize: 12,
      color: colors.textLight,
    },
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: theme.spacing.md,
    fontSize: 16,
    color: colors.text,
  },
});