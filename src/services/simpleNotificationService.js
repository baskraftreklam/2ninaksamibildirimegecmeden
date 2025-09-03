import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

class SimpleNotificationService {
  constructor() {
    this.REMINDER_DAYS = [10, 20, 30, 45]; // Bildirim günleri
  }

  // Portföy için bildirim gönder
  sendPortfolioReminder = async (portfolioId, portfolioTitle, userName, dayCount) => {
    const message = this.getPortfolioMessage(portfolioTitle, userName, dayCount);
    
    // Basit alert ile bildirim göster
    Alert.alert(
      'Portföy Hatırlatması',
      message,
      [
        {
          text: 'Tamam',
          onPress: () => {}
        }
      ]
    );

    // Bildirim gönderildiğini kaydet
    await this.saveNotificationSent(portfolioId, 'portfolio', dayCount);
    
    // Bildirimi notifications listesine ekle
    await this.addNotificationToList('portfolio', portfolioTitle, message, dayCount, portfolioId);
    

  };

  // Talep için bildirim gönder
  sendRequestReminder = async (requestId, requestTitle, userName, dayCount) => {
    const message = this.getRequestMessage(requestTitle, userName, dayCount);
    
    // Basit alert ile bildirim göster
    Alert.alert(
      'Talep Hatırlatması',
      message,
      [
        {
          text: 'Tamam',
          onPress: () => {}
        }
      ]
    );

    // Bildirim gönderildiğini kaydet
    await this.saveNotificationSent(requestId, 'request', dayCount);
    
    // Bildirimi notifications listesine ekle
    await this.addNotificationToList('request', requestTitle, message, dayCount, requestId);
    

  };

  // Portföy mesajını oluştur
  getPortfolioMessage = (title, userName, dayCount) => {
    const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    
    if (dayCount === 45) {
      return `Hey ${userName} Merhaba, ${shortTitle} portföyün 45 gündür güncellenmedi. Portföy portföy havuzundan gizlendi. Lütfen kontrol et.`;
    }
    
    return `Hey ${userName} Merhaba, ${shortTitle} portföyünü ${dayCount} gündür güncellemedin. Hatırlatmak istedim. Lütfen kontrol et.`;
  };

  // Talep mesajını oluştur
  getRequestMessage = (title, userName, dayCount) => {
    const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    
    if (dayCount === 45) {
      return `Hey ${userName} Merhaba, ${shortTitle} talebini 45 gündür güncellenmedi. Talep talep havuzundan gizlendi. Lütfen kontrol et.`;
    }
    
    return `Hey ${userName} Merhaba, ${shortTitle} talebini ${dayCount} gündür güncellemedin. Hatırlatmak istedim. Lütfen kontrol et.`;
  };

  // Bildirimi notifications listesine ekle
  addNotificationToList = async (type, title, message, dayCount, itemId) => {
    try {
      const notification = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type,
        title: `${type === 'portfolio' ? 'Portföy' : 'Talep'} Hatırlatması (${dayCount}. gün)`,
        message: message,
        timestamp: Date.now(),
        isRead: false,
        dayCount: dayCount,
        itemId: itemId // Hangi portföy/talep için olduğunu bilmek için
      };

      // Mevcut bildirimleri al
      const existingNotifications = await AsyncStorage.getItem('notifications');
      let notifications = [];
      
      if (existingNotifications) {
        notifications = JSON.parse(existingNotifications);
      }

      // Yeni bildirimi ekle
      notifications.unshift(notification);

      // Maksimum 100 bildirim sakla
      if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
      }

      // Bildirimleri kaydet
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      

    } catch (error) {
      console.error('Bildirim listeye eklenirken hata:', error);
    }
  };

  // Bildirim gönderildiğini kaydet
  saveNotificationSent = async (itemId, type, dayCount) => {
    try {
      const key = `${type}_notification_${itemId}_${dayCount}`;
      const timestamp = Date.now();
      await AsyncStorage.setItem(key, JSON.stringify({ timestamp, dayCount }));
    } catch (error) {
      console.error('Bildirim kaydedilemedi:', error);
    }
  };

  // Bildirim gönderilip gönderilmediğini kontrol et
  checkNotificationSent = async (itemId, type, dayCount) => {
    try {
      const key = `${type}_notification_${itemId}_${dayCount}`;
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error('Bildirim kontrol edilemedi:', error);
      return false;
    }
  };

  // Tüm bildirimleri temizle
  clearAllNotifications = async () => {
    try {
      // Notifications listesini temizle
      await AsyncStorage.removeItem('notifications');
      
      // Eski notification key'lerini de temizle
      const keys = await AsyncStorage.getAllKeys();
      const notificationKeys = keys.filter(key => key.includes('_notification_'));
      await AsyncStorage.multiRemove(notificationKeys);
      

    } catch (error) {
      console.error('Bildirimler temizlenirken hata:', error);
    }
  };

  // Belirli bir bildirimi temizle
  cancelNotification = async (itemId, type, dayCount) => {
    try {
      const key = `${type}_notification_${itemId}_${dayCount}`;
      await AsyncStorage.removeItem(key);

    } catch (error) {
      console.error('Bildirim temizlenirken hata:', error);
    }
  };
}

export default new SimpleNotificationService();
