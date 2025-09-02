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
  FlatList,
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
            {Math.floor((new Date() - currentUser.createdAt) / (1000 * 60 * 60 * 24))}
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
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderPortfolios()}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginLeft: 15,
  },
  
  headerButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#FFFFFF', // Beyaz renk
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#130139',
  },
  
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#130139',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  
  editImageIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  
  profileOffice: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#130139',
  },
  
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  
  section: {
    marginBottom: 30,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  
  portfoliosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  addPortfolioButton: {
    backgroundColor: '#130139',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  addPortfolioIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  
  portfolioCardContainer: {
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  

  
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  

  

  
  actionButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: 12,
    transition: 'all 0.3s ease',
  },
  
  actionButtonVisible: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  
  actionButtonHidden: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    minWidth: 60,
    paddingHorizontal: 8,
  },
  

  

  
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
  },
  
  actionButtonTextVisible: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  
  actionButtonTextHidden: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  
  statusDotPublished: {
    backgroundColor: '#10b981',
  },
  
  statusDotHidden: {
    backgroundColor: '#ef4444',
  },
  

  
  emptyPortfolios: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#130139',
    marginBottom: 10,
  },
  
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  addFirstPortfolioButton: {
    backgroundColor: '#130139',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  addFirstPortfolioText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  portfoliosSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  
  portfolioRow: {
    justifyContent: 'space-between',
  },
});

export default Profile;
