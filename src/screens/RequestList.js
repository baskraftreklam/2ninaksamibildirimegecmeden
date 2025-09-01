import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const RequestList = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMatchingPortfolios, setShowMatchingPortfolios] = useState(false);
  const [hiddenRequests, setHiddenRequests] = useState([]);
  const [showHidden, setShowHidden] = useState(false);

  // Mock data
  const [requests, setRequests] = useState([
    {
      id: '1',
      clientName: 'Ahmet Yılmaz',
      clientPhone: '0555 123 45 67',
      officeName: 'Samsun Emlak Ofisi',
      propertyType: 'Satılık',
      maxBudget: 2500000,
      minSqMeters: 80,
      maxSqMeters: 120,
      roomCount: '2+1',
      locations: ['Atakent', 'Güzelyalı', 'Cumhuriyet'],
      status: 'Yeni',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 gün önce
      notes: 'Merkezi konumda, asansörlü bina tercih edilir.',
      matchingPortfolios: 3,
    },
    {
      id: '2',
      clientName: 'Fatma Demir',
      clientPhone: '0555 987 65 43',
      officeName: 'Deniz Emlak',
      propertyType: 'Kiralık',
      maxBudget: 15000,
      minSqMeters: 60,
      maxSqMeters: 90,
      roomCount: '1+1',
      locations: ['Denizevleri', 'Çamlıyazı'],
      status: 'İşlemde',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 gün önce
      notes: 'Deniz manzaralı, güvenli site tercih edilir.',
      matchingPortfolios: 1,
    },
    {
      id: '3',
      clientName: 'Mehmet Kaya',
      clientPhone: '0555 456 78 90',
      officeName: 'Kolpınar Emlak',
      propertyType: 'Satılık',
      maxBudget: 5000000,
      minSqMeters: 120,
      maxSqMeters: 180,
      roomCount: '3+1',
      locations: ['Büyükkolpınar', 'Küçükkolpınar'],
      status: 'Sonuçlandı',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 gün önce
      notes: 'Bahçeli müstakil ev tercih edilir.',
      matchingPortfolios: 0,
    },
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const requestDate = new Date(timestamp);
    const diffTime = Math.abs(now - requestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Bugün';
    } else if (diffDays === 2) {
      return 'Dün';
    } else if (diffDays <= 7) {
      return `${diffDays}. gün`;
    } else {
      return formatDate(timestamp);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yeni': return '#3b82f6';
      case 'İşlemde': return '#f59e0b';
      case 'Sonuçlandı': return '#10b981';
      case 'İptal': return '#ef4444';
      default: return theme.colors.textSecondary;
    }
  };

  const handleStatusUpdate = (requestId, newStatus) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleShowDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleToggleExpand = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const toggleFavorite = (requestId) => {
    setFavorites(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const isFavorite = (requestId) => {
    return favorites.includes(requestId);
  };

  const isHidden = (requestId) => {
    return hiddenRequests.includes(requestId);
  };

  const toggleHidden = (requestId) => {
    setHiddenRequests(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const filteredRequests = useMemo(() => {
    let filtered = requests;
    
    // Gizli talepleri filtrele
    if (!showHidden) {
      filtered = filtered.filter(request => !hiddenRequests.includes(request.id));
    }
    
    // Favori talepleri göster
    if (showFavorites) {
      filtered = filtered.filter(request => favorites.includes(request.id));
    }
    
    return filtered;
  }, [requests, showFavorites, favorites, showHidden, hiddenRequests]);

  const renderRequestCard = ({ item: request }) => {
    const isExpanded = expandedRequest === request.id;
    const statusColor = getStatusColor(request.status);

    return (
      <Animated.View
        style={[
          styles.requestCard,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          style={styles.requestHeader}
          onPress={() => handleToggleExpand(request.id)}
          activeOpacity={0.8}
        >
          <View style={styles.agentInfo}>
            <View style={styles.agentPicture}>
              <Text style={styles.agentIcon}>👤</Text>
            </View>
                         <View style={styles.agentDetails}>
               <Text style={styles.agentName}>{request.clientName}</Text>
               <Text style={styles.agentOffice}>{request.officeName}</Text>
               <Text style={styles.agentTime}>{getTimeAgo(request.createdAt)}</Text>
             </View>
          </View>

          <View style={styles.requestActions}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(request.id)}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite(request.id) ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => toggleHidden(request.id)}
            >
              <Text style={styles.hideIcon}>
                {isHidden(request.id) ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>

                         <View style={styles.statusBadge}>
               <Text style={styles.propertyType}>{request.propertyType}</Text>
             </View>
             
             <TouchableOpacity
               style={[styles.statusButton, { backgroundColor: statusColor }]}
               onPress={() => {
                 Alert.alert(
                   'Durum Değiştir',
                   'Yeni durumu seçin:',
                   [
                     { text: 'Yeni', onPress: () => handleStatusUpdate(request.id, 'Yeni') },
                     { text: 'İşlemde', onPress: () => handleStatusUpdate(request.id, 'İşlemde') },
                     { text: 'Sonuçlandı', onPress: () => handleStatusUpdate(request.id, 'Sonuçlandı') },
                     { text: 'İptal', onPress: () => handleStatusUpdate(request.id, 'İptal') },
                     { text: 'Vazgeç', style: 'cancel' }
                   ]
                 );
               }}
             >
               <Text style={styles.statusText}>{request.status}</Text>
             </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handleShowDetails(request)}
            >
              <Text style={styles.detailsButtonText}>📋</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.expandButton}>
              <Text style={styles.expandIcon}>
                {isExpanded ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.requestDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💰 Bütçe:</Text>
            <Text style={styles.detailValue}>En Fazla {formatPrice(request.maxBudget)} ₺</Text>
          </View>
          {request.roomCount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🛏️ Oda:</Text>
              <Text style={styles.detailValue}>{request.roomCount}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Lokasyon:</Text>
            <Text style={styles.detailValue}>{request.locations.join(', ')}</Text>
          </View>
          
          {request.matchingPortfolios > 0 && (
            <TouchableOpacity
              style={styles.matchingButton}
              onPress={() => {
                setShowMatchingPortfolios(true);
                setSelectedRequest(request);
              }}
            >
              <Text style={styles.matchingButtonText}>
                🏠 {request.matchingPortfolios} Eşleşen Portföyünüz Bulundu
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <Text style={styles.mainTitle}>
            {showFavorites ? 'Favori Talepler' : showHidden ? 'Gizlenmiş Talepler' : 'Talep Havuzu'}
          </Text>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, showFavorites && styles.headerButtonActive]}
              onPress={() => {
                setShowFavorites(!showFavorites);
                setShowHidden(false);
              }}
            >
              <Text style={styles.headerButtonIcon}>
                {showFavorites ? '📋' : '❤️'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerButton, showHidden && styles.headerButtonActive]}
              onPress={() => {
                setShowHidden(!showHidden);
                setShowFavorites(false);
              }}
            >
              <Text style={styles.headerButtonIcon}>
                {showHidden ? '📋' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.mainSubtitle}>
          {showFavorites 
            ? `${favorites.length} favori talep` 
            : showHidden
            ? `${hiddenRequests.length} gizlenmiş talep`
            : `${requests.filter(r => !hiddenRequests.includes(r.id)).length} aktif talep`
          }
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {showFavorites ? '❤️' : showHidden ? '🙈' : '📋'}
      </Text>
      <Text style={styles.emptyText}>
        {showFavorites 
          ? 'Henüz favori talebiniz yok' 
          : showHidden 
          ? 'Henüz gizlenmiş talebiniz yok'
          : 'Henüz talep bulunamadı'
        }
      </Text>
      <Text style={styles.emptySubtext}>
        {showFavorites 
          ? 'Beğendiğiniz talepleri favorilere ekleyin' 
          : showHidden
          ? 'Gizlemek istediğiniz talepleri gizleyin'
          : 'Yeni talepler eklendiğinde burada görünecek'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
             <FlatList
         data={filteredRequests}
         renderItem={renderRequestCard}
         keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
      />

      {/* Eşleşen Portföyler Modal */}
      <Modal
        visible={showMatchingPortfolios}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Eşleşen Portföyler</Text>
            <TouchableOpacity onPress={() => setShowMatchingPortfolios(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              {selectedRequest?.clientName} için uygun portföyleriniz:
            </Text>
            
            {/* Mock eşleşen portföyler */}
            <View style={styles.matchingPortfolioCard}>
              <Text style={styles.portfolioTitle}>Atakent Satılık Daire</Text>
              <Text style={styles.portfolioDetails}>2+1 • 95m² • 2.300.000 ₺</Text>
              <TouchableOpacity style={styles.viewPortfolioButton}>
                <Text style={styles.viewPortfolioText}>Portföyü Görüntüle</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.matchingPortfolioCard}>
              <Text style={styles.portfolioTitle}>Güzelyalı Satılık Daire</Text>
              <Text style={styles.portfolioDetails}>2+1 • 110m² • 2.450.000 ₺</Text>
              <TouchableOpacity style={styles.viewPortfolioButton}>
                <Text style={styles.viewPortfolioText}>Portföyü Görüntüle</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.matchingPortfolioCard}>
              <Text style={styles.portfolioTitle}>Cumhuriyet Satılık Daire</Text>
              <Text style={styles.portfolioDetails}>2+1 • 85m² • 2.100.000 ₺</Text>
              <TouchableOpacity style={styles.viewPortfolioButton}>
                <Text style={styles.viewPortfolioText}>Portföyü Görüntüle</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Detay Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Talep Detayları</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedRequest && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Müşteri Bilgileri</Text>
                  <Text style={styles.detailText}>İsim: {selectedRequest.clientName}</Text>
                  <Text style={styles.detailText}>Telefon: {selectedRequest.clientPhone}</Text>
                  <Text style={styles.detailText}>Oluşturulma: {formatDate(selectedRequest.createdAt)}</Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Talep Detayları</Text>
                  <Text style={styles.detailText}>İşlem Türü: {selectedRequest.propertyType}</Text>
                  <Text style={styles.detailText}>Bütçe: En Fazla {formatPrice(selectedRequest.maxBudget)} ₺</Text>
                  <Text style={styles.detailText}>Metrekare: {selectedRequest.minSqMeters} - {selectedRequest.maxSqMeters} m²</Text>
                  {selectedRequest.roomCount && (
                    <Text style={styles.detailText}>Oda: {selectedRequest.roomCount}</Text>
                  )}
                  <Text style={styles.detailText}>Lokasyon: {selectedRequest.locations.join(', ')}</Text>
                </View>
                
                {selectedRequest.notes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Notlar</Text>
                    <Text style={styles.detailText}>{selectedRequest.notes}</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
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
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 1,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#ff0000',
    opacity: 0.8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonActive: {
    backgroundColor: '#ff0000',
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  requestCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentIcon: {
    fontSize: 20,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  agentOffice: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '400',
    marginBottom: 2,
  },
  agentTime: {
    fontSize: 11,
    color: '#ff0000',
    fontWeight: '500',
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  hideButton: {
    padding: 4,
  },
  hideIcon: {
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  propertyType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ff0000',
  },

  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  detailsButton: {
    padding: 4,
  },
  detailsButtonText: {
    fontSize: 16,
  },
  expandButton: {
    padding: 4,
  },
  expandIcon: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  requestDetails: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  matchingButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  matchingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  matchingPortfolioCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  portfolioDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  viewPortfolioButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewPortfolioText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default RequestList;

