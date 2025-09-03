import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import trialManager from '../utils/trialManager';
import { ReferralManager } from '../utils/referralSystem';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('member');

  useEffect(() => {
    // Mock user for development
    const mockUser = {
      uid: 'mock-user-id',
      phoneNumber: '05551234567'
    };
    
    const mockProfile = {
      uid: 'mock-user-id',
      phoneNumber: '05551234567',
      displayName: 'Test Kullanıcı',
      city: 'Samsun',
      officeName: 'Test Emlak Ofisi',
      profilePicture: '',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      referralCode: null,
      referredBy: null
    };

    setUser(mockUser);
    setUserProfile(mockProfile);
    setUserRole('member');
    setLoading(false);
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      // Gerçek kullanıcı profili zaten state'te var
      // Bu fonksiyon şimdilik sadece role'ü güncelliyor
      if (userProfile && userProfile.uid === uid) {
        setUserRole(userProfile.role || 'member');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      
      const newUser = {
        uid: `user-${Date.now()}`,
        phoneNumber: userData.phoneNumber || email
      };
      
      const profile = {
        uid: newUser.uid,
        phoneNumber: userData.phoneNumber || email,
        displayName: userData.displayName || '',
        city: userData.city || '',
        officeName: userData.officeName || '',
        profilePicture: userData.profilePicture || '',
        role: 'member',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: null,
        referredBy: userData.referredBy || null
      };

      // Telefon numarası varsa deneme sürümü başlat
      if (userData.phoneNumber) {
        const trialResult = await trialManager.startTrial(userData.phoneNumber);
        
        if (!trialResult.success) {
          console.error('Deneme sürümü başlatılamadı:', trialResult.error);
        }
      }

      // Referans kodu ile kayıt olan kullanıcıyı işle
      if (userData.referredBy) {
        try {
          const referralManager = new ReferralManager(newUser.uid);
          const referralResult = await referralManager.processReferral(userData.referredBy, newUser.uid);
          
          if (!referralResult.success) {
            console.error('Referans kodu işlenemedi:', referralResult.error);
          }
        } catch (error) {
          console.error('Referans işleme hatası:', error);
        }
      }

      setUser(newUser);
      setUserProfile(profile);
      setUserRole(profile.role);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      
      Alert.alert('Hata', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const loginUser = {
        uid: `user-${Date.now()}`,
        phoneNumber: email
      };
      
      setUser(loginUser);
      await fetchUserProfile(loginUser.uid);
      
      return { success: true, user: loginUser };
    } catch (error) {
      console.error('Sign in error:', error);
      let errorMessage = 'Giriş yaparken bir hata oluştu.';
      
      Alert.alert('Hata', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await trialManager.clearTrialData();
      
      setUser(null);
      setUserProfile(null);
      setUserRole('member');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Hata', 'Çıkış yaparken bir hata oluştu.');
    }
  };

  const resetPassword = async (email) => {
    try {
      Alert.alert('Başarılı', 'Şifre sıfırlama e-postası gönderildi. (Mock)');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Şifre sıfırlama e-postası gönderilemedi.';
      
      Alert.alert('Hata', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      setUserProfile(prev => ({ ...prev, ...updates }));
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
      return { success: false, error: error.message };
    }
  };

  const updateUserRole = async (uid, newRole) => {
    try {
      if (userRole !== 'superadmin') {
        throw new Error('Bu işlem için yetkiniz yok');
      }

      setUserRole(newRole);
      setUserProfile(prev => ({ ...prev, role: newRole }));

      return { success: true };
    } catch (error) {
      console.error('Role update error:', error);
      Alert.alert('Hata', 'Kullanıcı rolü güncellenirken bir hata oluştu.');
      return { success: false, error: error.message };
    }
  };

  // Referans sistemi fonksiyonları
  const generateReferralCode = async () => {
    try {
      if (!user) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      const referralManager = new ReferralManager(user.uid);
      const result = await referralManager.generateUserReferralCode();
      
      if (result.success) {
        setUserProfile(prev => ({ 
          ...prev, 
          referralCode: result.referralCode 
        }));
        
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Referans kodu oluşturma hatası:', error);
      Alert.alert('Hata', 'Referans kodu oluşturulamadı: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const getReferralStats = async () => {
    try {
      if (!user) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      const referralManager = new ReferralManager(user.uid);
      return await referralManager.getUserReferralStats();
    } catch (error) {
      console.error('Referans istatistikleri hatası:', error);
      return { success: false, error: error.message };
    }
  };

  const claimReferralReward = async (referralCode, referredUserId) => {
    try {
      if (!user) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      const referralManager = new ReferralManager(user.uid);
      return await referralManager.claimReferralReward(referralCode, referredUserId);
    } catch (error) {
      console.error('Referans ödülü alma hatası:', error);
      return { success: false, error: error.message };
    }
  };

  const isAdmin = () => userRole === 'admin' || userRole === 'superadmin';
  const isSuperAdmin = () => userRole === 'superadmin';
  const isMember = () => userRole === 'member';

  const value = {
    user,
    userProfile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updateUserRole,
    generateReferralCode,
    getReferralStats,
    claimReferralReward,
    isAdmin,
    isSuperAdmin,
    isMember,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
