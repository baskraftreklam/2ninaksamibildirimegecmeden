import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { formatReferralCode, getReferralStatsMessage } from '../utils/referralSystem';

const { width, height } = Dimensions.get('window');

const ReferralSystem = () => {
  const navigation = useNavigation();
  const { userProfile, generateReferralCode, getReferralStats } = useAuth();
  
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    totalRewardDays: 0,
    referralCode: null
  });
  const [loading, setLoading] = useState(false);

  // Sayfa odaklandığında verileri yenile
  useFocusEffect(
    React.useCallback(() => {
      loadReferralData();
    }, [])
  );

  const loadReferralData = async () => {
    try {
      // Kullanıcı profilinden referans kodunu al
      if (userProfile?.referralCode) {
        setReferralCode(userProfile.referralCode);
      }

      // Referans istatistiklerini al
      const statsResult = await getReferralStats();
      if (statsResult.success) {
        setReferralStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Referans verileri yüklenemedi:', error);
    }
  };

  const handleGenerateReferralCode = async () => {
    try {
      setLoading(true);
      const result = await generateReferralCode();
      
      if (result.success) {
        setReferralCode(result.referralCode);
        Alert.alert('Başarılı', 'Referans kodunuz oluşturuldu!');
      } else {
        Alert.alert('Hata', result.error || 'Referans kodu oluşturulamadı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Referans kodu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleShareReferralCode = async () => {
    if (!referralCode) {
      Alert.alert('Uyarı', 'Önce referans kodunuzu oluşturun');
      return;
    }

    try {
      const message = `Merhaba! Talepify uygulamasında referans kodum ile kayıt olun: ${referralCode}\n\nBu kod ile kayıt olup abonelik alırsanız, ben de 30 gün ek süre kazanacağım! 🎉`;
      
      await Share.share({
        message: message,
        title: 'Referans Kodum - Talepify'
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      Alert.alert('Hata', 'Paylaşım yapılamadı');
    }
  };

  const handleCopyReferralCode = () => {
    if (!referralCode) {
      Alert.alert('Uyarı', 'Önce referans kodunuzu oluşturun');
      return;
    }

    // Burada gerçek kopyalama işlemi yapılacak
    Alert.alert('Kopyalandı', 'Referans kodu panoya kopyalandı!');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Referans Sistemi</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderReferralCodeSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Referans Kodunuz</Text>
      
      {referralCode ? (
        <View style={styles.referralCodeCard}>
          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCodeText}>{formatReferralCode(referralCode)}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyReferralCode}
            >
              <Text style={styles.copyButtonText}>📋</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.referralActions}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareReferralCode}
            >
              <Text style={styles.shareButtonText}>📤 Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noReferralCodeCard}>
          <Text style={styles.noReferralCodeText}>
            Henüz referans kodunuz yok
          </Text>
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.buttonDisabled]}
            onPress={handleGenerateReferralCode}
            disabled={loading}
          >
            <Text style={styles.generateButtonText}>
              {loading ? 'Oluşturuluyor...' : 'Referans Kodu Oluştur'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Referans İstatistikleri</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{referralStats.totalReferrals}</Text>
          <Text style={styles.statLabel}>Toplam Referans</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{referralStats.completedReferrals}</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{referralStats.totalRewardDays}</Text>
          <Text style={styles.statLabel}>Kazanılan Gün</Text>
        </View>
      </View>
      
      <Text style={styles.statsMessage}>
        {getReferralStatsMessage(referralStats)}
      </Text>
    </View>
  );

  const renderHowItWorksSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nasıl Çalışır?</Text>
      
      <View style={styles.stepContainer}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>1</View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Referans Kodunuzu Paylaşın</Text>
            <Text style={styles.stepDescription}>
              Referans kodunuzu arkadaşlarınızla paylaşın
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>2</View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Arkadaşınız Kayıt Olsun</Text>
            <Text style={styles.stepDescription}>
              Arkadaşınız referans kodunuz ile kayıt olsun
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>3</View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Abonelik Satın Alınsın</Text>
            <Text style={styles.stepDescription}>
              Arkadaşınız ücretli paket satın alsın
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>4</View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>30 Gün Kazanın</Text>
            <Text style={styles.stepDescription}>
              Otomatik olarak 30 gün ek süre kazanın
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderBenefitsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Referans Avantajları</Text>
      
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🎁</Text>
          <Text style={styles.benefitText}>
            Her başarılı referans için 30 gün ek süre
          </Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>♾️</Text>
          <Text style={styles.benefitText}>
            Sınırsız referans hakkı
          </Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>💰</Text>
          <Text style={styles.benefitText}>
            Ekstra maliyet yok
          </Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>📱</Text>
          <Text style={styles.benefitText}>
            Kolay paylaşım ve takip
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderReferralCodeSection()}
        {renderStatsSection()}
        {renderHowItWorksSection()}
        {renderBenefitsSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 44,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Referans Kodu Stilleri
  referralCodeCard: {
    alignItems: 'center',
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    width: '100%',
  },
  referralCodeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    flex: 1,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  referralActions: {
    flexDirection: 'row',
    gap: 15,
  },
  shareButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Referans Kodu Yok Stilleri
  noReferralCodeCard: {
    alignItems: 'center',
    padding: 30,
  },
  noReferralCodeText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // İstatistik Stilleri
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  
  // Nasıl Çalışır Stilleri
  stepContainer: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 15,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Avantajlar Stilleri
  benefitsList: {
    gap: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
});

export default ReferralSystem;
