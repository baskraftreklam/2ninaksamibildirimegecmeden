import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  // Sayfa her focus olduğunda bildirimleri yeniden yükle
  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        const sortedNotifications = parsedNotifications.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      );
      
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Bildirim okundu işaretlenirken hata:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Bildirim silinirken hata:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      Alert.alert('Başarılı', 'Tüm bildirimler okundu olarak işaretlendi');
    } catch (error) {
      console.error('Tüm bildirimler okundu işaretlenirken hata:', error);
      Alert.alert('Hata', 'Bildirimler işaretlenirken bir hata oluştu');
    }
  };

  const deleteAllNotifications = async () => {
    Alert.alert(
      'Tüm Bildirimleri Sil',
      'Tüm bildirimleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('notifications');
              setNotifications([]);
              Alert.alert('Başarılı', 'Tüm bildirimler silindi');
            } catch (error) {
              console.error('Tüm bildirimler silinirken hata:', error);
              Alert.alert('Hata', 'Bildirimler silinirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const handleNavigation = (type, itemId) => {
    if (type === 'portfolio') {
      const mockPortfolio = {
        id: itemId,
        title: 'Portföy Hatırlatması',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'],
        price: 2500000,
        city: 'Samsun',
        district: 'Atakum',
        neighborhood: 'Denizevleri',
        squareMeters: 120,
        roomCount: '3+1',
        buildingAge: 5,
        floor: 3,
        parking: true,
        ownerPhone: '05551234567',
        ownerEmail: 'info@talepify.com',
        location: {
          latitude: 41.33,
          longitude: 36.25
        }
      };
      
              navigation.navigate('Ana Sayfa', { screen: 'PropertyDetail', params: { portfolio: mockPortfolio } });
    } else if (type === 'request') {
      const mockRequest = {
        id: itemId,
        title: 'Talep Hatırlatması',
        description: 'Bu talep için hatırlatma yapıldı',
        city: 'Samsun',
        district: 'İlkadım',
        budget: '500K - 1M',
        propertyType: 'Daire',
        roomCount: '2+1'
      };
      
      navigation.navigate('RequestDetail', { request: mockRequest });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'portfolio':
        return '🏠';
      case 'request':
        return '📋';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  const renderNotification = ({ item }) => (
    <View style={[
      styles.notificationItem,
      !item.isRead && styles.unreadNotification
    ]}>
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIconContainer}>
          <Text style={styles.notificationIcon}>
            {getNotificationIcon(item.type)}
          </Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>
            {new Date(item.timestamp).toLocaleString('tr-TR')}
          </Text>
          
          {item.itemId && (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => handleNavigation(item.type, item.itemId)}
            >
              <Text style={styles.navigationButtonText}>
                {item.type === 'portfolio' ? '🏠 Portföye Git' : '📋 Talebe Git'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.notificationActions}>
          {!item.isRead && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => markAsRead(item.id)}
            >
              <Text style={styles.actionButtonText}>✓</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteNotification(item.id)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔔</Text>
      <Text style={styles.emptyStateTitle}>Henüz Bildirim Yok</Text>
      <Text style={styles.emptyStateMessage}>
        Yeni bildirimler geldiğinde burada görünecek
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirimler</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.headerActionText}>Tümünü Oku</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerActionButton, styles.deleteAllButton]}
            onPress={deleteAllNotifications}
          >
            <Text style={styles.headerActionText}>Tümünü Sil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={notifications.length === 0 ? styles.emptyListContainer : {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  backButtonText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
  },
  
  headerTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  
  headerActions: {
    flexDirection: 'row',
  },
  
  headerActionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  
  headerActionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.semibold,
  },
  
  deleteAllButton: {
    backgroundColor: theme.colors.error,
  },
  
  notificationsList: {
    flex: 1,
  },
  
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  notificationItem: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  notificationIcon: {
    fontSize: theme.fontSizes.xxl,
  },
  
  notificationContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  
  notificationTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  notificationMessage: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  
  notificationTime: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  
  navigationButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  
  navigationButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
  },
  
  notificationActions: {
    flexDirection: 'row',
  },
  
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  
  actionButtonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.white,
  },
  
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  
  emptyStateTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  emptyStateMessage: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
  },
});

export default Notifications;
