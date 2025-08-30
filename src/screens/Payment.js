import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { package: selectedPackage, plan } = route.params || {};

  const [fadeAnim] = useState(new Animated.Value(0));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = () => {
    if (!formData.cardHolderName.trim()) {
      Alert.alert('Hata', 'Lütfen kart sahibinin adını girin.');
      return false;
    }
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Hata', 'Lütfen geçerli bir kart numarası girin.');
      return false;
    }
    if (formData.expiryDate.length !== 5) {
      Alert.alert('Hata', 'Lütfen geçerli bir son kullanma tarihi girin.');
      return false;
    }
    if (formData.cvc.length !== 3) {
      Alert.alert('Hata', 'Lütfen geçerli bir CVC kodu girin.');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simüle edilmiş ödeme işlemi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Başarılı ödeme
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Subscription');
      }, 2000);

    } catch (error) {
      Alert.alert('Hata', 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransfer = () => {
    Alert.alert(
      'Havale/EFT Bilgileri',
      'Banka: Talepify Bank\nIBAN: TR00 0000 0000 0000 0000 0000 00\nAçıklama: Abonelik ödemesi',
      [
        { text: 'Kopyala', onPress: () => Alert.alert('Kopyalandı', 'IBAN kopyalandı.') },
        { text: 'Tamam' }
      ]
    );
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default', maxLength = null, formatter = null) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formatter ? formatter(formData[field]) : formData[field]}
        onChangeText={(text) => {
          const value = formatter ? text.replace(/\s/g, '') : text;
          handleInputChange(field, value);
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.modalTitle}>Başarılı!</Text>
          <Text style={styles.modalMessage}>
            {selectedPackage?.name || plan} aboneliğiniz başarıyla başlatıldı!
          </Text>
        </View>
      </View>
    </Modal>
  );

  const packageName = selectedPackage?.name || plan || 'Seçilen Paket';
  const packagePrice = selectedPackage?.price || '199.00₺';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ödeme Bilgileri</Text>
            
            <View style={styles.packageSummary}>
              <Text style={styles.packageSummaryText}>
                Seçilen Paket: <Text style={styles.packageName}>{packageName}</Text>
              </Text>
              <Text style={styles.packagePrice}>{packagePrice}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kart Bilgileri</Text>
            
            {renderInput(
              'Kart Üzerindeki İsim',
              'cardHolderName',
              'Ad Soyad',
              'default'
            )}
            
            {renderInput(
              'Kart Numarası',
              'cardNumber',
              '0000 0000 0000 0000',
              'numeric',
              19,
              formatCardNumber
            )}
            
            <View style={styles.row}>
              {renderInput(
                'Son Kullanma Tarihi',
                'expiryDate',
                'AA/YY',
                'numeric',
                5,
                formatExpiryDate
              )}
              
              {renderInput(
                'CVC',
                'cvc',
                '123',
                'numeric',
                3
              )}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              <Text style={styles.payButtonText}>
                {isProcessing ? 'İşleniyor...' : `Ödemeyi Tamamla - ${packagePrice}`}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity style={styles.bankTransferButton} onPress={handleBankTransfer}>
              <Text style={styles.bankTransferButtonText}>Havale/EFT ile Öde</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>🔒 Güvenli Ödeme</Text>
              <Text style={styles.securityText}>
                • SSL şifreleme ile güvenli ödeme
              </Text>
              <Text style={styles.securityText}>
                • Kart bilgileriniz saklanmaz
              </Text>
              <Text style={styles.securityText}>
                • 256-bit güvenlik protokolü
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {renderSuccessModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  packageSummary: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  packageSummaryText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  packageName: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  payButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginHorizontal: theme.spacing.md,
  },
  bankTransferButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  bankTransferButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  securityText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  successIconText: {
    fontSize: 40,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Payment;
