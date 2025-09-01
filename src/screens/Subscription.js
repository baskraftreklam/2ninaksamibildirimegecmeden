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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const Subscription = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Mock subscription data
  const [subscription, setSubscription] = useState({
    plan: 'Premium',
    status: 'active',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 gün önce
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const isActive = subscription.status === 'active';
  const daysRemaining = Math.ceil((subscription.endDate - new Date()) / (1000 * 60 * 60 * 24));

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUpgrade = () => {
    navigation.navigate('Packages');
  };

  const handleExtend = () => {
    navigation.navigate('Payment', { plan: subscription.plan });
  };

  const handleCancel = () => {
    Alert.alert(
      'Abonelik İptali',
      'Aboneliğinizi iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: () => {
            setSubscription(prev => ({ ...prev, status: 'cancelled' }));
            Alert.alert('Başarılı', 'Aboneliğiniz iptal edildi.');
          },
        },
      ]
    );
  };

  const renderStatusIcon = () => (
    <View style={[styles.statusIcon, isActive ? styles.statusIconActive : styles.statusIconExpired]}>
      <Text style={styles.statusIconText}>
        {isActive ? '✓' : '✕'}
      </Text>
    </View>
  );

  const renderSubscriptionCard = () => (
    <Animated.View 
      style={[
        styles.subscriptionCard,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}
    >
      {renderStatusIcon()}
      
      <Text style={styles.planName}>{subscription.plan}</Text>
      
      <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextExpired]}>
        Durum: {isActive ? 'Aktif' : 'Süresi Dolmuş'}
      </Text>

      {isActive ? (
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            Aboneliğinizin sona ermesine{' '}
            <Text style={styles.daysRemaining}>{daysRemaining}</Text> gün kaldı.
          </Text>
          <Text style={styles.endDateText}>
            Son geçerlilik tarihi: {formatDate(subscription.endDate)}
          </Text>
        </View>
      ) : (
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            Aboneliğiniz {formatDate(subscription.endDate)} tarihinde sona erdi.
          </Text>
        </View>
      )}

      <View style={styles.subscriptionActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUpgrade}>
          <Text style={styles.actionButtonText}>
            Paketleri İncele / Yükselt
          </Text>
        </TouchableOpacity>
        
        {isActive && (
          <TouchableOpacity style={[styles.actionButton, styles.extendButton]} onPress={handleExtend}>
            <Text style={[styles.actionButtonText, styles.extendButtonText]}>
              Aboneliği Uzat
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderNoSubscription = () => (
    <Animated.View 
      style={[
        styles.subscriptionCard,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={[styles.statusIcon, styles.statusIconExpired]}>
        <Text style={styles.statusIconText}>✕</Text>
      </View>
      
      <Text style={styles.planName}>Abonelik Bulunamadı</Text>
      
      <Text style={[styles.statusText, styles.statusTextExpired]}>
        Durum: Pasif
      </Text>
      
      <Text style={styles.dateText}>
        Abonelik planı tanımlı değil.
      </Text>

      <View style={styles.subscriptionActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUpgrade}>
          <Text style={styles.actionButtonText}>
            Paketleri İncele / Başlat
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
        <Text style={styles.headerTitle}>Abonelik</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonelik Durumum</Text>
          
          {subscription ? renderSubscriptionCard() : renderNoSubscription()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonelik Detayları</Text>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan:</Text>
              <Text style={styles.detailValue}>{subscription?.plan || 'Tanımlı değil'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Başlangıç:</Text>
              <Text style={styles.detailValue}>
                {subscription?.startDate ? formatDate(subscription.startDate) : 'Tanımlı değil'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bitiş:</Text>
              <Text style={styles.detailValue}>
                {subscription?.endDate ? formatDate(subscription.endDate) : 'Tanımlı değil'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kalan Gün:</Text>
              <Text style={styles.detailValue}>
                {isActive ? `${daysRemaining} gün` : 'Süresi dolmuş'}
              </Text>
            </View>
          </View>
        </View>

        {isActive && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abonelik Yönetimi</Text>
            
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                Aboneliği İptal Et
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  subscriptionCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statusIconActive: {
    backgroundColor: '#10b981',
  },
  statusIconExpired: {
    backgroundColor: '#ef4444',
  },
  statusIconText: {
    fontSize: 32,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,

  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  statusTextActive: {
    color: '#10b981',
  },
  statusTextExpired: {
    color: '#ef4444',
  },
  dateInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  daysRemaining: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  endDateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  subscriptionActions: {
    width: '100%',
    gap: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  extendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  extendButtonText: {
    color: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ef4444',
  },
  detailsCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default Subscription;

