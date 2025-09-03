// src/components/ListingCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

const ListingCard = ({ 
  listing, 
  onPress, 
  onEdit, 
  onDelete, 
  isEditable = false 
}) => {
  // Güvenlik kontrolü
  if (!listing) {
    console.warn('ListingCard: listing prop is undefined');
    return null;
  }

  const {
    id,
    title,
    city,
    district,
    neighborhood,
    price,
    listingStatus,
    propertyType,
    squareMeters,
    roomCount,
    buildingAge,
    floor,
    parking,
    isPublished,
    images = []
  } = listing;

  const formatPrice = (price) => {
    if (!price) return 'Fiyat belirtilmemiş';
    if (listingStatus === 'Kiralık') {
      return `₺${price.toLocaleString()}/ay`;
    }
    return `₺${price.toLocaleString()}`;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !isPublished && styles.containerHidden
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {images && images.length > 0 ? (
          <Image 
            source={{ uri: images[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🏠</Text>
          </View>
        )}
        


        {isEditable && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => onEdit && onEdit(listing)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => onDelete && onDelete(id)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title || 'Başlık belirtilmemiş'}
          </Text>
          <Text style={styles.price}>
            {formatPrice(price)}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>
                {city}, {district}, {neighborhood}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏠</Text>
              <Text style={styles.detailText}>
                {propertyType} • {roomCount} • {squareMeters}m²
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏗️</Text>
              <Text style={styles.detailText}>
                {buildingAge} yaşında • {floor}. kat
              </Text>
            </View>
          </View>

          {parking && (
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>🚗</Text>
                <Text style={styles.detailText}>Otopark mevcut</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.listingStatus}>
            <Text style={[styles.listingStatusText, { color: theme.colors.primary }]}>
              {listingStatus}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  containerHidden: {
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 0, 0.4)',
  },

  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: theme.colors.textSecondary,
  },

  actionButtons: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  actionButtonText: {
    fontSize: 16,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  details: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: theme.spacing.sm,
    width: 16,
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  listingStatus: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  listingStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ListingCard;
