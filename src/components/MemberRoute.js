import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const MemberRoute = ({ children, fallback }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!user) {
    return fallback || (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedTitle}>Giriş Gerekli</Text>
        <Text style={styles.unauthorizedText}>
          Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.
        </Text>
      </View>
    );
  }

  if (userRole === 'admin' || userRole === 'superadmin') {
    return fallback || (
      <View style={styles.forbiddenContainer}>
        <Text style={styles.forbiddenTitle}>Erişim Reddedildi</Text>
        <Text style={styles.forbiddenText}>
          Bu sayfa sadece üyeler için erişilebilir.
        </Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  unauthorizedText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  forbiddenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  forbiddenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  forbiddenText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MemberRoute;
