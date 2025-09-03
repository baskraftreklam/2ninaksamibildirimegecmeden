import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/theme';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigation = useNavigation();
  const { signOut, userProfile } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // Gerçek kullanıcı verileri - AuthContext'ten geliyor
  const [currentUser, setCurrentUser] = useState(null);

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

  // Her profil sayfasına girişte verileri yenile
  useFocusEffect(
    React.useCallback(() => {
      // AuthContext'ten kullanıcı verilerini al
      if (userProfile) {
        setCurrentUser({
          id: userProfile.uid,
          name: userProfile.displayName || 'Kullanıcı',
          email: userProfile.phoneNumber || '',
          phone: userProfile.phoneNumber || '',
          officeName: userProfile.officeName || '',
          city: userProfile.city || '',
          profilePicture: userProfile.profilePicture || null,
          socialInstagram: '',
          socialFacebook: '',
          socialYoutube: '',
          createdAt: userProfile.createdAt || new Date(),
          subscription: {
            plan: 'Deneme Sürümü',
            status: 'active',
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün
        }
        });
      } else {
        // userProfile yoksa varsayılan değerlerle set et
        setCurrentUser({
          id: 'guest',
          name: 'Misafir Kullanıcı',
          email: '',
          phone: '',
          officeName: '',
          city: '',
          profilePicture: null,
          socialInstagram: '',
          socialFacebook: '',
          socialYoutube: '',
                    createdAt: new Date().toISOString(),
          subscription: {
            plan: 'Deneme Sürümü',
            status: 'active',
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün
        }
        });
      }
    }, [userProfile])
  );

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

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesaptan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Çıkış sonrası Login sayfasına yönlendir
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Çıkış yapılırken hata:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
            }
          },
        },
      ]
    );
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
    navigation.navigate('Ana Sayfa', { screen: 'PropertyDetail', params: { portfolio } });
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
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${theme.colors.primary.replace('#', '')}&color=fff&size=200`;
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
          <Image source={require('../assets/images/icons/photo.png')} style={styles.editImageIcon} />
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
            {Math.floor((new Date() - new Date(currentUser.createdAt)) / (1000 * 60 * 60 * 24))}
          </Text>
          <Text style={styles.statLabel}>Gün</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderPortfolioCard = ({ item: portfolio }) => (
    <View style={styles.portfolioCardContainer}>
      <View style={styles.portfolioCardHeader}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            portfolio.isPublished ? styles.actionButtonVisible : styles.actionButtonHidden
          ]}
          onPress={() => handleToggleVisibility(portfolio.id)}
        >
          <View style={[
            styles.statusDot,
            portfolio.isPublished ? styles.statusDotPublished : styles.statusDotHidden
          ]} />
          <Text style={[
            styles.actionButtonText,
            portfolio.isPublished ? styles.actionButtonTextVisible : styles.actionButtonTextHidden
          ]}>
            {portfolio.isPublished ? 'Yayında' : 'Gizli'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ListingCard
        listing={portfolio}
        onPress={() => handlePortfolioPress(portfolio)}
        onEdit={() => navigation.navigate('AddPortfolio', { portfolio, isEditing: true })}
        onDelete={() => handleDeletePortfolio(portfolio.id)}
        isEditable={true}
      />
    </View>
  );

  const renderPortfolios = () => (
    <View style={styles.section}>
      <View style={styles.portfoliosHeader}>
        <Text style={styles.sectionTitle}>Portföylerim ({userPortfolios.length})</Text>
        <TouchableOpacity
          style={styles.addPortfolioButton}
          onPress={() => navigation.navigate('MyPortfolios')}
        >
          <Text style={styles.addPortfolioIcon}>👁️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.portfoliosSubtitle}>
        Portföylerinizi yönetmek için tıklayın
      </Text>
    </View>
  );

  const renderSubscriptionSection = () => (
    <View style={styles.section}>
      <View style={styles.subscriptionHeader}>
        <Text style={styles.sectionTitle}>Abonelik Durumu</Text>
        <TouchableOpacity
          style={styles.subscriptionButton}
          onPress={handleSubscriptionPress}
        >
          <Text style={styles.subscriptionButtonText}>📊</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionPlan}>{currentUser.subscription.plan}</Text>
          <Text style={styles.subscriptionStatus}>
            Durum: {currentUser.subscription.status === 'active' ? 'Aktif' : 'Pasif'}
          </Text>
          <Text style={styles.subscriptionExpiry}>
            Bitiş: {formatDate(currentUser.subscription.endDate)}
          </Text>
        </View>
        
        <View style={styles.subscriptionActions}>
          <TouchableOpacity
            style={styles.subscriptionActionButton}
            onPress={() => navigation.navigate('SubscriptionManagement')}
          >
            <Text style={styles.subscriptionActionText}>⚙️ Yönet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderReferralSection = () => (
    <View style={styles.section}>
      <View style={styles.referralHeader}>
        <Text style={styles.sectionTitle}>Referans Sistemi</Text>
        <TouchableOpacity
          style={styles.referralButton}
          onPress={() => navigation.navigate('ReferralSystem')}
        >
          <Text style={styles.referralButtonText}>📈</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.referralCard}>
        <View style={styles.referralInfo}>
          <Text style={styles.referralTitle}>Referans Kodunuz</Text>
          {userProfile?.referralCode ? (
            <View style={styles.referralCodeContainer}>
              <Text style={styles.referralCode}>{userProfile.referralCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  // Referans kodu kopyalama işlemi
                  Alert.alert('Kopyalandı', 'Referans kodu panoya kopyalandı!');
                }}
              >
                <Text style={styles.copyButtonText}>📋</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noReferralCode}>Henüz referans kodunuz yok</Text>
          )}
          
          <Text style={styles.referralDescription}>
            Referans kodunuzu paylaşarak arkadaşlarınızı davet edin. Her abonelik satın alımında 30 gün ek süre kazanın!
          </Text>
        </View>
      </View>
    </View>
  );

  // Loading durumu
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Arka Plan */}
      <View style={styles.backgroundContainer}>
        <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Sol taraf boş bırakıldı */}
        </View>
        
        <Text style={styles.headerTitle}>Profil</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Image source={require('../assets/images/icons/ayar.png')} style={styles.headerButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={require('../assets/images/icons/menu.png')} style={styles.headerButtonIcon} />
          </TouchableOpacity>
                      <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('NotificationTest')}
            >
            <Text style={styles.testButtonText}>🧪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderSubscriptionSection()}
        {renderReferralSection()}
        {renderPortfolios()}
        
        {/* Çıkış Yapma Butonu */}
        <View style={styles.signOutSection}>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>🚪 Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Arka Plan
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  
  headerButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: theme.colors.white,
  },
  
  testButtonText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
  },
  
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    textAlign: 'center',
    flex: 1,
  },
  
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
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
    borderColor: theme.colors.white,
  },
  
  editImageIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  
  profileName: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  
  profileOffice: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textWhite + 'CC',
    marginBottom: theme.spacing.lg,
  },
  
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
  },
  
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  
  section: {
    marginBottom: 30,
  },
  
  sectionTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
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
    ...theme.shadows.medium,
  },
  
  addPortfolioIcon: {
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
  
  portfolioCardContainer: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: theme.spacing.md,
  },
  
  actionButtonVisible: {
    backgroundColor: theme.colors.success + '1A',
  },
  
  actionButtonHidden: {
    backgroundColor: theme.colors.error + '1A',
    minWidth: 60,
    paddingHorizontal: theme.spacing.sm,
  },
  
  actionButtonText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  
  actionButtonTextVisible: {
    opacity: 1,
  },
  
  actionButtonTextHidden: {
    opacity: 0.9,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  
  statusDotPublished: {
    backgroundColor: theme.colors.success,
  },
  
  statusDotHidden: {
    backgroundColor: theme.colors.error,
  },
  
  emptyPortfolios: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 30,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  
  emptyTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  
  emptyDescription: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  addFirstPortfolioButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.medium,
  },
  
  addFirstPortfolioText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  portfoliosSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    opacity: 0.8,
  },
  
  portfolioRow: {
    justifyContent: 'space-between',
  },
  
  signOutSection: {
    marginTop: 30,
    marginBottom: 50,
    paddingHorizontal: theme.spacing.lg,
  },
  
  signOutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
    ...theme.shadows.medium,
  },
  
  signOutButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
    textAlign: 'center',
  },

  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  subscriptionButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },

  subscriptionButtonText: {
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },

  subscriptionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },

  subscriptionInfo: {
    marginBottom: theme.spacing.md,
  },

  subscriptionPlan: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },

  subscriptionStatus: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  subscriptionExpiry: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },

  subscriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  subscriptionActionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.medium,
  },

  subscriptionActionText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },

  // Referans Sistemi Stilleri
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  referralButton: {
    backgroundColor: theme.colors.success,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },

  referralButtonText: {
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },

  referralCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },

  referralInfo: {
    marginBottom: theme.spacing.md,
  },

  referralTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },

  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '0A',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success + '30',
  },

  referralCode: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.success,
    flex: 1,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },

  copyButton: {
    backgroundColor: theme.colors.success,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },

  copyButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },

  noReferralCode: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },

  referralDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default Profile;
