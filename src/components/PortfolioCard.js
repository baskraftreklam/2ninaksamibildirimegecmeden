import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme/theme';

const PortfolioCard = ({ 
  portfolio, 
  onPress, 
  onEdit, 
  onDelete, 
  isEditable = false,
  showActions = true 
}) => {
  // Güvenlik kontrolü
  if (!portfolio) {
    console.warn('PortfolioCard: portfolio prop is undefined');
    return null;
  }

  const {
    id,
    title,
    description,
    location,
    price,
    images = [],
    propertyType,
    status = 'active',
    createdAt,
    contactInfo
  } = portfolio;

  const formatPrice = (price) => {
    if (!price) return 'Fiyat belirtilmemiş';
    return `₺${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'inactive': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Beklemede';
      case 'inactive': return 'Pasif';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
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
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}
        
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
          <Text style={styles.statusText}>{getStatusText(status)}</Text>
        </View>

        {showActions && isEditable && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => onEdit && onEdit(portfolio)}
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

        <Text style={styles.description} numberOfLines={3}>
          {description || 'Açıklama belirtilmemiş'}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {location || 'Konum belirtilmemiş'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🏠</Text>
            <Text style={styles.detailText}>
              {propertyType || 'Tip belirtilmemiş'}
            </Text>
          </View>

          {contactInfo && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📞</Text>
              <Text style={styles.detailText} numberOfLines={1}>
                {contactInfo}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            {formatDate(createdAt)}
          </Text>
          
          {status === 'pending' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Onay Bekliyor</Text>
            </View>
          )}
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
  imageContainer: {
    position: 'relative',
    height: 200,
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
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  details: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    width: 20,
  },
  detailText: {
    fontSize: 14,
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
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  pendingBadge: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  pendingText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600',
  },
});

export default PortfolioCard;
