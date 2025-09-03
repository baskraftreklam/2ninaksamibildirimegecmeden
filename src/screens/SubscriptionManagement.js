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
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { SUBSCRIPTION_PLANS, getPlanById } from '../utils/subscription';

const { width, height } = Dimensions.get('window');

const SubscriptionManagement = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentPlan, setCurrentPlan] = useState('monthly');
  const [autoRenew, setAutoRenew] = useState(true);
  const [nextBillingDate, setNextBillingDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePlanChange = (newPlanId) => {
    Alert.alert(
      'Plan Değişikliği',
      `${getPlanById(newPlanId).name} planına geçmek istediğinizden emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Değiştir',
          onPress: () => {
            setCurrentPlan(newPlanId);
            Alert.alert('Başarılı', 'Plan başarıyla değiştirildi.');
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Abonelik İptali',
      'Aboneliğinizi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: () => {
            Alert.alert('İptal Edildi', 'Aboneliğiniz iptal edildi. Mevcut dönem sonunda sona erecek.');
          },
        },
      ]
    );
  };

  const handlePaymentMethod = () => {
    navigation.navigate('Payment', { plan: getPlanById(currentPlan).name });
  };

  const renderCurrentPlanCard = () => {
    const plan = getPlanById(currentPlan);
    
    return (
      <Animated.View 
        style={[
          styles.planCard,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }
        ]}
      >
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{plan.price}₺</Text>
          <Text style={styles.planBilling}>{plan.billing}</Text>
        </View>
        
        <View style={styles.planFeatures}>
          <Text style={styles.featuresTitle}>Paket Özellikleri:</Text>
          {plan.features.slice(0, 6).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {plan.features.length > 6 && (
            <Text style={styles.moreFeatures}>+{plan.features.length - 6} özellik daha</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderBillingInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fatura Bilgileri</Text>
      
      <View style={styles.billingCard}>
        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Son Ödeme:</Text>
          <Text style={styles.billingValue}>{formatDate(nextBillingDate)}</Text>
        </View>
        
        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Tutar:</Text>
          <Text style={styles.billingValue}>{getPlanById(currentPlan).price}₺</Text>
        </View>
        
        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Otomatik Yenileme:</Text>
          <Switch
            value={autoRenew}
            onValueChange={setAutoRenew}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
          />
        </View>
        
        <Text style={styles.billingNote}>
          Otomatik yenileme aktifse, aboneliğiniz otomatik olarak uzatılacaktır.
        </Text>
      </View>
    </View>
  );

  const renderAvailablePlans = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mevcut Paketler</Text>
      
      <View style={styles.plansContainer}>
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isUpgrade = plan.price > getPlanById(currentPlan).price;
          
          return (
            <View key={plan.id} style={[
              styles.planOption,
              isCurrent && styles.currentPlanOption
            ]}>
              <View style={styles.planOptionHeader}>
                <Text style={styles.planOptionName}>{plan.name}</Text>
                <Text style={styles.planOptionPrice}>{plan.price}₺</Text>
                <Text style={styles.planOptionBilling}>{plan.billing}</Text>
              </View>
              
              {plan.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>%{plan.discount} İndirim</Text>
                </View>
              )}
              
              <View style={styles.planOptionActions}>
                {isCurrent ? (
                  <View style={styles.currentPlanBadge}>
                    <Text style={styles.currentPlanText}>Mevcut Plan</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.planActionButton,
                      isUpgrade ? styles.upgradeButton : styles.downgradeButton
                    ]}
                    onPress={() => handlePlanChange(plan.id)}
                  >
                    <Text style={styles.planActionText}>
                      {isUpgrade ? 'Yükselt' : 'Değiştir'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handlePaymentMethod}>
          <Text style={styles.actionButtonText}>💳 Ödeme Yöntemi Değiştir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Packages')}>
          <Text style={styles.actionButtonText}>📦 Tüm Paketleri İncele</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelSubscription}>
          <Text style={[styles.actionButtonText, styles.cancelButtonText]}>❌ Aboneliği İptal Et</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Abonelik Yönetimi</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mevcut Planınız</Text>
          {renderCurrentPlanCard()}
        </View>

        {renderBillingInfo()}
        {renderAvailablePlans()}
        {renderActions()}

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️ Bilgilendirme</Text>
            <Text style={styles.infoText}>
              • Plan değişiklikleri bir sonraki fatura döneminde geçerli olur
            </Text>
            <Text style={styles.infoText}>
              • İptal edilen abonelikler mevcut dönem sonunda sona erer
            </Text>
            <Text style={styles.infoText}>
              • Tüm paketlerde aynı özellikler bulunur
            </Text>
            <Text style={styles.infoText}>
              • Uzun vadeli paketlerde ekstra indirim uygulanır
            </Text>
          </View>
        </View>
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
  planCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  planBilling: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  planFeatures: {
    marginBottom: theme.spacing.lg,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  checkmark: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  moreFeatures: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  billingCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  billingLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  billingValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  billingNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  plansContainer: {
    gap: theme.spacing.md,
  },
  planOption: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  currentPlanOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  planOptionHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  planOptionName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  planOptionPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  planOptionBilling: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: '#10b981',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  planOptionActions: {
    alignItems: 'center',
  },
  currentPlanBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  currentPlanText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  planActionButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#10b981',
  },
  downgradeButton: {
    backgroundColor: theme.colors.primary,
  },
  planActionText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.cardBg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ef4444',
  },
  infoCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
});

export default SubscriptionManagement;
