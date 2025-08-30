import React, { useState, useEffect } from 'react';
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

  // Mock data
  const [requests, setRequests] = useState([
    {
      id: '1',
      clientName: 'Ahmet Yılmaz',
      clientPhone: '0555 123 45 67',
      propertyType: 'Satılık',
      maxBudget: 2500000,
      minSqMeters: 80,
      maxSqMeters: 120,
      roomCount: '2+1',
      locations: ['Atakent', 'Güzelyalı', 'Cumhuriyet'],
      status: 'Yeni',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 gün önce
      notes: 'Merkezi konumda, asansörlü bina tercih edilir.',
    },
    {
      id: '2',
      clientName: 'Fatma Demir',
      clientPhone: '0555 987 65 43',
      propertyType: 'Kiralık',
      maxBudget: 15000,
      minSqMeters: 60,
      maxSqMeters: 90,
      roomCount: '1+1',
      locations: ['Denizevleri', 'Çamlıyazı'],
      status: 'İşlemde',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 gün önce
      notes: 'Deniz manzaralı, güvenli site tercih edilir.',
    },
    {
      id: '3',
      clientName: 'Mehmet Kaya',
      clientPhone: '0555 456 78 90',
      propertyType: 'Satılık',
      maxBudget: 5000000,
      minSqMeters: 120,
      maxSqMeters: 180,
      roomCount: '3+1',
      locations: ['Büyükkolpınar', 'Küçükkolpınar'],
      status: 'Sonuçlandı',
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 gün önce
      notes: 'Bahçeli müstakil ev tercih edilir.',
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

  const renderRequestCard = (request) => {
    const isExpanded = expandedRequest === request.id;
    const statusColor = getStatusColor(request.status);

    return (
      <Animated.View
        key={request.id}
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
              <View style={styles.agentContact}>
                <Text style={styles.contactText}>📞 {request.clientPhone}</Text>
                <Text style={styles.contactText}>📍 {request.locations.join(', ')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.requestActions}>
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
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📏 Metrekare:</Text>
            <Text style={styles.detailValue}>{request.minSqMeters} - {request.maxSqMeters} m²</Text>
          </View>
          {request.roomCount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🛏️ Oda:</Text>
              <Text style={styles.detailValue}>{request.roomCount}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Tercih:</Text>
            <Text style={styles.detailValue}>{request.locations.join(', ')}</Text>
          </View>
          {request.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📝 Not:</Text>
              <Text style={styles.detailValue}>{request.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.matchingSection}>
          <Text style={styles.matchCount}>
            🏠 3 Eşleşen Portföyünüz Bulundu
          </Text>
          <TouchableOpacity style={styles.viewMatchesButton}>
            <Text style={styles.viewMatchesText}>
              {isExpanded ? 'Gizle' : 'Portföyleri Gör'}
            </Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <Animated.View style={styles.matchesContainer}>
            <Text style={styles.matchesTitle}>Eşleşen Portföyler</Text>
            <View style={styles.matchesGrid}>
              <View style={styles.matchCard}>
                <Text style={styles.matchCardTitle}>Atakent 2+1</Text>
                <Text style={styles.matchCardPrice}>2.300.000 ₺</Text>
                <Text style={styles.matchCardLocation}>Atakent Mah.</Text>
              </View>
              <View style={styles.matchCard}>
                <Text style={styles.matchCardTitle}>Güzelyalı 2+1</Text>
                <Text style={styles.matchCardPrice}>2.450.000 ₺</Text>
                <Text style={styles.matchCardLocation}>Güzelyalı Mah.</Text>
              </View>
              <View style={styles.matchCard}>
                <Text style={styles.matchCardTitle}>Cumhuriyet 2+1</Text>
                <Text style={styles.matchCardPrice}>2.100.000 ₺</Text>
                <Text style={styles.matchCardLocation}>Cumhuriyet Mah.</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Talep Detayları</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>

          {selectedRequest && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Müşteri Adı</Text>
                  <Text style={styles.detailItemValue}>{selectedRequest.clientName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Telefon</Text>
                  <Text style={styles.detailItemValue}>{selectedRequest.clientPhone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>İşlem Türü</Text>
                  <Text style={styles.detailItemValue}>{selectedRequest.propertyType}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Bütçe (max)</Text>
                  <Text style={styles.detailItemValue}>{formatPrice(selectedRequest.maxBudget)} ₺</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Metrekare</Text>
                  <Text style={styles.detailItemValue}>{selectedRequest.minSqMeters} - {selectedRequest.maxSqMeters} m²</Text>
                </View>
                {selectedRequest.roomCount && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Oda Sayısı</Text>
                    <Text style={styles.detailItemValue}>{selectedRequest.roomCount}</Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Tercih Edilen Mahalleler</Text>
                  <Text style={styles.detailItemValue}>{selectedRequest.locations.join(', ')}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Oluşturulma Tarihi</Text>
                  <Text style={styles.detailItemValue}>{formatDate(selectedRequest.createdAt)}</Text>
                </View>
                {selectedRequest.notes && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Notlar</Text>
                    <Text style={styles.detailItemValue}>{selectedRequest.notes}</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Taleplerim</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Müşteri Taleplerim</Text>
          <Text style={styles.sectionDescription}>
            Müşterilerinizin talepleri ve eşleşen portföyleriniz
          </Text>
        </View>

        <View style={styles.requestsContainer}>
          {requests.map(request => renderRequestCard(request))}
        </View>

        {requests.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Henüz Talep Yok</Text>
            <Text style={styles.emptyDescription}>
              Müşteri talepleri burada görünecek
            </Text>
          </View>
        )}
      </ScrollView>

      {renderDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  requestsContainer: {
    gap: theme.spacing.lg,
  },
  requestCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  requestHeader: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  agentPicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  agentIcon: {
    fontSize: 24,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  agentContact: {
    gap: 2,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  propertyType: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statusButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    padding: theme.spacing.sm,
  },
  detailsButtonText: {
    fontSize: 18,
  },
  expandButton: {
    padding: theme.spacing.sm,
  },
  expandIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  requestDetails: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    textAlign: 'right',
    flex: 1,
  },
  matchingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  matchCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  viewMatchesButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  viewMatchesText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  matchesContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  matchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  matchesGrid: {
    gap: theme.spacing.md,
  },
  matchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  matchCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  matchCardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  matchCardLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    maxHeight: height * 0.8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalCloseButton: {
    padding: theme.spacing.sm,
  },
  modalCloseText: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  detailGrid: {
    gap: theme.spacing.lg,
  },
  detailItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: theme.spacing.md,
  },
  detailItemLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  detailItemValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default RequestList;
