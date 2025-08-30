import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import ListingCard from '../components/ListingCard';

const { width, height } = Dimensions.get('window');

const Profile = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Mock user data - gerçek uygulamada AuthContext'ten gelecek
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 45 67',
    officeName: 'Yılmaz Emlak',
    city: 'Samsun',
    profilePicture: null,
    socialInstagram: 'https://instagram.com/ahmetyilmaz',
    socialFacebook: 'https://facebook.com/ahmetyilmaz',
    socialYoutube: 'https://youtube.com/@ahmetyilmaz',
    createdAt: new Date('2023-01-15'),
    subscription: {
      plan: 'Premium',
      status: 'active',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  });

  // Mock user portfolios
  const [userPortfolios, setUserPortfolios] = useState([
    {
      id: '1',
      title: 'Atakum Denizevleri Satılık Daire',
      city: 'Samsun',
      district: 'Atakum',
      neighborhood: 'Denizevleri',
      price: 2500000,
      listingStatus: 'Satılık',
      propertyType: 'Daire',
      squareMeters: 120,
      roomCount: '3+1',
      buildingAge: 5,
      floor: 3,
      parking: true,
      isPublished: true,
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop']
    },
    {
      id: '2',
      title: 'İlkadım Merkez Kiralık Daire',
      city: 'Samsun',
      district: 'İlkadım',
      neighborhood: 'Merkez',
      price: 8500,
      listingStatus: 'Kiralık',
      propertyType: 'Daire',
      squareMeters: 85,
      roomCount: '2+1',
      buildingAge: 8,
      floor: 2,
      parking: false,
      isPublished: false,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop']
    }
  ]);

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

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user: currentUser });
  };

  const handleSubscriptionPress = () => {
    navigation.navigate('Subscription');
  };

  const handleSocialPress = (platform, url) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Hata', 'Link açılamadı');
      });
    }
  };

  const handlePortfolioPress = (portfolio) => {
    navigation.navigate('PropertyDetail', { portfolio });
  };

  const handleToggleVisibility = (portfolioId) => {
    setUserPortfolios(prev => 
      prev.map(p => 
        p.id === portfolioId 
          ? { ...p, isPublished: !p.isPublished }
          : p
      )
    );
  };

  const handleDeletePortfolio = (portfolioId) => {
    Alert.alert(
      'Portföy Sil',
      'Bu portföyü silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setUserPortfolios(prev => prev.filter(p => p.id !== portfolioId));
            Alert.alert('Başarılı', 'Portföy silindi');
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff0000&color=fff&size=200`;
  };

  const renderProfileHeader = () => (
    <Animated.View
      style={[
        styles.profileHeader,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={{ 
            uri: currentUser.profilePicture || getAvatarUrl(currentUser.name)
          }}
          style={styles.profileImage}
          defaultSource={{ uri: getAvatarUrl(currentUser.name) }}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Text style={styles.editImageIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.profileName}>{currentUser.name}</Text>
      <Text style={styles.profileOffice}>{currentUser.officeName}</Text>

      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPortfolios.length}</Text>
          <Text style={styles.statLabel}>Portföy</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {userPortfolios.filter(p => p.isPublished).length}
          </Text>
          <Text style={styles.statLabel}>Yayında</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.floor((new Date() - currentUser.createdAt) / (1000 * 60 * 60 * 24))}
          </Text>
          <Text style={styles.statLabel}>Gün</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderContactInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
      
      <View style={styles.contactCard}>
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📍</Text>
          <Text style={styles.contactText}>{currentUser.city}</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactText}>{currentUser.phone}</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>✉️</Text>
          <Text style={styles.contactText}>{currentUser.email}</Text>
        </View>
        
        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>🏢</Text>
          <Text style={styles.contactText}>{currentUser.officeName}</Text>
        </View>
      </View>
    </View>
  );

  const renderSocialMedia = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sosyal Medya</Text>
      
      <View style={styles.socialCard}>
        {currentUser.socialInstagram && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialPress('instagram', currentUser.socialInstagram)}
          >
            <Text style={styles.socialIcon}>📷</Text>
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>
        )}
        
        {currentUser.socialFacebook && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialPress('facebook', currentUser.socialFacebook)}
          >
            <Text style={styles.socialIcon}>📘</Text>
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        )}
        
        {currentUser.socialYoutube && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialPress('youtube', currentUser.socialYoutube)}
          >
            <Text style={styles.socialIcon}>📺</Text>
            <Text style={styles.socialText}>YouTube</Text>
          </TouchableOpacity>
        )}
        
        {!currentUser.socialInstagram && !currentUser.socialFacebook && !currentUser.socialYoutube && (
          <Text style={styles.noSocialText}>Henüz sosyal medya hesabı eklenmemiş</Text>
        )}
      </View>
    </View>
  );

  const renderPortfolios = () => (
    <View style={styles.section}>
      <View style={styles.portfoliosHeader}>
        <Text style={styles.sectionTitle}>Portföylerim ({userPortfolios.length})</Text>
        <TouchableOpacity
          style={styles.addPortfolioButton}
          onPress={() => navigation.navigate('AddPortfolio')}
        >
          <Text style={styles.addPortfolioIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {userPortfolios.length > 0 ? (
        <View style={styles.portfoliosContainer}>
          {userPortfolios.map((portfolio) => (
            <View key={portfolio.id} style={styles.portfolioItem}>
              <View style={styles.portfolioHeader}>
                <View style={[
                  styles.statusBadge,
                  portfolio.isPublished ? styles.statusPublished : styles.statusHidden
                ]}>
                  <Text style={styles.statusIcon}>
                    {portfolio.isPublished ? '👁️' : '🙈'}
                  </Text>
                  <Text style={styles.statusText}>
                    {portfolio.isPublished ? 'Yayında' : 'Gizli'}
                  </Text>
                </View>
                
                <View style={styles.portfolioActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleToggleVisibility(portfolio.id)}
                  >
                    <Text style={styles.actionButtonText}>
                      {portfolio.isPublished ? 'Gizle' : 'Yayınla'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePortfolio(portfolio.id)}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                      Sil
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <ListingCard
                item={portfolio}
                onPress={() => handlePortfolioPress(portfolio)}
                onFavorite={() => {}}
                isFavorite={false}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyPortfolios}>
          <Text style={styles.emptyIcon}>🏠</Text>
          <Text style={styles.emptyTitle}>Henüz Portföy Yok</Text>
          <Text style={styles.emptyDescription}>
            İlk portföyünüzü ekleyerek başlayın
          </Text>
          <TouchableOpacity
            style={styles.addFirstPortfolioButton}
            onPress={() => navigation.navigate('AddPortfolio')}
          >
            <Text style={styles.addFirstPortfolioText}>Portföy Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderMenuItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hesap Yönetimi</Text>
      
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemIcon}>✏️</Text>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Profil Bilgileri</Text>
              <Text style={styles.menuItemSubtitle}>Kişisel bilgileri düzenle</Text>
            </View>
            <Text style={styles.menuItemArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSubscriptionPress}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemIcon}>💳</Text>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Abonelik</Text>
              <Text style={styles.menuItemSubtitle}>Paket durumu ve yönetimi</Text>
            </View>
            <Text style={styles.menuItemArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemIcon}>🔔</Text>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Bildirimler</Text>
              <Text style={styles.menuItemSubtitle}>Bildirim ayarları</Text>
            </View>
            <Text style={styles.menuItemArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemIcon}>🔒</Text>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Şifre Değiştir</Text>
              <Text style={styles.menuItemSubtitle}>Güvenlik ayarları</Text>
            </View>
            <Text style={styles.menuItemArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAccountInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
      
      <View style={styles.accountCard}>
        <View style={styles.accountItem}>
          <Text style={styles.accountLabel}>Üyelik Tarihi</Text>
          <Text style={styles.accountValue}>{formatDate(currentUser.createdAt)}</Text>
        </View>
        
        <View style={styles.accountItem}>
          <Text style={styles.accountLabel}>Abonelik</Text>
          <Text style={styles.accountValue}>{currentUser.subscription.plan}</Text>
        </View>
        
        <View style={styles.accountItem}>
          <Text style={styles.accountLabel}>Durum</Text>
          <Text style={[
            styles.accountValue,
            styles.accountStatus,
            currentUser.subscription.status === 'active' ? styles.statusActive : styles.statusInactive
          ]}>
            {currentUser.subscription.status === 'active' ? 'Aktif' : 'Pasif'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderContactInfo()}
        {renderSocialMedia()}
        {renderPortfolios()}
        {renderMenuItems()}
        {renderAccountInfo()}
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  editImageIcon: {
    fontSize: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileOffice: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contactCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
    width: 24,
  },
  contactText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  socialCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
    width: 24,
  },
  socialText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  noSocialText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  portfoliosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addPortfolioButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPortfolioIcon: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: '700',
  },
  portfoliosContainer: {
    gap: theme.spacing.lg,
  },
  portfolioItem: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusPublished: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusHidden: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  portfolioActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  actionButtonText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  deleteButtonText: {
    color: theme.colors.white,
  },
  emptyPortfolios: {
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
    marginBottom: theme.spacing.lg,
  },
  addFirstPortfolioButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  addFirstPortfolioText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  menuItemArrow: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  accountCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  accountLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  accountValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  accountStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
  },
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
});

export default Profile;
