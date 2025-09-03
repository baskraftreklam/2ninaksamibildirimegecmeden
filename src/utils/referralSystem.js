// Referans sistemi için yardımcı fonksiyonlar

/**
 * Referans kodu oluştur
 */
export const generateReferralCode = (userId) => {
  // Kullanıcı ID'sinden benzersiz kod oluştur
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  const userIdStr = userId.toString().substring(0, 4);
  
  return `${userIdStr}${timestamp}${randomStr}`.toUpperCase();
};

/**
 * Referans kodu doğrula
 */
export const validateReferralCode = (code) => {
  // En az 8 karakter, sadece harf ve rakam
  const regex = /^[A-Z0-9]{8,}$/;
  return regex.test(code);
};

/**
 * Referans kaydı sınıfı
 */
export class ReferralRecord {
  constructor(data = {}) {
    this.id = data.id || '';
    this.referrerId = data.referrerId || ''; // Referans kodu sahibi
    this.referredId = data.referredId || ''; // Referans kodu ile kayıt olan
    this.referralCode = data.referralCode || '';
    this.status = data.status || 'pending'; // pending, completed, expired
    this.rewardClaimed = data.rewardClaimed || false;
    this.subscriptionPurchased = data.subscriptionPurchased || false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    this.rewardDays = data.rewardDays || 30; // 30 gün ödül
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isPending() {
    return this.status === 'pending';
  }

  isExpired() {
    return this.status === 'expired';
  }

  canClaimReward() {
    return this.isCompleted() && !this.rewardClaimed;
  }

  toJSON() {
    return {
      id: this.id,
      referrerId: this.referrerId,
      referredId: this.referredId,
      referralCode: this.referralCode,
      status: this.status,
      rewardClaimed: this.rewardClaimed,
      subscriptionPurchased: this.subscriptionPurchased,
      createdAt: this.createdAt.toISOString(),
      completedAt: this.completedAt ? this.completedAt.toISOString() : null,
      rewardDays: this.rewardDays
    };
  }
};

/**
 * Referans sistemi yöneticisi
 */
class ReferralManager {
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Kullanıcı için referans kodu oluştur
   */
  async generateUserReferralCode() {
    try {
      const referralCode = generateReferralCode(this.userId);
      
      // Burada Firebase'e kaydedilecek
      const referralData = {
        userId: this.userId,
        referralCode: referralCode,
        createdAt: new Date(),
        totalReferrals: 0,
        totalRewardDays: 0
      };

      // await this.saveReferralCode(referralData);
      
      return {
        success: true,
        referralCode: referralCode,
        data: referralData
      };
    } catch (error) {
      console.error('Error generating referral code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Referans kodu ile kayıt olan kullanıcıyı işle
   */
  async processReferral(referralCode, referredUserId) {
    try {
      // Referans kodunun geçerli olup olmadığını kontrol et
      if (!validateReferralCode(referralCode)) {
        throw new Error('Geçersiz referans kodu');
      }

      // Referans kodunun sahibini bul
      const referrerData = await this.findReferralCodeOwner(referralCode);
      if (!referrerData) {
        throw new Error('Referans kodu bulunamadı');
      }

      // Kendi referans kodunu kullanamaz
      if (referrerData.userId === referredUserId) {
        throw new Error('Kendi referans kodunuzu kullanamazsınız');
      }

      // Referans kaydı oluştur
      const referralRecord = new ReferralRecord({
        referrerId: referrerData.userId,
        referredId: referredUserId,
        referralCode: referralCode,
        status: 'pending'
      });

      // Firebase'e kaydet
      // await this.saveReferralRecord(referralRecord);

      return {
        success: true,
        referralRecord: referralRecord,
        referrerId: referrerData.userId
      };
    } catch (error) {
      console.error('Error processing referral:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Abonelik satın alındığında referans ödülünü ver
   */
  async claimReferralReward(referralCode, referredUserId) {
    try {
      // Referans kaydını bul
      const referralRecord = await this.findReferralRecord(referralCode, referredUserId);
      if (!referralRecord) {
        throw new Error('Referans kaydı bulunamadı');
      }

      if (referralRecord.isCompleted()) {
        throw new Error('Bu referans zaten tamamlanmış');
      }

      // Referans kaydını tamamla
      referralRecord.status = 'completed';
      referralRecord.completedAt = new Date();
      referralRecord.subscriptionPurchased = true;

      // Firebase'e kaydet
      // await this.updateReferralRecord(referralRecord);

      // Referans kodu sahibine 30 gün ekle
      const rewardResult = await this.addRewardDaysToUser(
        referralRecord.referrerId, 
        referralRecord.rewardDays
      );

      if (!rewardResult.success) {
        throw new Error('Ödül günleri eklenemedi: ' + rewardResult.error);
      }

      // Referans kodu sahibine bildirim gönder
      await this.sendReferralNotification(
        referralRecord.referrerId,
        referralRecord.referredId,
        referralRecord.rewardDays
      );

      return {
        success: true,
        referralRecord: referralRecord,
        rewardDays: referralRecord.rewardDays,
        message: 'Referans ödülü başarıyla verildi'
      };
    } catch (error) {
      console.error('Error claiming referral reward:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Kullanıcıya ödül günleri ekle
   */
  async addRewardDaysToUser(userId, days) {
    try {
      // SubscriptionManager kullanarak gün ekle
      try {
        // Dinamik import kullanarak subscription manager'ı yükle
        const { SubscriptionManager } = await import('./subscription.js');
        const subscriptionManager = new SubscriptionManager(userId);
        const result = await subscriptionManager.addReferralRewardDays(days);
        
        if (result.success) {
          return result;
        } else {
          throw new Error(result.error);
        }
      } catch (importError) {
        // Mock gün ekleme
        return {
          success: true,
          addedDays: days,
          message: `${days} gün abonelik süresine eklendi (mock)`
        };
      }
    } catch (error) {
      console.error('Error adding reward days:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Referans bildirimi gönder
   */
  async sendReferralNotification(referrerId, referredId, rewardDays) {
    try {
      // Referans kodu sahibine bildirim gönder
      const notificationData = {
        userId: referrerId,
        type: 'referral_reward',
        title: 'Referans Ödülü!',
        message: `Referans kodunuz ile yeni bir kullanıcı abone oldu. ${rewardDays} gün kullanım süresi eklendi.`,
        data: {
          referredUserId: referredId,
          rewardDays: rewardDays,
          timestamp: new Date()
        }
      };

              // Bildirim servisini kullan
        try {
          // Dinamik import kullanarak bildirim servisini yükle
          const notificationService = await import('../services/notificationService');
          await notificationService.default.sendReferralNotification(
            'Referans Kodu Sahibi', // Gerçek uygulamada kullanıcı adı alınacak
            'Yeni Kullanıcı', // Gerçek uygulamada kullanıcı adı alınacak
            rewardDays
          );
        } catch (importError) {
          // Mock bildirim gönderildi
        }

      // await this.sendNotification(notificationData);
      
      return {
        success: true,
        notification: notificationData
      };
    } catch (error) {
      console.error('Error sending referral notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Kullanıcının referans istatistiklerini getir
   */
  async getUserReferralStats() {
    try {
      // Burada Firebase'den referans istatistikleri çekilecek
      const mockStats = {
        totalReferrals: 0,
        completedReferrals: 0,
        totalRewardDays: 0,
        referralCode: null
      };

      return {
        success: true,
        stats: mockStats
      };
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Referans kodunun sahibini bul
   */
  async findReferralCodeOwner(referralCode) {
    try {
      // Burada Firebase'den referans kodu sahibi bulunacak
      // Şimdilik mock data
      return {
        userId: 'mock-user-id',
        referralCode: referralCode
      };
    } catch (error) {
      console.error('Error finding referral code owner:', error);
      return null;
    }
  }

  /**
   * Referans kaydını bul
   */
  async findReferralRecord(referralCode, referredUserId) {
    try {
      // Burada Firebase'den referans kaydı bulunacak
      // Şimdilik mock data
      return new ReferralRecord({
        referrerId: 'mock-referrer-id',
        referredId: referredUserId,
        referralCode: referralCode,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error finding referral record:', error);
      return null;
    }
  }
}

/**
 * Referans sistemi yardımcı fonksiyonları
 */
export const formatReferralCode = (code) => {
  if (!code) return '';
  // Kodu daha okunabilir hale getir (örn: ABC123DEF -> ABC-123-DEF)
  return code.replace(/(.{3})(.{3})(.*)/, '$1-$2-$3');
};

export const getReferralRewardMessage = (days) => {
  return `Referans kodunuz ile yeni bir kullanıcı abone oldu. ${days} gün kullanım süresi eklendi!`;
};

export const getReferralStatsMessage = (stats) => {
  if (stats.totalReferrals === 0) {
    return 'Henüz referansınız yok. Referans kodunuzu paylaşarak kullanım sürenizi uzatın!';
  }
  
  return `${stats.totalReferrals} referans, ${stats.completedReferrals} tamamlandı. Toplam ${stats.totalRewardDays} gün kazanıldı!`;
};

// Default export for ReferralManager
export { ReferralManager };
