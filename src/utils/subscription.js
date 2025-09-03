// Abonelik sistemi için yardımcı fonksiyonlar

/**
 * Tüm abonelik planlarında ortak özellikler
 */
const COMMON_FEATURES = [
  'Sınırsız Portföy Ekleme',
  'Sınırsız Talep Ekleme',
  'Talep Havuzu Erişimi',
  '7/24 Destek',
  'Gelişmiş Arama ve Filtreleme',
  'İstatistik ve Raporlama',
  'Öne Çıkan İlan Hakkı',
  'WhatsApp Entegrasyonu',
  'Özel Danışman Desteği',
  'Gelişmiş Pazarlama Araçları',
  'Web Sitesi Entegrasyonu',
  'Eğitim ve Webinarlar',
  'Öncelikli Destek',
  'Özel Raporlama'
];

/**
 * Abonelik planları - Tüm paketlerde aynı özellikler, sadece süre farkı
 */
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Aylık',
    price: 199.00,
    currency: 'TRY',
    duration: 30, // gün
    billing: '/ay',
    features: COMMON_FEATURES,
    popular: false,
    discount: 0
  },
  QUARTERLY: {
    id: 'quarterly',
    name: '3 Aylık',
    price: 500.00,
    currency: 'TRY',
    duration: 90,
    billing: '/3 ay',
    features: COMMON_FEATURES,
    popular: true,
    discount: 16 // 3 aylık %16 indirim
  },
  SEMIANNUAL: {
    id: 'semiannual',
    name: '6 Aylık',
    price: 990.00,
    currency: 'TRY',
    duration: 180,
    billing: '/6 ay',
    features: COMMON_FEATURES,
    popular: false,
    discount: 17 // 6 aylık %17 indirim
  },
  YEARLY: {
    id: 'yearly',
    name: 'Yıllık Pro',
    price: 1599.00,
    currency: 'TRY',
    duration: 365,
    billing: '/yıl',
    features: COMMON_FEATURES,
    popular: false,
    discount: 33 // Yıllık %33 indirim
  }
};

/**
 * Abonelik durumları
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  TRIAL: 'trial'
};

/**
 * Abonelik geçmişi kaydı
 */
export class SubscriptionRecord {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.planId = data.planId || 'monthly';
    this.status = data.status || SUBSCRIPTION_STATUS.ACTIVE;
    this.startDate = data.startDate ? new Date(data.startDate) : new Date();
    this.endDate = data.endDate ? new Date(data.endDate) : this.calculateEndDate();
    this.autoRenew = data.autoRenew !== false;
    this.paymentMethod = data.paymentMethod || null;
    this.transactions = data.transactions || [];
    this.features = data.features || [];
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  calculateEndDate() {
    const endDate = new Date(this.startDate);
    const plan = SUBSCRIPTION_PLANS[this.planId.toUpperCase()];
    if (plan) {
      endDate.setDate(endDate.getDate() + plan.duration);
    }
    return endDate;
  }

  isActive() {
    return this.status === SUBSCRIPTION_STATUS.ACTIVE && 
           new Date() < this.endDate;
  }

  isExpired() {
    return new Date() >= this.endDate;
  }

  daysUntilExpiry() {
    const now = new Date();
    const diffTime = this.endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  canUpgrade() {
    return this.isActive() && this.planId !== 'yearly';
  }

  canDowngrade() {
    return this.isActive() && this.planId !== 'monthly';
  }

  getPlan() {
    return SUBSCRIPTION_PLANS[this.planId.toUpperCase()] || SUBSCRIPTION_PLANS.MONTHLY;
  }

  hasFeature(feature) {
    const plan = this.getPlan();
    return plan.features.includes(feature);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      planId: this.planId,
      status: this.status,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      autoRenew: this.autoRenew,
      paymentMethod: this.paymentMethod,
      transactions: this.transactions,
      features: this.features,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

/**
 * Abonelik yöneticisi
 */
export class SubscriptionManager {
  constructor(userId) {
    this.userId = userId;
    this.currentSubscription = null;
  }

  /**
   * Mevcut aboneliği alır
   */
  async getCurrentSubscription() {
    try {
      // Burada Firebase'den abonelik bilgisi çekilecek
      // Şimdilik mock data kullanıyoruz
      const mockData = {
        id: 'sub_123',
        userId: this.userId,
        planId: 'monthly',
        status: SUBSCRIPTION_STATUS.ACTIVE,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 gün önce
        autoRenew: true
      };

      this.currentSubscription = new SubscriptionRecord(mockData);
      return this.currentSubscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  /**
   * Abonelik planını günceller
   */
  async upgradePlan(newPlanId) {
    try {
      if (!this.currentSubscription) {
        throw new Error('No active subscription found');
      }

      if (!this.currentSubscription.canUpgrade()) {
        throw new Error('Cannot upgrade current plan');
      }

      const newPlan = SUBSCRIPTION_PLANS[newPlanId.toUpperCase()];
      if (!newPlan) {
        throw new Error('Invalid plan ID');
      }

      // Burada ödeme işlemi yapılacak
      const upgradeData = {
        ...this.currentSubscription.toJSON(),
        planId: newPlanId,
        startDate: new Date().toISOString(),
        autoRenew: true
      };

      this.currentSubscription = new SubscriptionRecord(upgradeData);
      
      // Firebase'e kaydet
      // await this.saveSubscription(this.currentSubscription);

      return {
        success: true,
        subscription: this.currentSubscription,
        message: `${newPlan.name} planına başarıyla yükseltildi`
      };
    } catch (error) {
      console.error('Error upgrading plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Aboneliği iptal eder
   */
  async cancelSubscription() {
    try {
      if (!this.currentSubscription) {
        throw new Error('No active subscription found');
      }

      this.currentSubscription.status = SUBSCRIPTION_STATUS.CANCELLED;
      this.currentSubscription.autoRenew = false;

      // Firebase'e kaydet
      // await this.saveSubscription(this.currentSubscription);

      return {
        success: true,
        message: 'Abonelik başarıyla iptal edildi',
        expiresAt: this.currentSubscription.endDate
      };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Aboneliği yeniler
   */
  async renewSubscription() {
    try {
      if (!this.currentSubscription) {
        throw new Error('No active subscription found');
      }

      if (this.currentSubscription.autoRenew) {
        // Otomatik yenileme zaten aktif
        return {
          success: true,
          message: 'Otomatik yenileme zaten aktif'
        };
      }

      this.currentSubscription.autoRenew = true;
      this.currentSubscription.status = SUBSCRIPTION_STATUS.ACTIVE;

      // Firebase'e kaydet
      // await this.saveSubscription(this.currentSubscription);

      return {
        success: true,
        message: 'Otomatik yenileme aktif edildi'
      };
    } catch (error) {
      console.error('Error renewing subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Referans ödülü olarak gün ekle
   */
  async addReferralRewardDays(days) {
    try {
      if (!this.currentSubscription) {
        throw new Error('No active subscription found');
      }

      // Mevcut bitiş tarihine gün ekle
      const newEndDate = new Date(this.currentSubscription.endDate);
      newEndDate.setDate(newEndDate.getDate() + days);
      
      this.currentSubscription.endDate = newEndDate;
      this.currentSubscription.updatedAt = new Date();

      // Firebase'e kaydet
      // await this.saveSubscription(this.currentSubscription);

      return {
        success: true,
        addedDays: days,
        newEndDate: newEndDate,
        message: `${days} gün referans ödülü olarak eklendi`
      };
    } catch (error) {
      console.error('Error adding referral reward days:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Abonelik özelliklerini kontrol eder
   */
  checkFeatureAccess(feature) {
    if (!this.currentSubscription) {
      return false;
    }
    return this.currentSubscription.hasFeature(feature);
  }

  /**
   * Abonelik özetini getirir
   */
  getSubscriptionSummary() {
    if (!this.currentSubscription) {
      return {
        hasSubscription: false,
        plan: SUBSCRIPTION_PLANS.MONTHLY,
        status: 'none',
        daysUntilExpiry: 0
      };
    }

    return {
      hasSubscription: true,
      plan: this.currentSubscription.getPlan(),
      status: this.currentSubscription.status,
      daysUntilExpiry: this.currentSubscription.daysUntilExpiry(),
      canUpgrade: this.currentSubscription.canUpgrade(),
      canDowngrade: this.currentSubscription.canDowngrade()
    };
  }
}

/**
 * Abonelik yardımcı fonksiyonları
 */
export const formatPrice = (price, currency = 'TRY') => {
  if (price === 0) return 'Ücretsiz';
  return `${price.toFixed(2)} ${currency}`;
};

export const getPlanById = (planId) => {
  return SUBSCRIPTION_PLANS[planId.toUpperCase()] || SUBSCRIPTION_PLANS.MONTHLY;
};





/**
 * Paket karşılaştırma ve indirim hesaplama
 */
export const calculatePackageComparison = () => {
  const plans = Object.values(SUBSCRIPTION_PLANS);
  
  return plans.map(plan => {
    const monthlyEquivalent = (plan.price / plan.duration) * 30;
    const savings = plan.discount > 0 ? 
      `%${plan.discount} tasarruf` : 
      'Standart fiyat';
    
    // Güvenli originalPrice hesaplaması
    let originalPrice = plan.price;
    if (plan.discount && plan.discount > 0) {
      originalPrice = (plan.price / (1 - plan.discount / 100));
    }
    
    return {
      ...plan,
      monthlyEquivalent,
      savings,
      originalPrice: originalPrice
    };
  });
};

/**
 * En uygun paketi öner
 */
export const getRecommendedPlan = (usagePattern = 'monthly') => {
  const plans = Object.values(SUBSCRIPTION_PLANS);
  
  switch (usagePattern) {
    case 'short-term':
      return plans.find(p => p.id === 'monthly');
    case 'medium-term':
      return plans.find(p => p.id === 'quarterly');
    case 'long-term':
      return plans.find(p => p.id === 'yearly');
    default:
      return plans.find(p => p.popular) || plans.find(p => p.id === 'quarterly');
  }
};
