import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const Profile = () => {
  const navigation = useNavigation();

  const handleSubscriptionPress = () => {
    navigation.navigate('Subscription');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap Yönetimi</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSubscriptionPress}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>💳</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Abonelik</Text>
                <Text style={styles.menuItemSubtitle}>Paket durumu ve yönetimi</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>👤</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Profil Bilgileri</Text>
                <Text style={styles.menuItemSubtitle}>Kişisel bilgileri düzenle</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>🔔</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Bildirimler</Text>
                <Text style={styles.menuItemSubtitle}>Bildirim ayarları</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>⚙️</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Ayarlar</Text>
                <Text style={styles.menuItemSubtitle}>Uygulama ayarları</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>❓</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Yardım</Text>
                <Text style={styles.menuItemSubtitle}>Destek ve SSS</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>📞</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>İletişim</Text>
                <Text style={styles.menuItemSubtitle}>Bizimle iletişime geçin</Text>
              </View>
              <Text style={styles.menuItemArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemIcon}>🚪</Text>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, styles.logoutText]}>Çıkış Yap</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  menuItemArrow: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  logoutItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: '#ef4444',
  },
});

export default Profile;
