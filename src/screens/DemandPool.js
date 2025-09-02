import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { makePhoneCall, sendWhatsAppMessage, sendEmail } from '../utils/contactUtils';
import { fetchRequests } from '../services/firestore';

const { width, height } = Dimensions.get('window');

const DemandPool = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [requests, setRequests] = useState([]);

  // Load published requests on component mount
  useEffect(() => {
    loadRequests();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Arka Plan */}
        <View style={styles.backgroundContainer}>
          <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
        </View>
        
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

        <View style={styles.listContainer}>
          {/* Skeleton Loading Cards */}
          {[1, 2, 3].map((index) => (
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
          ))}
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
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  
  header: {
    padding: 30,
    paddingBottom: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(19, 1, 57, 0.95)', // Daha belirgin koyu mor container
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF', // Beyaz metin
    marginBottom: 8,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)', // Şeffaf beyaz
    textAlign: 'center',
  },
  
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: 'rgba(19, 1, 57, 0.95)', // Daha belirgin koyu mor container
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Şeffaf beyaz
    borderWidth: 1,
    borderColor: '#ffffff', // Beyaz border
    flex: 1,
  },
  
  filterButtonActive: {
    backgroundColor: '#ffffff', // Beyaz arka plan
    borderColor: '#ffffff',
  },
  
  filterButtonText: {
    color: '#ffffff', // Beyaz yazı
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  filterButtonTextActive: {
    color: '#130139', // Koyu mor yazı
  },
  
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  
  requestCard: {
    backgroundColor: '#FFFFFF', // Anasayfadaki beyaz kart rengi
    borderRadius: Math.min(width * 0.05, 15), // Anasayfadaki border radius
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(19, 1, 57, 0.3)', // Daha belirgin koyu mor border
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#130139', // Anasayfadaki koyu mor metin rengi
    flex: 1,
    marginRight: 12,
  },
  
  statusBadge: {
    backgroundColor: '#130139', // Anasayfadaki koyu mor
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  requestDescription: {
    fontSize: 14,
    color: '#374151', // Anasayfadaki gri metin rengi
    marginBottom: 16,
    lineHeight: 20,
  },
  
  requestDetails: {
    marginBottom: 16,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  detailLabel: {
    fontSize: 14,
    color: '#374151', // Anasayfadaki gri metin rengi
    fontWeight: '500',
  },
  
  detailValue: {
    fontSize: 14,
    color: '#130139', // Anasayfadaki koyu mor
    fontWeight: '600',
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(19, 1, 57, 0.2)', // Daha belirgin koyu mor border
  },
  
  dateText: {
    fontSize: 12,
    color: '#374151', // Anasayfadaki gri metin rengi
  },
  
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  phoneButton: {
    flex: 1,
    backgroundColor: '#130139', // Anasayfadaki koyu mor
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  phoneButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  emailButton: {
    flex: 1,
    backgroundColor: '#130139', // Anasayfadaki koyu mor
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: 'rgba(19, 1, 57, 0.95)', // Daha belirgin koyu mor container
    borderRadius: 15,
    padding: 30,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF', // Beyaz metin
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)', // Şeffaf beyaz
    textAlign: 'center',
  },

  // Skeleton Loading Styles
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Math.min(width * 0.05, 15),
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(19, 1, 57, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },

  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  skeletonTitle: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    flex: 1,
    marginRight: 12,
  },

  skeletonBadge: {
    width: 60,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  skeletonDescription: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },

  skeletonDetails: {
    marginBottom: 16,
  },

  skeletonDetailRow: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },

  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(19, 1, 57, 0.2)',
  },

  skeletonDate: {
    width: 80,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  skeletonButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  skeletonButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
});

export default DemandPool;
