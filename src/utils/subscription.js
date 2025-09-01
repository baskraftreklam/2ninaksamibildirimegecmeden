// Abonelik sistemi için yardımcı fonksiyonlar

/**
 * Abonelik planları
 */
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Ücretsiz',
    price: 0,
    currency: 'TRY',
    duration: 30, // gün
    features: [
      'Temel portföy yönetimi',
      'Sınırlı eşleştirme önerileri',
      'Temel arama ve filtreleme',
      'E-posta bildirimleri'
    ],
    limits: {
      maxPortfolios: 3,
      maxMatches: 10,
      maxSearches: 50
    }
  },
  BASIC: {
    id: 'basic',
    name: 'Temel',
    price: 99,
    currency: 'TRY',
    duration: 30,
    features: [
      'Gelişmiş portföy yönetimi',
      'Sınırsız eşleştirme önerileri',
      'Gelişmiş arama ve filtreleme',
      'Öncelikli destek',
      'İstatistikler ve raporlar'
    ],
    limits: {
      maxPortfolios: 10,
      maxMatches: 100,
      maxSearches: 500
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 199,
    currency: 'TRY',
    duration: 30,
    features: [
      'Tüm temel özellikler',
      'Sınırsız portföy',
      'Öncelikli eşleştirme',
      'Gelişmiş analitik',
      '7/24 destek',
      'API erişimi'
    ],
    limits: {
      maxPortfolios: -1, // sınırsız
      maxMatches: -1,
      maxSearches: -1
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Kurumsal',
    price: 499,
    currency: 'TRY',
    duration: 30,
    features: [
      'Tüm premium özellikler',
      'Özel entegrasyonlar',
      'Özel destek',
      'Çoklu kullanıcı',
      'Özel raporlama',
      'White-label çözümler'
    ],
    limits: {
      maxPortfolios: -1,
      maxMatches: -1,
      maxSearches: -1
    }
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
    this.planId = data.planId || 'free';
    this.status = data.status || SUBSCRIPTION_STATUS.ACTIVE;
    this.startDate = data.startDate ? new Date(data.startDate) : new Date();
    this.endDate = data.endDate ? new Date(data.endDate) : this.calculateEndDate();
    this.autoRenew = data.autoRenew !== false;
    this.paymentMethod = data.paymentMethod || null;
    this.transactions = data.transactions || [];
    this.features = data.features || [];
    this.limits = data.limits || {};
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
    return this.isActive() && this.planId !== 'enterprise';
  }

  canDowngrade() {
    return this.isActive() && this.planId !== 'free';
  }

  getPlan() {
    return SUBSCRIPTION_PLANS[this.planId.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;
  }

  hasFeature(feature) {
    const plan = this.getPlan();
    return plan.features.includes(feature);
  }

  checkLimit(limitType, currentValue = 0) {
    const plan = this.getPlan();
    const limit = plan.limits[limitType];
    
    if (limit === -1) return true; // sınırsız
    return currentValue < limit;
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
      limits: this.limits,
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
        planId: 'basic',
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
   * Abonelik özelliklerini kontrol eder
   */
  checkFeatureAccess(feature) {
    if (!this.currentSubscription) {
      return false;
    }
    return this.currentSubscription.hasFeature(feature);
  }

  /**
   * Abonelik limitini kontrol eder
   */
  checkLimit(limitType, currentValue = 0) {
    if (!this.currentSubscription) {
      return false;
    }
    return this.currentSubscription.checkLimit(limitType, currentValue);
  }

  /**
   * Abonelik özetini getirir
   */
  getSubscriptionSummary() {
    if (!this.currentSubscription) {
      return {
        hasSubscription: false,
        plan: SUBSCRIPTION_PLANS.FREE,
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
  return `${price} ${currency}`;
};

export const getPlanById = (planId) => {
  return SUBSCRIPTION_PLANS[planId.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;
};

export const getAvailablePlans = (currentPlanId = 'free') => {
  const currentPlan = getPlanById(currentPlanId);
  const currentPrice = currentPlan.price;
  
  return Object.values(SUBSCRIPTION_PLANS).filter(plan => {
    if (plan.id === currentPlanId) return false;
    if (plan.price <= currentPrice) return false; // sadece yükseltme seçenekleri
    return true;
  });
};

export const calculateSavings = (currentPlanId, newPlanId) => {
  const currentPlan = getPlanById(currentPlanId);
  const newPlan = getPlanById(newPlanId);
  
  if (currentPlan.price >= newPlan.price) return 0;
  
  const monthlySavings = newPlan.price - currentPlan.price;
  const yearlySavings = monthlySavings * 12;
  
  return {
    monthly: monthlySavings,
    yearly: yearlySavings
  };
};
