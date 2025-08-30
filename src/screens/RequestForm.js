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
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const RequestForm = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [visibleNeighborhoods, setVisibleNeighborhoods] = useState(2);

  const atakumNeighborhoods = [
    "Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar",
    "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru",
    "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk",
    "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan",
    "Taflan", "Yeni Mahalle", "Yeşiltepe"
  ].sort();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    listingStatus: 'Satılık',
    budget: [500000, 10000000],
    squareMeters: [50, 350],
    roomCount: '',
    neighborhood1: '',
    neighborhood2: '',
    neighborhood3: '',
    neighborhood4: '',
    buildingAge: [0, 40],
    floor: [0, 20],
    publishToPool: true,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      budget: prev.listingStatus === 'Kiralık' ? [0, 50000] : [500000, 10000000]
    }));
  }, [formData.listingStatus]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusClick = (status) => {
    setFormData(prev => ({
      ...prev,
      listingStatus: status
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı ve soyadınızı girin.');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin.');
      return false;
    }
    if (!formData.neighborhood1) {
      Alert.alert('Hata', 'Lütfen en az bir mahalle seçin.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Simüle edilmiş form gönderimi
      await new Promise(resolve => setTimeout(resolve, 1500));

      const submissionData = {
        clientName: formData.name,
        clientPhone: formData.phone,
        propertyType: formData.listingStatus,
        roomCount: formData.roomCount,
        maxBudget: formData.budget[1],
        minSqMeters: formData.squareMeters[0],
        maxSqMeters: formData.squareMeters[1],
        locations: [formData.neighborhood1, formData.neighborhood2, formData.neighborhood3, formData.neighborhood4].filter(Boolean),
        notes: '',
        publishToPool: formData.publishToPool,
        createdAt: Date.now(),
        status: 'Yeni',
        agentId: 'mock-user-id',
        agentName: 'Danışman',
        agentPicture: null,
        agentPhone: null,
        agentOfficeName: null,
      };

      console.log('Form data submitted:', submissionData);

      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('DemandPool');
      }, 2500);

    } catch (error) {
      Alert.alert('Hata', 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const renderSlider = (label, field, min, max, step, formatValue, rangeLabels) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{formatValue(formData[field][0])}</Text>
        <Text style={styles.rangeLabel}>{formatValue(formData[field][1])}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View style={styles.sliderProgress} />
        <View style={[styles.sliderThumb, { left: `${(formData[field][0] / max) * 100}%` }]} />
        <View style={[styles.sliderThumb, { left: `${(formData[field][1] / max) * 100}%` }]} />
      </View>
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
          <Text style={styles.modalTitle}>Talebiniz Alınmıştır!</Text>
          <Text style={styles.modalMessage}>
            Sayfaya yönlendiriliyorsunuz...
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Talep Formu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Müşteri Talep Formu</Text>
            <Text style={styles.sectionDescription}>
              Ekibimiz, kriterlerinize en uygun portföyleri sizin için bulup en kısa sürede iletişime geçsin.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim Bilgileriniz</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Adınız Soyadınız</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Adınız ve soyadınız"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefon Numaranız</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="0555 123 45 67"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mülk Kriterleriniz</Text>
            
            <View style={styles.statusToggleContainer}>
              <Text style={styles.inputLabel}>İşlem Türü</Text>
              <View style={styles.statusToggleButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.listingStatus === 'Satılık' && styles.statusButtonActive
                  ]}
                  onPress={() => handleStatusClick('Satılık')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.listingStatus === 'Satılık' && styles.statusButtonTextActive
                  ]}>
                    Satılık
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.listingStatus === 'Kiralık' && styles.statusButtonActive
                  ]}
                  onPress={() => handleStatusClick('Kiralık')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.listingStatus === 'Kiralık' && styles.statusButtonTextActive
                  ]}>
                    Kiralık
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Oda Sayısı</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => {
                    Alert.alert(
                      'Oda Sayısı Seçin',
                      '',
                      [
                        { text: 'Farketmez', onPress: () => handleInputChange('roomCount', '') },
                        { text: '1+1', onPress: () => handleInputChange('roomCount', '1+1') },
                        { text: '2+1', onPress: () => handleInputChange('roomCount', '2+1') },
                        { text: '3+1', onPress: () => handleInputChange('roomCount', '3+1') },
                        { text: '4+1 ve üzeri', onPress: () => handleInputChange('roomCount', '4+1 ve üzeri') },
                        { text: 'İptal', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Text style={styles.pickerButtonText}>
                    {formData.roomCount || 'Farketmez'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {renderSlider(
              'Bütçe Aralığınız (₺)',
              'budget',
              0,
              formData.listingStatus === 'Kiralık' ? 200000 : 20000000,
              formData.listingStatus === 'Kiralık' ? 1000 : 100000,
              (value) => `${formatPrice(value)} ₺`,
              ['Min', 'Max']
            )}

            {renderSlider(
              'Metrekare Aralığı',
              'squareMeters',
              0,
              350,
              10,
              (value) => `${value} m²`,
              ['Min', 'Max']
            )}

            {renderSlider(
              'Bina Yaşı Aralığı',
              'buildingAge',
              0,
              40,
              1,
              (value) => value === 0 ? 'Sıfır' : `${value} Yaş`,
              ['Min', 'Max']
            )}

            {renderSlider(
              'Tercih Edilen Kat Aralığı',
              'floor',
              0,
              20,
              1,
              (value) => value === 0 ? 'Zemin' : `${value}. Kat`,
              ['Min', 'Max']
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konum Tercihleriniz</Text>
            
            {[1, 2, 3, 4].map((index) => {
              if (index > visibleNeighborhoods) return null;
              
              return (
                <View key={index} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{index}. Tercih Mahalle</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => {
                        Alert.alert(
                          `${index}. Tercih Mahalle Seçin`,
                          '',
                          [
                            ...atakumNeighborhoods.map(hood => ({
                              text: hood,
                              onPress: () => handleInputChange(`neighborhood${index}`, hood)
                            })),
                            { text: 'İptal', style: 'cancel' }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.pickerButtonText}>
                        {formData[`neighborhood${index}`] || 'Seçiniz...'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {visibleNeighborhoods < 4 && (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => setVisibleNeighborhoods(4)}
              >
                <Text style={styles.addMoreButtonText}>Daha Fazla Konum Ekle</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yayın Ayarları</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Talep havuzunda yayınlansın
              </Text>
              <Text style={styles.switchDescription}>
                Bu ayar açıkken tüm şehir bu talebi görüntüleyebilir
              </Text>
              <Switch
                value={formData.publishToPool}
                onValueChange={(value) => handleInputChange('publishToPool', value)}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.white}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Talebi Ekle</Text>
          </TouchableOpacity>
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
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
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
  statusToggleContainer: {
    marginBottom: theme.spacing.lg,
  },
  statusToggleButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statusButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statusButtonTextActive: {
    color: theme.colors.white,
  },
  pickerContainer: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
  },
  pickerButton: {
    padding: theme.spacing.md,
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  sliderContainer: {
    marginBottom: theme.spacing.lg,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  rangeLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    position: 'relative',
  },
  sliderProgress: {
    position: 'absolute',
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    left: '25%',
    right: '25%',
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    top: -8,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  addMoreButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  addMoreButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  switchDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
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

export default RequestForm;
