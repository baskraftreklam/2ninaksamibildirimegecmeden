import AsyncStorage from '@react-native-async-storage/async-storage';
import simpleNotificationService from './simpleNotificationService';

class ReminderScheduler {
  constructor() {
    this.checkInterval = null;
    this.REMINDER_DAYS = [10, 20, 30, 45]; // Bildirim günleri
    this.startScheduler();
  }

  // Zamanlayıcıyı başlat
  startScheduler = () => {
    // Her 1 saatte bir kontrol et
    this.checkInterval = setInterval(() => {
      this.checkAllReminders();
    }, 60 * 60 * 1000); // 1 saat

    // İlk kontrolü hemen yap
    this.checkAllReminders();
  };

  // Zamanlayıcıyı durdur
  stopScheduler = () => {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  };

  // Tüm hatırlatmaları kontrol et
  checkAllReminders = async () => {
    try {
      await this.checkPortfolioReminders();
      await this.checkRequestReminders();
    } catch (error) {
      console.error('Hatırlatma kontrolü sırasında hata:', error);
    }
  };

  // Portföy hatırlatmalarını kontrol et
  checkPortfolioReminders = async () => {
    try {
      const portfolios = await this.getPortfoliosFromStorage();
      
      for (const portfolio of portfolios) {
        if (portfolio.isPublished) {
          await this.checkPortfolioReminder(portfolio);
        }
      }
    } catch (error) {
      console.error('Portföy hatırlatma kontrolü sırasında hata:', error);
    }
  };

  // Talep hatırlatmalarını kontrol et
  checkRequestReminders = async () => {
    try {
      const requests = await this.getRequestsFromStorage();
      
      for (const request of requests) {
        if (request.isPublished) {
          await this.checkRequestReminder(request);
        }
      }
    } catch (error) {
      console.error('Talep hatırlatma kontrolü sırasında hata:', error);
    }
  };

  // Portföy hatırlatmasını kontrol et
  checkPortfolioReminder = async (portfolio) => {
    const daysSinceUpdate = this.calculateDaysSinceUpdate(portfolio.updatedAt);
    
    for (const dayCount of this.REMINDER_DAYS) {
      if (daysSinceUpdate >= dayCount) {
        const notificationSent = await simpleNotificationService.checkNotificationSent(
          portfolio.id, 
          'portfolio', 
          dayCount
        );

        if (!notificationSent) {
          // Bildirim gönder
          await simpleNotificationService.sendPortfolioReminder(
            portfolio.id,
            portfolio.title,
            portfolio.userName || 'Kullanıcı',
            dayCount
          );

          // 45. günde portföyü gizle
          if (dayCount === 45) {
            await this.hidePortfolio(portfolio.id);
          }
        }
      }
    }
  };

  // Talep hatırlatmasını kontrol et
  checkRequestReminder = async (request) => {
    const daysSinceUpdate = this.calculateDaysSinceUpdate(request.updatedAt);
    
    for (const dayCount of this.REMINDER_DAYS) {
      if (daysSinceUpdate >= dayCount) {
        const notificationSent = await simpleNotificationService.checkNotificationSent(
          request.id, 
          'request', 
          dayCount
        );

        if (!notificationSent) {
          // Bildirim gönder
          await simpleNotificationService.sendRequestReminder(
            request.id,
            request.title,
            request.userName || 'Kullanıcı',
            dayCount
          );

          // 45. günde talebi gizle
          if (dayCount === 45) {
            await this.hideRequest(request.id);
          }
        }
      }
    }
  };

  // Güncelleme tarihinden bu yana geçen gün sayısını hesapla
  calculateDaysSinceUpdate = (updatedAt) => {
    const updateDate = new Date(updatedAt);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - updateDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  // Portföyü gizle
  hidePortfolio = async (portfolioId) => {
    try {
      // Firestore'da portföyü gizle
      // Bu kısım firestore servisinizde implement edilecek

      
      // Local storage'da da güncelle
      const portfolios = await this.getPortfoliosFromStorage();
      const updatedPortfolios = portfolios.map(p => 
        p.id === portfolioId ? { ...p, isPublished: false } : p
      );
      await AsyncStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    } catch (error) {
      console.error('Portföy gizlenirken hata:', error);
    }
  };

  // Talebi gizle
  hideRequest = async (requestId) => {
    try {
      // Firestore'da talebi gizle
      // Bu kısım firestore servisinizde implement edilecek

      
      // Local storage'da da güncelle
      const requests = await this.getRequestsFromStorage();
      const updatedRequests = requests.map(r => 
        r.id === requestId ? { ...r, isPublished: false } : r
      );
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
    } catch (error) {
      console.error('Talep gizlenirken hata:', error);
    }
  };

  // Storage'dan portföyleri al
  getPortfoliosFromStorage = async () => {
    try {
      const portfolios = await AsyncStorage.getItem('portfolios');
      return portfolios ? JSON.parse(portfolios) : [];
    } catch (error) {
      console.error('Portföyler alınırken hata:', error);
      return [];
    }
  };

  // Storage'dan talepleri al
  getRequestsFromStorage = async () => {
    try {
      const requests = await AsyncStorage.getItem('requests');
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error('Talepler alınırken hata:', error);
      return [];
    }
  };

  // Yeni portföy eklendiğinde çağrılır
  addPortfolio = async (portfolio) => {
    try {
      const portfolios = await this.getPortfoliosFromStorage();
      portfolios.push(portfolio);
      await AsyncStorage.setItem('portfolios', JSON.stringify(portfolios));
    } catch (error) {
      console.error('Portföy eklenirken hata:', error);
    }
  };

  // Yeni talep eklendiğinde çağrılır
  addRequest = async (request) => {
    try {
      const requests = await this.getRequestsFromStorage();
      requests.push(request);
      await AsyncStorage.setItem('requests', JSON.stringify(requests));
    } catch (error) {
      console.error('Talep eklenirken hata:', error);
    }
  };

  // Portföy güncellendiğinde çağrılır
  updatePortfolio = async (portfolioId, updatedData) => {
    try {
      const portfolios = await this.getPortfoliosFromStorage();
      const updatedPortfolios = portfolios.map(p => 
        p.id === portfolioId ? { ...p, ...updatedData, updatedAt: new Date().toISOString() } : p
      );
      await AsyncStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    } catch (error) {
      console.error('Portföy güncellenirken hata:', error);
    }
  };

  // Talep güncellendiğinde çağrılır
  updateRequest = async (requestId, updatedData) => {
    try {
      const requests = await this.getRequestsFromStorage();
      const updatedRequests = requests.map(r => 
        r.id === requestId ? { ...r, ...updatedData, updatedAt: new Date().toISOString() } : r
      );
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
    } catch (error) {
      console.error('Talep güncellenirken hata:', error);
    }
  };

  // Test için manuel hatırlatma kontrolü
  manualCheck = () => {
    this.checkAllReminders();
  };
}

export default new ReminderScheduler();
