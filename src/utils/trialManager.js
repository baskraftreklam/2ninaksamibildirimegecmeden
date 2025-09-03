import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 7 günlük deneme sürümü yöneticisi
 */
export class TrialManager {
  constructor() {
    this.TRIAL_DURATION = 7; // 7 gün
    this.TRIAL_KEY = 'trial_status';
    this.TRIAL_START_KEY = 'trial_start_date';
    this.TRIAL_PHONE_KEY = 'trial_phone_numbers';
  }

  /**
   * Yeni kullanıcı için deneme sürümü başlatır
   */
  async startTrial(phoneNumber) {
    try {
      // Telefon numarası daha önce deneme sürümü kullanmış mı kontrol et
      const usedPhones = await this.getUsedPhoneNumbers();
      
      if (usedPhones.includes(phoneNumber)) {
        return {
          success: false,
          error: 'Bu telefon numarası daha önce deneme sürümü kullanmış',
          canUseTrial: false
        };
      }

      // Deneme sürümü başlat
      const trialData = {
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + this.TRIAL_DURATION * 24 * 60 * 60 * 1000).toISOString(),
        phoneNumber: phoneNumber,
        status: 'active'
      };

      await AsyncStorage.setItem(this.TRIAL_KEY, JSON.stringify(trialData));
      
      // Telefon numarasını kullanılan listeye ekle
      usedPhones.push(phoneNumber);
      await AsyncStorage.setItem(this.TRIAL_PHONE_KEY, JSON.stringify(usedPhones));

      return {
        success: true,
        trialData: trialData,
        canUseTrial: true
      };
    } catch (error) {
      console.error('Deneme sürümü başlatılırken hata:', error);
      return {
        success: false,
        error: 'Deneme sürümü başlatılamadı',
        canUseTrial: false
      };
    }
  }

  /**
   * Mevcut deneme sürümü durumunu kontrol eder
   */
  async getTrialStatus() {
    try {
      const trialData = await AsyncStorage.getItem(this.TRIAL_KEY);
      
      if (!trialData) {
        return {
          hasTrial: false,
          isActive: false,
          daysRemaining: 0,
          canUseTrial: false
        };
      }

      const trial = JSON.parse(trialData);
      const now = new Date();
      const endDate = new Date(trial.endDate);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      return {
        hasTrial: true,
        isActive: trial.isActive && daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        canUseTrial: false, // Zaten kullanılmış
        trialData: trial
      };
    } catch (error) {
      console.error('Deneme sürümü durumu alınırken hata:', error);
      return {
        hasTrial: false,
        isActive: false,
        daysRemaining: 0,
        canUseTrial: false
      };
    }
  }

  /**
   * Deneme sürümünü sonlandırır
   */
  async endTrial() {
    try {
      const trialData = await AsyncStorage.getItem(this.TRIAL_KEY);
      
      if (trialData) {
        const trial = JSON.parse(trialData);
        trial.isActive = false;
        trial.status = 'expired';
        
        await AsyncStorage.setItem(this.TRIAL_KEY, JSON.stringify(trial));
      }

      return { success: true };
    } catch (error) {
      console.error('Deneme sürümü sonlandırılırken hata:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Kullanılan telefon numaralarını getirir
   */
  async getUsedPhoneNumbers() {
    try {
      const usedPhones = await AsyncStorage.getItem(this.TRIAL_PHONE_KEY);
      return usedPhones ? JSON.parse(usedPhones) : [];
    } catch (error) {
      console.error('Kullanılan telefon numaraları alınırken hata:', error);
      return [];
    }
  }

  /**
   * Telefon numarası deneme sürümü kullanabilir mi kontrol eder
   */
  async canUseTrial(phoneNumber) {
    try {
      const usedPhones = await this.getUsedPhoneNumbers();
      return !usedPhones.includes(phoneNumber);
    } catch (error) {
      console.error('Deneme sürümü kontrol edilirken hata:', error);
      return false;
    }
  }

  /**
   * Deneme sürümü süresini kontrol eder
   */
  async checkTrialExpiry() {
    try {
      const trialStatus = await this.getTrialStatus();
      
      if (trialStatus.hasTrial && trialStatus.daysRemaining <= 0) {
        // Deneme sürümü süresi dolmuş
        await this.endTrial();
        return {
          expired: true,
          message: 'Deneme sürümünüz sona erdi. Abonelik paketlerini inceleyin.'
        };
      }

      return {
        expired: false,
        daysRemaining: trialStatus.daysRemaining
      };
    } catch (error) {
      console.error('Deneme sürümü süresi kontrol edilirken hata:', error);
      return { expired: false, daysRemaining: 0 };
    }
  }

  /**
   * Deneme sürümü bilgilerini temizler
   */
  async clearTrialData() {
    try {
      await AsyncStorage.removeItem(this.TRIAL_KEY);
      return { success: true };
    } catch (error) {
      console.error('Deneme sürümü verileri temizlenirken hata:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new TrialManager();
