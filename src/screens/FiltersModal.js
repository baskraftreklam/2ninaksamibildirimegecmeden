// src/screens/FiltersModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { theme } from '../theme/theme';

// Türkiye şehirleri
const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

// Atakum mahalleleri
const atakumNeighborhoods = [
  "Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar",
  "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru",
  "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk",
  "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan",
  "Taflan", "Yeni Mahalle", "Yeşiltepe"
].sort();

const FiltersModal = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    city: '',
    district: '',
    propertyType: '',
    listingStatus: '',
    minPrice: '',
    maxPrice: '',
    ...initialFilters
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    // Boş değerleri temizle
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        cleanFilters[key] = filters[key];
      }
    });
    onApply(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      district: '',
      propertyType: '',
      listingStatus: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const renderPicker = (label, value, options, onSelect) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => {
          Alert.alert(
            label,
            '',
            [
              { text: 'Tümü', onPress: () => onSelect('') },
              ...options.map(option => ({
                text: option,
                onPress: () => onSelect(option)
              })),
              { text: 'İptal', style: 'cancel' }
            ]
          );
        }}
      >
        <Text style={styles.pickerButtonText}>
          {value || 'Seçiniz...'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInput = (label, value, placeholder, keyboardType = 'default') => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => handleFilterChange(label.toLowerCase().replace(/\s+/g, ''), text)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtreler</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderPicker('Şehir', filters.city, turkishCities, (value) => handleFilterChange('city', value))}
          
          {renderPicker('İlçe', filters.district, ['Atakum', 'İlkadım', 'Canik', 'Tekkeköy', 'Bafra'], (value) => handleFilterChange('district', value))}
          
          {renderPicker('Portföy Tipi', filters.propertyType, ['Daire', 'Villa', 'Arsa', 'İş Yeri'], (value) => handleFilterChange('propertyType', value))}
          
          {renderPicker('İşlem Türü', filters.listingStatus, ['Satılık', 'Kiralık'], (value) => handleFilterChange('listingStatus', value))}
          
          {renderInput('Min Fiyat (₺)', filters.minPrice, '0', 'numeric')}
          
          {renderInput('Max Fiyat (₺)', filters.maxPrice, '10000000', 'numeric')}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Sıfırla</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  filterGroup: {
    marginBottom: theme.spacing.lg,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  pickerButton: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.colors.text,
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
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  resetButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FiltersModal;
