import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Animated,
  FlatList
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import { makePhoneCall, sendWhatsAppMessage, sendEmail, openSocialMedia } from '../utils/contactUtils';
import { theme } from '../theme/theme';

const PropertyDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { portfolio } = route.params;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Portfolio kontrolü - null ise hata göster
  if (!portfolio) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Portföy bilgisi bulunamadı.</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Mock images - React web projesinden alınan görseller
  const images = portfolio?.images || [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop'
  ];

  // Mock location - Samsun koordinatları
  const location = portfolio?.location || {
    latitude: 41.33,
    longitude: 36.25
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M ₺';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K ₺';
    }
    return price + ' ₺';
  };

  const handleWhatsApp = () => {
    const phone = portfolio?.ownerPhone || '905551234567';
    const message = `Merhaba, ${portfolio?.title || 'portföy'} hakkında bilgi almak istiyorum.`;
    sendWhatsAppMessage(phone, message);
  };

  const handleCall = () => {
    const phone = portfolio?.ownerPhone || '05551234567';
    makePhoneCall(phone);
  };

  const handleEmail = () => {
    const email = portfolio?.ownerEmail || 'info@talepify.com';
    const subject = `${portfolio?.title || 'Portföy'} Hakkında Bilgi`;
    const body = `Merhaba,\n\n${portfolio?.title || 'Portföy'} hakkında detaylı bilgi almak istiyorum.\n\nTeşekkürler.`;
    sendEmail(email, subject, body);
  };

  const renderImageGallery = () => (
    <View style={styles.imageGalleryContainer}>
      <View style={styles.mainImageWrapper}>
        <Image
          source={{ uri: images[activeImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        {images.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.arrowButton, styles.arrowButtonLeft]}
              onPress={() => setActiveImageIndex(prev => 
                prev > 0 ? prev - 1 : images.length - 1
              )}
            >
              <Text style={styles.arrowIcon}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrowButton, styles.arrowButtonRight]}
              onPress={() => setActiveImageIndex(prev => 
                prev < images.length - 1 ? prev + 1 : 0
              )}
            >
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {images.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailStrip}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveImageIndex(index)}
            >
              <Image
                source={{ uri: image }}
                style={[
                  styles.thumbnail,
                  activeImageIndex === index && styles.thumbnailActive
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderPropertyDetails = () => (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>Özellikler</Text>
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>🏠</Text>
            <Text style={styles.detailLabelText}> Metrekare</Text>
          </View>
          <Text style={styles.detailValue}>
            {portfolio.squareMeters} m²
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>🛏️</Text>
            <Text style={styles.detailLabelText}> Oda Sayısı</Text>
          </View>
          <Text style={styles.detailValue}>
            {portfolio.roomCount || 'Belirtilmemiş'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>🏢</Text>
            <Text style={styles.detailLabelText}> Bina Yaşı</Text>
          </View>
          <Text style={styles.detailValue}>
            {portfolio.buildingAge || 'Belirtilmemiş'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>🏗️</Text>
            <Text style={styles.detailLabelText}> Kat</Text>
          </View>
          <Text style={styles.detailValue}>
            {portfolio.floor || 'Belirtilmemiş'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>🚗</Text>
            <Text style={styles.detailLabelText}> Otopark</Text>
          </View>
          <View style={styles.detailValue}>
            {portfolio.parking ? (
              <Text style={styles.checkIcon}>✅</Text>
            ) : (
              <Text style={styles.crossIcon}>❌</Text>
            )}
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailLabelText}> Konum</Text>
          </View>
          <Text style={styles.detailValue}>
            {portfolio.neighborhood}, {portfolio.district}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAgentCard = () => (
    <View style={styles.agentCard}>
      <Text style={styles.agentCardTitle}>Portföy Danışmanı</Text>
      
      <Image
        source={{ 
          uri: `https://ui-avatars.com/api/?name=Danışman&background=${theme.colors.primary.replace('#', '')}&color=fff&size=80`
        }}
        style={styles.agentAvatar}
      />
      
      <Text style={styles.agentName}>
        {portfolio?.ownerName || 'Kullanıcı'}
      </Text>
      <Text style={styles.agentOffice}>
        {portfolio?.ownerOffice || 'Emlak Ofisi'}
      </Text>
      
      <View style={styles.agentSocialIcons}>
        <TouchableOpacity 
          style={styles.socialIcon}
          onPress={() => openSocialMedia(portfolio?.ownerInstagram || 'https://instagram.com/talepify', 'Instagram')}
        >
          <Text style={styles.socialIconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.socialIcon}
          onPress={() => openSocialMedia(portfolio?.ownerFacebook || 'https://facebook.com/talepify', 'Facebook')}
        >
          <Text style={styles.socialIconText}>📘</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.socialIcon}
          onPress={() => openSocialMedia(portfolio?.ownerYoutube || 'https://youtube.com/talepify', 'YouTube')}
        >
          <Text style={styles.socialIconText}>📺</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.agentContactButtons}>
        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
          <Text style={styles.whatsappIcon}>💬</Text>
          <Text style={styles.whatsappButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callIcon}>📞</Text>
          <Text style={styles.callButtonText}>Ara</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
          <Text style={styles.emailIcon}>📧</Text>
          <Text style={styles.emailButtonText}>E-posta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonHeaderIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Portföy Detayı</Text>
        <View style={styles.topHeaderSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Property Info Section - Dark Purple Background */}
          <View style={styles.propertyInfoSection}>
            <Text style={styles.propertyTitle}>
              {portfolio.title}
            </Text>
            <View style={styles.addressContainer}>
              <Text style={styles.addressIcon}>📍</Text>
              <Text style={styles.address}>
                {portfolio.neighborhood}, {portfolio.district}, {portfolio.city}
              </Text>
            </View>
            <View style={styles.priceStatusRow}>
              <Text style={styles.price}>
                {formatPrice(portfolio.price)}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {portfolio.listingStatus || 'Satılık'}
                </Text>
              </View>
            </View>
          </View>

          {/* Image Gallery */}
          {renderImageGallery()}

          {/* Property Details */}
          {renderPropertyDetails()}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>
              {portfolio.description || 'Ulaşımı rahat, bakımlı ve avantajlı konumda. Detaylı bilgi için lütfen iletişime geçin.'}
            </Text>
          </View>

                     {/* Map Section - Geçici olarak devre dışı */}
           <View style={styles.mapSection}>
             <Text style={styles.sectionTitle}>Konum</Text>
             <View style={styles.mapContainer}>
               <View style={styles.mapPlaceholder}>
                 <Text style={styles.mapPlaceholderText}>📍 Konum Bilgisi</Text>
                 <Text style={styles.mapPlaceholderSubtext}>
                   Enlem: {location.latitude.toFixed(6)}
                 </Text>
                 <Text style={styles.mapPlaceholderSubtext}>
                   Boylam: {location.longitude.toFixed(6)}
                 </Text>
               </View>
             </View>
           </View>

          {/* Agent Card */}
          {renderAgentCard()}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    lineHeight: 28,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textWhite,
    marginLeft: theme.spacing.sm,
  },
  addressIcon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primary,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadgeText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
  },
  imageGalleryContainer: {
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.medium,
  },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: theme.colors.overlay,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  arrowButtonLeft: {
    left: theme.spacing.md,
  },
  arrowButtonRight: {
    right: theme.spacing.md,
  },
  arrowIcon: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
  },
  thumbnailStrip: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xs,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    opacity: 0.6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    opacity: 1,
    borderColor: theme.colors.primary,
  },
  detailsSection: {
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  detailsGrid: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.md,
    padding: 0,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: theme.fontSizes.xl,
    marginRight: theme.spacing.sm,
  },
  checkIcon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.success,
  },
  crossIcon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.error,
  },
  detailLabelText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.md,
    marginLeft: theme.spacing.sm,
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
  },
  descriptionSection: {
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  description: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    lineHeight: 24,
  },
  mapSection: {
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  mapContainer: {
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  map: {
    flex: 1,
  },
  agentCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
    ...theme.shadows.medium,
  },
  agentCardTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    width: '100%',
    textAlign: 'center',
  },
  agentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  agentName: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  agentOffice: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.md,
  },
  agentSocialIcons: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  socialIcon: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.lg,
  },
  socialIconText: {
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.textSecondary,
  },
  agentContactButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: theme.colors.info,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  whatsappButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    marginLeft: theme.spacing.sm,
  },
  whatsappIcon: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
  },
  callIcon: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.primary,
  },
  callButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  callButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    marginLeft: theme.spacing.sm,
  },
  emailButton: {
    flex: 1,
    backgroundColor: theme.colors.info,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  emailButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    marginLeft: theme.spacing.sm,
  },
  emailIcon: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
  },

  // Error page styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  errorText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    backgroundColor: theme.colors.cardBg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  backButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },

  // Top Header styles
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },

  // Property Info Section styles
  propertyInfoSection: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  propertyTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.md,
    lineHeight: 28,
  },
  priceStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  backButtonHeader: {
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
  backButtonHeaderIcon: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  topHeaderTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textWhite,
  },
  topHeaderSpacer: {
    width: 40,
  },

  // Map placeholder styles
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    padding: theme.spacing.lg,
  },
  mapPlaceholderText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  mapPlaceholderSubtext: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
});

export default PropertyDetail;
