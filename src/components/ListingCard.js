// src/components/ListingCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

const ListingCard = ({ item, onPress, onFavorite, isFavorite = false }) => {
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M TL';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K TL';
    }
    return price.toLocaleString() + ' TL';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: item.images && item.images.length > 0 
              ? item.images[0] 
              : 'https://via.placeholder.com/400x300.png?text=Resim+Yok'
          }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        {item.roomCount && (
          <View style={styles.roomBadge}>
            <Text style={styles.roomBadgeText}>{String(item.roomCount)}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => onFavorite && onFavorite(item.id)}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {String(item.title)}
        </Text>

        <View style={styles.cardInfo}>
          {item.squareMeters && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏠</Text>
              <Text style={styles.infoText}>{String(item.squareMeters)} m²</Text>
            </View>
          )}
          {item.buildingAge && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏢</Text>
              <Text style={styles.infoText}>{String(item.buildingAge)} Yaş</Text>
            </View>
          )}
          {item.floor && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🛏️</Text>
              <Text style={styles.infoText}>{String(item.floor)}. Kat</Text>
            </View>
          )}
          {item.parking && (
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🚗</Text>
              <Text style={styles.infoText}>Otopark</Text>
            </View>
          )}
        </View>

        <View style={styles.cardAddress}>
          <Text style={styles.addressIcon}>📍</Text>
          <Text style={styles.addressText}>
            {String(item.neighborhood)}, {String(item.district)}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    width: (width - 48) / 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: theme.spacing.md,
  },
  
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  roomBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff0000',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  
  roomBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  favoriteIcon: {
    fontSize: 16,
  },
  
  cardBody: {
    padding: theme.spacing.md,
  },
  
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  
  cardInfo: {
    marginBottom: theme.spacing.sm,
  },
  
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  infoIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  
  infoText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  
  cardAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  addressIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  
  addressText: {
    fontSize: 11,
    color: theme.colors.lightGray,
    flex: 1,
  },
  
  cardFooter: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff0000',
  },
});

export default ListingCard;
