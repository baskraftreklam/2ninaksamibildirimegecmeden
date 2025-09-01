import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { theme } from '../theme/theme';

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
  const [userRole, setUserRole] = useState('member'); // member, admin, superadmin

  useEffect(() => {
    // Mock authentication for now
    setTimeout(() => {
      const mockUser = {
        uid: 'mock-user-123',
        email: 'test@example.com'
      };
      const mockProfile = {
        uid: 'mock-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        phoneNumber: '+90 555 123 4567',
        role: 'member',
        status: 'active',
        city: 'Samsun',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      setUserRole(mockProfile.role);
      setLoading(false);
    }, 1000);
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      // Mock profile fetch
      const mockProfile = {
        uid: uid,
        email: 'test@example.com',
        displayName: 'Test User',
        phoneNumber: '+90 555 123 4567',
        role: 'member',
        status: 'active',
        city: 'Samsun',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUserProfile(mockProfile);
      setUserRole(mockProfile.role || 'member');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      
      // Mock signup
      const mockUser = {
        uid: `user-${Date.now()}`,
        email: email
      };
      
      const profile = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: userData.displayName || '',
        phoneNumber: userData.phoneNumber || '',
        role: 'member',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData
      };

      setUser(mockUser);
      setUserProfile(profile);
      setUserRole(profile.role);
      
      return { success: true, user: mockUser };
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
      
      // Mock signin
      const mockUser = {
        uid: 'mock-user-123',
        email: email
      };
      
      setUser(mockUser);
      await fetchUserProfile(mockUser.uid);
      
      return { success: true, user: mockUser };
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

      // Update local state
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

      // Update local state
      setUserRole(newRole);
      setUserProfile(prev => ({ ...prev, role: newRole }));

      return { success: true };
    } catch (error) {
      console.error('Role update error:', error);
      Alert.alert('Hata', 'Kullanıcı rolü güncellenirken bir hata oluştu.');
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
