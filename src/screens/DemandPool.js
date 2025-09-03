import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { makePhoneCall, sendWhatsAppMessage, sendEmail } from '../utils/contactUtils';
import { fetchRequests } from '../services/firestore';

const DemandPool = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [requests, setRequests] = useState([]);

  // Load published requests on component mount
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      // Sadece yayınlanmış talepleri getir (public view)
      const data = await fetchRequests({}, true);
      setRequests(data);
      console.log('[DemandPool] published requests loaded:', data.length);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Hata', 'Talepler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M TL';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K TL';
    }
    return price.toLocaleString() + ' TL';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'all') return requests;
    return requests.filter(request => request.status === selectedFilter);
  }, [selectedFilter, requests]);

  const renderRequestCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.requestCard}
      onPress={() => navigation.navigate('RequestDetail', { request: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.requestTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>

      <Text style={styles.requestDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Konum:</Text>
          <Text style={styles.detailValue}>
            {item.neighborhood}, {item.district}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Oda:</Text>
          <Text style={styles.detailValue}>{item.roomCount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fiyat:</Text>
          <Text style={styles.detailValue}>
            {formatPrice(item.minPrice)} - {formatPrice(item.maxPrice)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>m²:</Text>
          <Text style={styles.detailValue}>
            {item.minSquareMeters} - {item.maxSquareMeters}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          {formatDate(item.createdAt)}
        </Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity 
            style={styles.phoneButton}
            onPress={() => makePhoneCall(item.contactInfo.phone)}
          >
            <Text style={styles.phoneButtonText}>📞 Ara</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={() => sendWhatsAppMessage(item.contactInfo.phone, `Merhaba, ${item.title} talebi hakkında bilgi almak istiyorum.`)}
          >
            <Text style={styles.whatsappButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={() => sendEmail(item.contactInfo.email, `${item.title} Talebi Hakkında`, `Merhaba,\n\n${item.title} talebi hakkında detaylı bilgi almak istiyorum.\n\nTeşekkürler.`)}
          >
            <Text style={styles.emailButtonText}>📧 E-posta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Talep Havuzu</Text>
      <Text style={styles.headerSubtitle}>
        Müşterilerinizin aradığı portföyleri görün
      </Text>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      {renderFilterButton('all', 'Tümü')}
      {renderFilterButton('active', 'Aktif')}
      {renderFilterButton('pending', 'Bekleyen')}
      {renderFilterButton('completed', 'Tamamlanan')}
    </View>
  );

  const renderSkeletonCard = (index) => (
    <View key={index} style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonBadge} />
      </View>
      <View style={styles.skeletonDescription} />
      <View style={styles.skeletonDetails}>
        <View style={styles.skeletonDetailRow} />
        <View style={styles.skeletonDetailRow} />
        <View style={styles.skeletonDetailRow} />
      </View>
      <View style={styles.skeletonFooter}>
        <View style={styles.skeletonDate} />
        <View style={styles.skeletonButtons}>
          <View style={styles.skeletonButton} />
          <View style={styles.skeletonButton} />
          <View style={styles.skeletonButton} />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Arka Plan */}
        <View style={styles.backgroundContainer}>
          <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
        </View>
        
        {renderHeader()}
        {renderFilters()}

        <View style={styles.listContainer}>
          {/* Skeleton Loading Cards */}
          {[1, 2, 3].map(renderSkeletonCard)}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Arka Plan */}
      <View style={styles.backgroundContainer}>
        <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
      </View>
      
      {renderHeader()}
      {renderFilters()}

      <FlatList
        data={filteredRequests}
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Henüz talep bulunmuyor</Text>
            <Text style={styles.emptySubtext}>
              Yeni talepler eklendiğinde burada görünecek
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Arka Plan - Anasayfadaki gibi
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  header: {
    padding: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    paddingTop: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.large,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.textWhite,
    textAlign: 'center',
  },
  
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.large,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.white,
    flex: 1,
  },
  
  filterButtonActive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
  },
  
  filterButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    textAlign: 'center',
  },
  
  filterButtonTextActive: {
    color: theme.colors.primary,
  },
  
  listContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  
  requestCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  
  requestTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  
  statusBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  
  statusText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  
  requestDescription: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  
  requestDetails: {
    marginBottom: theme.spacing.md,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  detailLabel: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  
  detailValue: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.semibold,
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  },
  
  dateText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  phoneButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  phoneButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  
  whatsappButton: {
    flex: 1,
    backgroundColor: theme.colors.info,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  whatsappButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  
  emailButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  emailButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    marginTop: theme.spacing.lg,
    ...theme.shadows.large,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  
  emptyText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.fontWeights.semibold,
    textAlign: 'center',
  },
  
  emptySubtext: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textWhite,
    textAlign: 'center',
  },

  // Skeleton Loading Styles
  skeletonCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },

  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },

  skeletonTitle: {
    height: 20,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.sm,
    flex: 1,
    marginRight: theme.spacing.md,
  },

  skeletonBadge: {
    width: 60,
    height: 24,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.sm,
  },

  skeletonDescription: {
    height: 16,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },

  skeletonDetails: {
    marginBottom: theme.spacing.md,
  },

  skeletonDetailRow: {
    height: 14,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 4,
  },

  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  },

  skeletonDate: {
    width: 80,
    height: 12,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.sm,
  },

  skeletonButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  skeletonButton: {
    flex: 1,
    height: 36,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.md,
  },
});

export default DemandPool;
