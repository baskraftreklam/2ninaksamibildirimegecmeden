import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from '../theme/theme';

const MapPicker = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(
    initialPosition || { latitude: 41.33, longitude: 36.25 } // Samsun koordinatları
  );
  const [latitudeInput, setLatitudeInput] = useState(position.latitude.toString());
  const [longitudeInput, setLongitudeInput] = useState(position.longitude.toString());

  useEffect(() => {
    if (position && onLocationSelect) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  const handleCoordinateChange = () => {
    const lat = parseFloat(latitudeInput);
    const lng = parseFloat(longitudeInput);
    
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Hata', 'Lütfen geçerli koordinatlar girin.');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      Alert.alert('Hata', 'Enlem -90 ile 90 arasında olmalıdır.');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      Alert.alert('Hata', 'Boylam -180 ile 180 arasında olmalıdır.');
      return;
    }
    
    const newPosition = { latitude: lat, longitude: lng };
    setPosition(newPosition);
  };

  const presetLocations = [
    { name: 'Samsun Merkez', latitude: 41.33, longitude: 36.25 },
    { name: 'Atakum', latitude: 41.28, longitude: 36.33 },
    { name: 'İlkadım', latitude: 41.29, longitude: 36.33 },
    { name: 'Canik', latitude: 41.25, longitude: 36.33 },
    { name: 'Tekkeköy', latitude: 41.21, longitude: 36.46 },
    { name: 'Bafra', latitude: 41.56, longitude: 35.91 },
  ];

  const selectPresetLocation = (location) => {
    setPosition(location);
    setLatitudeInput(location.latitude.toString());
    setLongitudeInput(location.longitude.toString());
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Koordinat Girişi</Text>
          <Text style={styles.sectionDescription}>
            Portföyün konumunu koordinatlarla belirleyin
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enlem (Latitude)</Text>
            <TextInput
              style={styles.input}
              value={latitudeInput}
              onChangeText={setLatitudeInput}
              placeholder="41.33"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Boylam (Longitude)</Text>
            <TextInput
              style={styles.input}
              value={longitudeInput}
              onChangeText={setLongitudeInput}
              placeholder="36.25"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity style={styles.updateButton} onPress={handleCoordinateChange}>
            <Text style={styles.updateButtonText}>Koordinatları Güncelle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Seçim</Text>
          <Text style={styles.sectionDescription}>
            Samsun'un popüler bölgelerinden birini seçin
          </Text>
          
          <View style={styles.presetGrid}>
            {presetLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  position.latitude === location.latitude && 
                  position.longitude === location.longitude && 
                  styles.presetButtonActive
                ]}
                onPress={() => selectPresetLocation(location)}
              >
                <Text style={[
                  styles.presetButtonText,
                  position.latitude === location.latitude && 
                  position.longitude === location.longitude && 
                  styles.presetButtonTextActive
                ]}>
                  {location.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seçilen Konum</Text>
          <View style={styles.selectedLocationCard}>
            <View style={styles.locationPin}>
              <Text style={styles.pinIcon}>📍</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Seçilen Koordinatlar</Text>
              <Text style={styles.locationCoordinates}>
                {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
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
  updateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  updateButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  presetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minWidth: '48%',
  },
  presetButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  presetButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  presetButtonTextActive: {
    color: theme.colors.white,
  },
  selectedLocationCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPin: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  pinIcon: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  locationCoordinates: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },
});

export default MapPicker;
