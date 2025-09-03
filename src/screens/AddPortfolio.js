import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { addPortfolio } from '../services/firestore';
import MapPicker from '../components/MapPicker';

const AddPortfolio = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    city: 'Samsun',
    district: 'Atakum',
    neighborhood: '',
    price: '',
    squareMeters: '',
    roomCount: '1+1',
    buildingAge: '',
    floor: '',
    totalFloors: '',
    propertyType: 'Daire',
    listingStatus: 'Satılık',
    description: '',
    features: '',
    parking: false,
    furnished: false,
    heatingType: 'Doğalgaz',
    images: [],
    location: { latitude: 41.33, longitude: 36.25 }, // Samsun koordinatları
    isPublished: true, // Varsayılan olarak yayınla
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location
    }));
  };

  // Resim yükleme fonksiyonu (Cloudinary ile - fetch API)
  const handleImageUpload = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `portfolio_${Date.now()}.jpg`
      });
      formData.append('upload_preset', 'armenkuL_preset');
      
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dutsz2qlo/image/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      if (!responseData.secure_url) {
        throw new Error('Cloudinary\'den geçerli URL alınamadı');
      }
      
      const uploadedImageUrl = responseData.secure_url;
      console.log('Resim Cloudinary\'ye yüklendi:', uploadedImageUrl);
      
      // Resmi form verilerine ekle
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedImageUrl]
      }));
      
      return uploadedImageUrl;
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      Alert.alert('Hata', 'Resim yüklenemedi: ' + error.message);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.squareMeters) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun (Başlık, Fiyat, Metrekare)');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Kullanıcı girişi yapılmamış.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Portföy verilerini hazırla
      const portfolioData = {
        ...formData,
        price: parseInt(formData.price),
        squareMeters: parseInt(formData.squareMeters),
        buildingAge: formData.buildingAge ? parseInt(formData.buildingAge) : 0,
        floor: formData.floor ? parseInt(formData.floor) : 0,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0,
      };

      // Servise gönder
      const result = await addPortfolio(portfolioData, user.uid);
      
              if (result.success) {
          Alert.alert(
          'Başarılı!',
          `Portföy başarıyla kaydedildi ve ${formData.isPublished ? 'yayınlandı' : 'gizlendi'}.`,
          [
            {
              text: 'Tamam',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error adding portfolio:', error);
      Alert.alert('Hata', 'Portföy kaydedilirken bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default', required = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderPicker = (label, field, options, required = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.pickerOption,
              formData[field] === option.value && styles.pickerOptionActive
            ]}
            onPress={() => handleInputChange(field, option.value)}
          >
            <Text style={[
              styles.pickerOptionText,
              formData[field] === option.value && styles.pickerOptionTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCheckbox = (label, field) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => handleInputChange(field, !formData[field])}
    >
      <View style={[
        styles.checkbox,
        formData[field] && styles.checkboxActive
      ]}>
        {formData[field] && <Text style={styles.checkboxIcon}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Portföy Ekle</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
          
          {renderInput('Başlık', 'title', 'Portföy başlığı girin', 'default', true)}
          
          {renderPicker('İlan Durumu', 'listingStatus', [
            { value: 'Satılık', label: 'Satılık' },
            { value: 'Kiralık', label: 'Kiralık' }
          ], true)}
          
          {renderPicker('Emlak Tipi', 'propertyType', [
            { value: 'Daire', label: 'Daire' },
            { value: 'Villa', label: 'Villa' },
            { value: 'Müstakil Ev', label: 'Müstakil Ev' },
            { value: 'İş Yeri', label: 'İş Yeri' },
            { value: 'Arsa', label: 'Arsa' }
          ], true)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konum Bilgileri</Text>
          
          {renderPicker('İlçe', 'district', [
            { value: 'Atakum', label: 'Atakum' },
            { value: 'İlkadım', label: 'İlkadım' },
            { value: 'Canik', label: 'Canik' },
            { value: 'Tekkeköy', label: 'Tekkeköy' },
            { value: 'Bafra', label: 'Bafra' }
          ])}
          
          {renderInput('Mahalle', 'neighborhood', 'Mahalle adı girin')}
          
          <View style={styles.locationContainer}>
            <Text style={styles.inputLabel}>Konum Seçimi</Text>
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => setShowMapPicker(true)}
            >
              <Text style={styles.mapButtonText}>🗺️ Haritadan Konum Seç</Text>
            </TouchableOpacity>
            {formData.location && (
              <View style={styles.coordinatesDisplay}>
                <Text style={styles.coordinatesText}>
                  Enlem: {formData.location.latitude.toFixed(6)}
                </Text>
                <Text style={styles.coordinatesText}>
                  Boylam: {formData.location.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiyat ve Özellikler</Text>
          
          {renderInput('Fiyat (TL)', 'price', 'Fiyat girin', 'numeric', true)}
          {renderInput('Metrekare', 'squareMeters', 'Metrekare girin', 'numeric', true)}
          
          {renderPicker('Oda Sayısı', 'roomCount', [
            { value: '1+0', label: '1+0' },
            { value: '1+1', label: '1+1' },
            { value: '2+1', label: '2+1' },
            { value: '3+1', label: '3+1' },
            { value: '4+1', label: '4+1' },
            { value: '5+1', label: '5+1' }
          ])}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bina Bilgileri</Text>
          
          {renderInput('Bina Yaşı', 'buildingAge', 'Bina yaşı girin', 'numeric')}
          {renderInput('Bulunduğu Kat', 'floor', 'Kat numarası girin', 'numeric')}
          {renderInput('Toplam Kat', 'totalFloors', 'Toplam kat sayısı girin', 'numeric')}
          
          {renderPicker('Isıtma Tipi', 'heatingType', [
            { value: 'Doğalgaz', label: 'Doğalgaz' },
            { value: 'Merkezi', label: 'Merkezi' },
            { value: 'Kombi', label: 'Kombi' },
            { value: 'Soba', label: 'Soba' }
          ])}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          
          {renderCheckbox('Otopark', 'parking')}
          {renderCheckbox('Eşyalı', 'furnished')}
          
          {renderInput('Açıklama', 'description', 'Detaylı açıklama girin', 'default')}
          {renderInput('Özellikler', 'features', 'Özellikler (virgülle ayırın)', 'default')}
        </View>

        {/* Yayınla/Gizle Switch */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yayın Ayarları</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Portföyü Yayınla</Text>
            <Switch
              value={formData.isPublished}
              onValueChange={(value) => setFormData(prev => ({ ...prev, isPublished: value }))}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={formData.isPublished ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.switchDescription}>
            {formData.isPublished 
              ? 'Portföy portföy havuzunda görünecek' 
              : 'Portföy sadece sizin portföylerinizde görünecek'
            }
          </Text>
        </View>

        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Kaydediliyor...' : 'Portföyü Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Map Picker Modal */}
      <Modal
        visible={showMapPicker}
        animationType="slide"
        onRequestClose={() => setShowMapPicker(false)}
      >
        <View style={styles.mapModalContainer}>
          <View style={styles.mapModalHeader}>
            <TouchableOpacity 
              style={styles.mapModalCloseButton}
              onPress={() => setShowMapPicker(false)}
            >
              <Text style={styles.mapModalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.mapModalTitle}>Konum Seçin</Text>
            <View style={styles.mapModalPlaceholder} />
          </View>
          <MapPicker 
            onLocationSelect={handleLocationSelect}
            initialPosition={formData.location}
          />
        </View>
      </Modal>
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
    borderBottomColor: theme.colors.borderDark,
    backgroundColor: theme.colors.cardBg,
  },
  
  backButton: {
    padding: theme.spacing.sm,
  },
  
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  
  headerTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
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
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  
  sectionTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  
  inputLabel: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  required: {
    color: theme.colors.error,
  },
  
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.inputText,
    fontSize: theme.fontSizes.xxl,
  },
  
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  
  pickerOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  
  pickerOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  
  pickerOptionText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.medium,
  },
  
  pickerOptionTextActive: {
    color: theme.colors.white,
  },
  
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  
  checkboxIcon: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  checkboxLabel: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
  },
  
  submitContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.large,
  },
  
  submitButtonDisabled: {
    opacity: 0.6,
  },
  
  submitButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  locationContainer: {
    marginTop: theme.spacing.md,
  },
  
  mapButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadows.small,
  },
  
  mapButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  coordinatesDisplay: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  switchLabel: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.medium,
  },

  switchDescription: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },

  coordinatesText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontFamily: 'monospace',
  },
  
  mapModalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDark,
    backgroundColor: theme.colors.cardBg,
  },
  
  mapModalCloseButton: {
    padding: theme.spacing.sm,
  },
  
  mapModalCloseText: {
    fontSize: 24,
    color: theme.colors.text,
  },
  
  mapModalTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  
  mapModalPlaceholder: {
    width: 40,
  },
});

export default AddPortfolio;
