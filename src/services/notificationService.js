import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    // Configure push notifications
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'portfolio-reminders',
        channelName: 'Portföy Hatırlatmaları',
        channelDescription: 'Portföy güncelleme hatırlatmaları',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    PushNotification.createChannel(
      {
        channelId: 'request-reminders',
        channelName: 'Talep Hatırlatmaları',
        channelDescription: 'Talep güncelleme hatırlatmaları',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    PushNotification.createChannel(
      {
        channelId: 'referral-notifications',
        channelName: 'Referans Bildirimleri',
        channelDescription: 'Referans sistemi bildirimleri',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );
  };

  // Portföy için bildirim gönder
  sendPortfolioReminder = async (portfolioId, portfolioTitle, userName, dayCount) => {
    const message = this.getPortfolioMessage(portfolioTitle, userName, dayCount);
    
    PushNotification.localNotification({
      channelId: 'portfolio-reminders',
      title: 'Portföy Hatırlatması',
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      data: {
        type: 'portfolio_reminder',
        portfolioId: portfolioId,
        dayCount: dayCount
      }
    });

    // Bildirim gönderildiğini kaydet
    await this.saveNotificationSent(portfolioId, 'portfolio', dayCount);
  };

  // Talep için bildirim gönder
  sendRequestReminder = async (requestId, requestTitle, userName, dayCount) => {
    const message = this.getRequestMessage(requestTitle, userName, dayCount);
    
    PushNotification.localNotification({
      channelId: 'request-reminders',
      title: 'Talep Hatırlatması',
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      data: {
        type: 'request_reminder',
        requestId: requestId,
        dayCount: dayCount
      }
    });

    // Bildirim gönderildiğini kaydet
    await this.saveNotificationSent(requestId, 'request', dayCount);
  };

  // Referans bildirimi gönder
  sendReferralNotification = async (referrerName, referredName, rewardDays) => {
    const message = `🎉 ${referredName} isimli kullanıcı referans kodunuz ile abonelik aldı! ${rewardDays} gün ek süre kazandınız.`;
    
    PushNotification.localNotification({
      channelId: 'referral-notifications',
      title: 'Referans Ödülü! 🎁',
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 500,
      data: {
        type: 'referral_reward',
        rewardDays: rewardDays,
        timestamp: Date.now()
      }
    });


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
  clearAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  // Belirli bir bildirimi temizle
  cancelNotification = (itemId, type, dayCount) => {
    const key = `${type}_notification_${itemId}_${dayCount}`;
    // Bu özel bir implementasyon gerektirir
    // Şimdilik tüm bildirimleri temizleyelim
    PushNotification.cancelAllLocalNotifications();
  };
}

export default new NotificationService();
