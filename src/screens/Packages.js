import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const Packages = () => {
  const navigation = useNavigation();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const packages = [
    {
      id: 'monthly',
      name: 'Aylık',
      price: '199.00₺',
      billing: '/ay',
      features: [
        'Sınırsız Portföy Ekleme',
        'Sınırsız Talep Ekleme',
        'Talep Havuzu Erişimi',
        '7/24 Destek'
      ],
      popular: false,
    },
    {
      id: 'quarterly',
      name: '3 Aylık',
      price: '500.00₺',
      billing: '/3 ay',
      features: [
        'Tüm Aylık Paket Özellikleri',
        'İstatistik ve Raporlama',
        'Öne Çıkan İlan Hakkı',
        'WhatsApp Entegrasyonu'
      ],
      popular: true,
    },
    {
      id: 'semiannual',
      name: '6 Aylık',
      price: '990.00₺',
      billing: '/6 ay',
      features: [
        'Tüm 3 Aylık Paket Özellikleri',
        'Özel Danışman Desteği',
        'Gelişmiş Pazarlama Araçları',
        'Web Sitesi Entegrasyonu'
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yıllık Pro',
      price: '1599.00₺',
      billing: '/yıl',
      features: [
        'Tüm 6 Aylık Paket Özellikleri',
        'Eğitim ve Webinarlar',
        'Öncelikli Destek',
        'Özel Raporlama'
      ],
      popular: false,
    }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      navigation.navigate('Payment', { package: selectedPackage });
    }
  };

  const renderPackageCard = (pkg, index) => {
    const isSelected = selectedPackage?.id === pkg.id;
    const isPopular = pkg.popular;

    return (
      <Animated.View
        key={pkg.id}
        style={[
          styles.packageCard,
          isSelected && styles.packageCardSelected,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }
        ]}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>En Popüler</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.packageContent}
          onPress={() => handlePackageSelect(pkg)}
          activeOpacity={0.8}
        >
          <View style={styles.packageHeader}>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packagePrice}>{pkg.price}</Text>
            <Text style={styles.packageBilling}>{pkg.billing}</Text>
          </View>

          <View style={styles.featuresContainer}>
            {pkg.features.map((feature, featureIndex) => (
              <View key={featureIndex} style={styles.featureItem}>
                <View style={styles.checkIcon}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.selectionIndicator}>
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>Seçildi</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paketler</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonelik Paketleri</Text>
          <Text style={styles.sectionDescription}>
            İhtiyaçlarınıza en uygun paketi seçin ve hemen başlayın.
          </Text>
        </View>

        <View style={styles.packagesContainer}>
          {packages.map((pkg, index) => renderPackageCard(pkg, index))}
        </View>

        {selectedPackage && (
          <Animated.View 
            style={[
              styles.continueSection,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.selectedPackageInfo}>
              <Text style={styles.selectedPackageText}>
                Seçilen Paket: <Text style={styles.selectedPackageName}>{selectedPackage.name}</Text>
              </Text>
              <Text style={styles.selectedPackagePrice}>{selectedPackage.price}</Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>
                Devam Et - {selectedPackage.price}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Paket Özellikleri</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              • Tüm paketler 30 gün para iade garantisi ile gelir
            </Text>
            <Text style={styles.infoText}>
              • İstediğiniz zaman paket değiştirebilirsiniz
            </Text>
            <Text style={styles.infoText}>
              • 7/24 teknik destek hizmeti
            </Text>
            <Text style={styles.infoText}>
              • Güvenli ödeme sistemi
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
  packagesContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  packageCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: theme.colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomLeftRadius: theme.borderRadius.md,
  },
  popularText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  packageContent: {
    padding: theme.spacing.lg,
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  packageName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  packageBilling: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  featuresContainer: {
    marginBottom: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  checkText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  selectionIndicator: {
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  selectedText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  continueSection: {
    marginBottom: theme.spacing.xl,
  },
  selectedPackageInfo: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedPackageText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  selectedPackageName: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  selectedPackagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  continueButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
});

export default Packages;
