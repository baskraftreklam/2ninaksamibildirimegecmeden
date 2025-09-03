import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { theme } from '../theme/theme';

const DisplayMap = ({ position, style, onPress }) => {
  if (!position || !position.latitude || !position.longitude) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Konum bilgisi bulunamadı.</Text>
        </View>
      </View>
    );
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${position.latitude},${position.longitude}`;
    Linking.openURL(url);
  };

  const openInAppleMaps = () => {
    const url = `http://maps.apple.com/?q=${position.latitude},${position.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapContainer}>
        <View style={styles.mapContent}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>📍 Konum</Text>
            <View style={styles.locationPin}>
              <Text style={styles.pinIcon}>📍</Text>
            </View>
          </View>
          
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesTitle}>Koordinatlar:</Text>
            <Text style={styles.coordinatesText}>
              Enlem: {position.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Boylam: {position.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.mapButtons}>
            <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
              <Text style={styles.mapButtonText}>🗺️ Google Maps'te Aç</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mapButton} onPress={openInAppleMaps}>
              <Text style={styles.mapButtonText}>🍎 Apple Maps'te Aç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  mapContent: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  locationPin: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pinIcon: {
    fontSize: 32,
  },
  coordinatesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  coordinatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  coordinatesText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  mapButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  mapButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  mapButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
  },
  errorText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});

export default DisplayMap;
