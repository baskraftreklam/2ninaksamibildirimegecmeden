import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import trialManager from '../utils/trialManager';
import { theme } from '../theme/theme';

const SubscriptionGuard = ({ children, showTrialExpired = true }) => {
  const navigation = useNavigation();
  const [trialStatus, setTrialStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await trialManager.getTrialStatus();
      setTrialStatus(status);

      // Deneme sürümü süresi dolmuş mu kontrol et
      if (status.hasTrial && !status.isActive && showTrialExpired) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Abonelik durumu kontrol edilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    setShowModal(false);
    navigation.navigate('Subscription');
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // Yükleniyor
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Kontrol ediliyor...</Text>
      </View>
    );
  }

  // Deneme sürümü aktif veya abonelik varsa içeriği göster
  if (trialStatus?.isActive || trialStatus?.hasSubscription) {
    return children;
  }

  // Deneme sürümü süresi dolmuşsa modal göster
  if (showModal && trialStatus?.hasTrial && !trialStatus?.isActive) {
    return (
      <>
        {children}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Deneme Sürümü Sona Erdi</Text>
                <Text style={styles.modalSubtitle}>
                  Tüm özelliklere erişmek için abonelik paketlerini inceleyin
                </Text>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  • Sınırsız portföy ekleme{'\n'}
                  • Gelişmiş eşleştirme algoritması{'\n'}
                  • Öncelikli destek{'\n'}
                  • Detaylı analitik raporlar{'\n'}
                  • API erişimi
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={handleUpgrade}
                >
                  <Text style={styles.upgradeButtonText}>Paketleri İncele</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>Daha Sonra</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  // Hiç abonelik yoksa normal içeriği göster
  return children;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalBody: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  modalActions: {
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  closeButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SubscriptionGuard;
