import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { makePhoneCall, sendWhatsAppMessage, sendEmail } from '../utils/contactUtils';

const { width } = Dimensions.get('window');

const DemandPool = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - gerçek uygulamada Firebase'den gelecek
  const mockRequests = [
    {
      id: '1',
      title: 'Atakum Denizevleri Satılık Daire Arıyorum',
      description: '3+1, 120m², deniz manzaralı daire arıyorum',
      city: 'Samsun',
      district: 'Atakum',
      neighborhood: 'Denizevleri',
      propertyType: 'Daire',
      roomCount: '3+1',
      minPrice: 2000000,
      maxPrice: 3000000,
      minSquareMeters: 100,
      maxSquareMeters: 150,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      contactInfo: {
        name: 'Ahmet Yılmaz',
        phone: '+90 555 123 4567',
        email: 'ahmet@example.com'
      }
    },
    {
      id: '2',
      title: 'İlkadım Merkez Kiralık Daire',
      description: '2+1, merkezi konumda, ulaşımı kolay',
      city: 'Samsun',
      district: 'İlkadım',
      neighborhood: 'Merkez',
      propertyType: 'Daire',
      roomCount: '2+1',
      minPrice: 5000,
      maxPrice: 8000,
      minSquareMeters: 70,
      maxSquareMeters: 100,
      status: 'active',
      createdAt: new Date('2024-01-14'),
      contactInfo: {
        name: 'Ayşe Demir',
        phone: '+90 555 987 6543',
        email: 'ayse@example.com'
      }
    },
    {
      id: '3',
      title: 'Canik Villa Satılık',
      description: '4+2, bahçeli, otoparklı villa',
      city: 'Samsun',
      district: 'Canik',
      neighborhood: 'Villa Mahallesi',
      propertyType: 'Villa',
      roomCount: '4+2',
      minPrice: 4000000,
      maxPrice: 6000000,
      minSquareMeters: 200,
      maxSquareMeters: 300,
      status: 'active',
      createdAt: new Date('2024-01-13'),
      contactInfo: {
        name: 'Mehmet Kaya',
        phone: '+90 555 456 7890',
        email: 'mehmet@example.com'
      }
    }
  ];

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
    if (selectedFilter === 'all') return mockRequests;
    return mockRequests.filter(request => request.status === selectedFilter);
  }, [selectedFilter]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Talepler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Talep Havuzu</Text>
        <Text style={styles.headerSubtitle}>
          Müşterilerinizin aradığı portföyleri görün
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'Tümü')}
        {renderFilterButton('active', 'Aktif')}
        {renderFilterButton('pending', 'Bekleyen')}
        {renderFilterButton('completed', 'Tamamlanan')}
      </View>

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
    backgroundColor: theme.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 16,
  },
  
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  filterButtonActive: {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  
  filterButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  
  filterButtonTextActive: {
    color: theme.colors.white,
  },
  
  listContainer: {
    padding: theme.spacing.lg,
  },
  
  requestCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  
  statusBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',

  },
  
  requestDescription: {
    fontSize: 14,
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
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  detailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  
  phoneButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  phoneButtonText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  whatsappButtonText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  emailButton: {
    flex: 1,
    backgroundColor: theme.colors.info,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  emailButtonText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  
  emptyText: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default DemandPool;

