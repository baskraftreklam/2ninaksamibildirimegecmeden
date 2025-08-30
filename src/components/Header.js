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
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

const Header = ({ title = 'Talepify', showMenu = true, showBack = false }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const toggleMenu = () => {
    if (menuVisible) {
      // Close menu
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      // Open menu
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
    // Navigate to login
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
      {/* Logo and Title */}
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>
              <Text>←</Text>
            </Text>
          </TouchableOpacity>
        )}
        
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Menu Button */}
      {showMenu && (
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={toggleMenu}
        >
          <Text style={styles.menuIcon}>
            <Text>☰</Text>
          </Text>
        </TouchableOpacity>
      )}

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
            <TouchableOpacity 
              style={styles.menuHeader}
              onPress={() => handleNavigate('Profile')}
            >
              <View style={styles.profileSection}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>
                    <Text>👤</Text>
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    <Text>Kullanıcı Adı</Text>
                  </Text>
                  <Text style={styles.profileEmail}>
                    <Text>kullanici@email.com</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Home')}
              >
                <Text style={styles.menuIcon}>
                  <Text>🏠</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Ana Sayfa</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('AddPortfolio')}
              >
                <Text style={styles.menuIcon}>
                  <Text>➕</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Portföy Ekle</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('RequestForm')}
              >
                <Text style={styles.menuIcon}>
                  <Text>📄</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Talep Ekle</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('DemandPool')}
              >
                <Text style={styles.menuIcon}>
                  <Text>👥</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Talep Havuzu</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Calendar')}
              >
                <Text style={styles.menuIcon}>
                  <Text>📅</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Takvim</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Profile')}
              >
                <Text style={styles.menuIcon}>
                  <Text>👤</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Profil</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigate('Settings')}
              >
                <Text style={styles.menuIcon}>
                  <Text>⚙️</Text>
                </Text>
                <Text style={styles.menuItemText}>
                  <Text>Ayarlar</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text style={[styles.menuIcon, styles.logoutIcon]}>
                  <Text>🚪</Text>
                </Text>
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  <Text>Çıkış Yap</Text>
                </Text>
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
    paddingVertical: 12,
    backgroundColor: theme.colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 50, // Status bar için
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  menuButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ff0000',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  menuIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  avatarIcon: {
    fontSize: 32,
    color: '#ff0000',
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 77, 79, 0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: '#ccc',
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
    color: '#fff',
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
