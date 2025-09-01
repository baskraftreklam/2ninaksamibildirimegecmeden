import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Header = ({ title = 'Talepify', showMenu = true, showBack = false, scrollY = 0 }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    toggleMenu();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleNavigate = (screen) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.header}>
      {/* Sol taraf: Logo */}
      <View style={styles.leftSection}>
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Sağ taraf: Bildirim ikonu ve menü */}
      <View style={styles.rightSection}>
        {/* Bildirim ikonu */}
        <TouchableOpacity style={styles.notificationContainer}>
          <Image 
            source={require('../assets/images/notification.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        {/* Menü tuşu */}
        {showMenu && (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={toggleMenu}
          >
            <Image 
              source={require('../assets/images/menu.png')}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View 
            style={[
              styles.sideMenu,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menü</Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Home')}
              >
                <Text style={styles.menuIcon}>🏠</Text>
                <Text style={styles.menuItemText}>Ana Sayfa</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('AddPortfolio')}
              >
                <Text style={styles.menuIcon}>➕</Text>
                <Text style={styles.menuItemText}>Portföy Ekle</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('RequestForm')}
              >
                <Text style={styles.menuIcon}>📄</Text>
                <Text style={styles.menuItemText}>Talep Ekle</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('DemandPool')}
              >
                <Text style={styles.menuIcon}>👥</Text>
                <Text style={styles.menuItemText}>Talep Havuzu</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Calendar')}
              >
                <Text style={styles.menuIcon}>📅</Text>
                <Text style={styles.menuItemText}>Takvim</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Profile')}
              >
                <Text style={styles.menuIcon}>👤</Text>
                <Text style={styles.menuItemText}>Profil</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Settings')}
              >
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuItemText}>Ayarlar</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text style={[styles.menuIcon, styles.logoutIcon]}>🚪</Text>
                <Text style={[styles.menuItemText, styles.logoutText]}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 1, // Daha da azaltıldı
    backgroundColor: 'rgba(15, 26, 35, 0.15)', // Çok hafif saydam
    paddingTop: 8, // Daha da azaltıldı
    // Blur efekti için gölge
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12, // Android için gölge
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 160, // Logo boyutu 235x50px olarak ayarlandı
    height: 40, // Logo boyutu 235x50px olarak ayarlandı
  },
  notificationContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    // Tüm border ve outline'lar kaldırıldı
  },
  notificationIcon: {
    width: 32,
    height: 32,
    // Border yok
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8, // Padding azaltıldı
    borderRadius: 8,
    backgroundColor: '#ff0000',
    borderWidth: 0,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#0f1a23',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 50,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: '#ff4d4f',
    fontWeight: '600',
  },
  logoutIcon: {
    color: '#ff4d4f',
  },
});

export default Header;
