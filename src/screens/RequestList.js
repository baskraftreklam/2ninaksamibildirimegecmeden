import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { fetchUserRequests } from '../services/firestore';

const RequestList = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [hiddenRequests, setHiddenRequests] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user requests on component mount
  useEffect(() => {
    if (user && user.uid) {
      loadUserRequests();
    } else {
      setLoading(false);
    }
  }, [user, loadUserRequests]);

  const loadUserRequests = useCallback(async () => {
    if (!user || !user.uid) {
      return;
    }
    
    try {
      setLoading(true);
      const data = await fetchUserRequests(user.uid);
      setRequests(data);
    } catch (error) {
      console.error('[RequestList] Error loading user requests:', error);
      Alert.alert('Hata', 'Talepler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [user]);

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
                 {isHidden(request.id) ? '👁️' : '👁️'}
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
            <Text style={styles.detailValue}>
              {request.locations && request.locations.length > 0 
                ? request.locations.join(', ') 
                : request.neighborhood || 'Belirtilmemiş'
              }
            </Text>
          </View>
          

        </View>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Sol: Geri Butonu */}
      <TouchableOpacity
        style={styles.headerButtonBack}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.headerButtonIconBack}>←</Text>
      </TouchableOpacity>

      {/* Orta: Başlık ve Alt Başlık */}
      <View style={styles.headerContent}>
        <Text style={styles.mainTitle}>
          {showFavorites ? 'Favori Talepler' : showHidden ? 'Gizlenmiş Talepler' : 'Taleplerim'}
        </Text>
        
        <Text style={styles.mainSubtitle}>
          {showFavorites 
            ? `${favorites.length} favori talep` 
            : showHidden
            ? `${hiddenRequests.length} gizlenmiş talep`
            : 'Bireysel Talepleriniz'
          }
        </Text>
      </View>

      {/* Sağ: Favori ve Gizleme Butonları */}
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
      {/* Arka Plan - Koyu mor katman */}
      <View style={styles.backgroundContainer} />



      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Talepler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderRequestCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}



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
  },
  
  // Arka Plan - Koyu mor katman
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 1, 57, 0.7)', // %70 opak koyu mor katman
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
  },

  

  listContainer: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },
  headerButtonBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.small,
  },
  headerButtonIconBack: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
  },
  mainTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    letterSpacing: 1,
  },
  mainSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textWhite,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  headerButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  headerButtonIcon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primary,
  },
  requestCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.medium,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
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
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  agentIcon: {
    fontSize: 20,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  agentOffice: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.normal,
    marginBottom: theme.spacing.xs,
  },
  agentTime: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
    fontWeight: theme.fontWeights.medium,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  favoriteIcon: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.white,
  },
  hideButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  hideIcon: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  propertyType: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
  },

  statusButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  detailsButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  detailsButtonText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.primary,
  },
  expandButton: {
    padding: theme.spacing.xs,
  },
  expandIcon: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  requestDetails: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.borderLight,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.medium,
    flex: 2,
    textAlign: 'right',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.large,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    textAlign: 'center',
  },
  emptySubtext: {
    color: theme.colors.textWhite,
    opacity: 0.8,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  },
  closeButton: {
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.textSecondary,
    padding: theme.spacing.xs,
  },


  modalContent: {
    flex: 1,
    padding: 20,
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

