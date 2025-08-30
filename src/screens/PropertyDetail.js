import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Alert,
  Animated,
  FlatList
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import { makePhoneCall, sendWhatsAppMessage, sendEmail, openSocialMedia } from '../utils/contactUtils';
import DisplayMap from '../components/DisplayMap';

const { width, height } = Dimensions.get('window');

const PropertyDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { portfolio } = route.params;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

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

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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
              <Text style={styles.arrowIcon}>
                <Text>←</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrowButton, styles.arrowButtonRight]}
              onPress={() => setActiveImageIndex(prev => 
                prev < images.length - 1 ? prev + 1 : 0
              )}
            >
              <Text style={styles.arrowIcon}>
                <Text>→</Text>
              </Text>
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
      <Text style={styles.sectionTitle}>
        <Text>Özellikler</Text>
      </Text>
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>
              <Text>🏠</Text>
            </Text>
            <Text style={styles.detailLabelText}>
              <Text> Metrekare</Text>
            </Text>
          </View>
          <Text style={styles.detailValue}>
            <Text>{portfolio.squareMeters} m²</Text>
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>
              <Text>🛏️</Text>
            </Text>
            <Text style={styles.detailLabelText}>
              <Text> Oda Sayısı</Text>
            </Text>
          </View>
          <Text style={styles.detailValue}>
            <Text>{portfolio.roomCount || 'Belirtilmemiş'}</Text>
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>
              <Text>🏢</Text>
            </Text>
            <Text style={styles.detailLabelText}>
              <Text> Bina Yaşı</Text>
            </Text>
          </View>
          <Text style={styles.detailValue}>
            <Text>{portfolio.buildingAge || 'Belirtilmemiş'}</Text>
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>
              <Text>🏗️</Text>
            </Text>
            <Text style={styles.detailLabelText}>
              <Text> Kat</Text>
            </Text>
          </View>
          <Text style={styles.detailValue}>
            <Text>{portfolio.floor || 'Belirtilmemiş'}</Text>
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>
              <Text>🚗</Text>
            </Text>
            <Text style={styles.detailLabelText}>
              <Text> Otopark</Text>
            </Text>
          </View>
          <View style={styles.detailValue}>
            {portfolio.parking ? (
              <Text style={styles.checkIcon}>
                <Text>✅</Text>
              </Text>
            ) : (
              <Text style={styles.crossIcon}>
                <Text>❌</Text>
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailLabel}>
            <Text style={styles.detailIcon}>
              <Text>📍</Text>
            </Text>
            <Text style={styles.detailLabelText}>
              <Text> Konum</Text>
            </Text>
          </View>
          <Text style={styles.detailValue}>
            <Text>{portfolio.neighborhood}, {portfolio.district}</Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAgentCard = () => (
    <View style={styles.agentCard}>
      <Text style={styles.agentCardTitle}>
        <Text>Portföy Danışmanı</Text>
      </Text>
      
      <Image
        source={{ 
          uri: 'https://ui-avatars.com/api/?name=Danışman&background=ff4d4f&color=fff&size=80'
        }}
        style={styles.agentAvatar}
      />
      
      <Text style={styles.agentName}>
        <Text>Ahmet Yılmaz</Text>
      </Text>
      <Text style={styles.agentOffice}>
        <Text>Talepify Emlak</Text>
      </Text>
      
      <View style={styles.agentSocialIcons}>
        <TouchableOpacity 
          style={styles.socialIcon}
          onPress={() => openSocialMedia(portfolio?.ownerInstagram || 'https://instagram.com/talepify', 'Instagram')}
        >
          <Text style={styles.socialIconText}>
            <Text>📷</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.socialIcon}
          onPress={() => openSocialMedia(portfolio?.ownerFacebook || 'https://facebook.com/talepify', 'Facebook')}
        >
          <Text style={styles.socialIconText}>
            <Text>📘</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.socialIcon}
          onPress={() => openSocialMedia(portfolio?.ownerYoutube || 'https://youtube.com/talepify', 'YouTube')}
        >
          <Text style={styles.socialIconText}>
            <Text>📺</Text>
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.agentContactButtons}>
        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
          <Text style={styles.whatsappIcon}>
            <Text>💬</Text>
          </Text>
          <Text style={styles.whatsappButtonText}>
            <Text>WhatsApp</Text>
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callIcon}>
            <Text>📞</Text>
          </Text>
          <Text style={styles.callButtonText}>
            <Text>Ara</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
          <Text style={styles.emailIcon}>
            <Text>📧</Text>
          </Text>
          <Text style={styles.emailButtonText}>
            <Text>E-posta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>
                <Text>{portfolio.title}</Text>
              </Text>
              <View style={styles.addressContainer}>
                <Text style={styles.addressIcon}>
                  <Text>📍</Text>
                </Text>
                <Text style={styles.address}>
                  <Text>{portfolio.neighborhood}, {portfolio.district}, {portfolio.city}</Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <Text style={styles.price}>
                <Text>{formatPrice(portfolio.price)}</Text>
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  <Text>{portfolio.listingStatus}</Text>
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
            <Text style={styles.sectionTitle}>
              <Text>Açıklama</Text>
            </Text>
            <Text style={styles.description}>
              <Text>{portfolio.description || 'Ulaşımı rahat, bakımlı ve avantajlı konumda. Detaylı bilgi için lütfen iletişime geçin.'}</Text>
            </Text>
          </View>

          {/* Map Section */}
          <View style={styles.mapSection}>
            <Text style={styles.sectionTitle}>
              <Text>Konum</Text>
            </Text>
            <View style={styles.mapContainer}>
              <DisplayMap position={location} style={styles.map} />
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
    backgroundColor: '#07141e',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 28,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    color: '#ccc',
    marginLeft: 8,
  },
  addressIcon: {
    fontSize: 16,
    color: '#ff4d4f',
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff4d4f',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imageGalleryContainer: {
    marginBottom: 24,
  },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 6,
  },
  arrowButtonLeft: {
    left: 12,
  },
  arrowButtonRight: {
    right: 12,
  },
  thumbnailStrip: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    opacity: 0.6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    opacity: 1,
    borderColor: '#ff4d4f',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsGrid: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  checkIcon: {
    fontSize: 16,
    color: '#4ade80',
  },
  crossIcon: {
    fontSize: 16,
    color: '#f87171',
  },
  detailLabelText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
  mapSection: {
    marginBottom: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  map: {
    flex: 1,
  },
  agentCard: {
    backgroundColor: '#0f1a23',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  agentCardTitle: {
    color: '#ff4d4f',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    textAlign: 'center',
  },
  agentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#ff4d4f',
  },
  agentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  agentOffice: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 16,
  },
  agentSocialIcons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  socialIcon: {
    padding: 8,
  },
  socialIconText: {
    fontSize: 24,
    color: '#666',
  },
  agentContactButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  whatsappButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  whatsappIcon: {
    fontSize: 20,
    color: '#fff',
  },
  callIcon: {
    fontSize: 20,
    color: '#ff4d4f',
  },
  callButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff4d4f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  callButtonText: {
    color: '#ff4d4f',
    fontSize: 14,
    fontWeight: '600',
  },
  emailButton: {
    flex: 1,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emailIcon: {
    fontSize: 20,
    color: '#fff',
  },
});

export default PropertyDetail;
