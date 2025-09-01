// src/screens/Settings.js
// Talepify - Ayarlar Sayfası

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const Settings = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            // Burada AuthContext'ten logout fonksiyonu çağrılacak
            // Şimdilik Login sayfasına yönlendiriyoruz
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const renderSettingItem = ({ icon, title, subtitle, type, value, onPress, onValueChange, isDestructive = false }) => (
    <TouchableOpacity
      style={[styles.settingItem, isDestructive && styles.destructiveItem]}
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, isDestructive && styles.destructiveSubtitle]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingItemRight}>
        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={value ? theme.colors.white : theme.colors.textSecondary}
          />
        ) : type === 'arrow' ? (
          <Text style={styles.settingArrow}>→</Text>
        ) : (
          <Text style={[styles.settingValue, isDestructive && styles.destructiveText]}>
            {value}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = ({ title, items }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <View key={index}>
            {renderSettingItem(item)}
            {index < items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );

  const settingsData = [
    {
      title: 'Bildirimler',
      items: [
        {
          icon: '🔔',
          title: 'Push Bildirimleri',
          subtitle: 'Yeni mesaj ve güncellemeler için',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: '📧',
          title: 'E-posta Bildirimleri',
          subtitle: 'Önemli güncellemeler için',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
      ],
    },
    {
      title: 'Görünüm',
      items: [
        {
          icon: '🌙',
          title: 'Karanlık Mod',
          subtitle: 'Koyu tema kullan',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: '🎨',
          title: 'Tema Rengi',
          subtitle: 'Kırmızı',
          type: 'arrow',
          onPress: () => Alert.alert('Tema Rengi', 'Tema rengi seçenekleri yakında gelecek'),
        },
      ],
    },
    {
      title: 'Uygulama',
      items: [
        {
          icon: '💾',
          title: 'Otomatik Kaydet',
          subtitle: 'Değişiklikleri otomatik kaydet',
          type: 'switch',
          value: autoSave,
          onValueChange: setAutoSave,
        },
        {
          icon: '📍',
          title: 'Konum Servisleri',
          subtitle: 'Yakındaki portföyleri göster',
          type: 'switch',
          value: locationServices,
          onValueChange: setLocationServices,
        },
        {
          icon: '📱',
          title: 'Uygulama Versiyonu',
          subtitle: 'v1.0.0',
          type: 'info',
        },
      ],
    },
    {
      title: 'Hesap',
      items: [
        {
          icon: '👤',
          title: 'Profil Düzenle',
          subtitle: 'Kişisel bilgilerinizi güncelleyin',
          type: 'arrow',
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          icon: '🔒',
          title: 'Şifre Değiştir',
          subtitle: 'Güvenlik için şifrenizi güncelleyin',
          type: 'arrow',
          onPress: () => Alert.alert('Şifre Değiştir', 'Şifre değiştirme özelliği yakında gelecek'),
        },
        {
          icon: '📋',
          title: 'Gizlilik Politikası',
          subtitle: 'Veri kullanımı hakkında bilgi',
          type: 'arrow',
          onPress: () => Alert.alert('Gizlilik Politikası', 'Gizlilik politikası yakında gelecek'),
        },
        {
          icon: '❓',
          title: 'Yardım & Destek',
          subtitle: 'Sorularınız için destek alın',
          type: 'arrow',
          onPress: () => Alert.alert('Yardım & Destek', 'Destek sistemi yakında gelecek'),
        },
      ],
    },
    {
      title: 'Tehlikeli Bölge',
      items: [
        {
          icon: '🚪',
          title: 'Çıkış Yap',
          subtitle: 'Hesabınızdan güvenli çıkış',
          type: 'action',
          onPress: handleLogout,
        },
        {
          icon: '🗑️',
          title: 'Hesabı Sil',
          subtitle: 'Hesabınızı kalıcı olarak silin',
          type: 'action',
          onPress: handleDeleteAccount,
          isDestructive: true,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Ayarlar</Text>
        
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {settingsData.map((section, index) => (
            <View key={index}>
              {renderSection(section)}
              {index < settingsData.length - 1 && <View style={styles.sectionSpacer} />}
            </View>
          ))}
        </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  sectionCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  destructiveItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  destructiveText: {
    color: '#ef4444',
  },
  destructiveSubtitle: {
    color: 'rgba(239, 68, 68, 0.7)',
  },
  settingItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  settingArrow: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  sectionSpacer: {
    height: theme.spacing.lg,
  },
});

export default Settings;
