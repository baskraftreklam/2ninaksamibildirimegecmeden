import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Image,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

// Türkiye şehirleri
const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

// Sosyal URL yardımcıları
const normalizeHandle = (s = "") => String(s).trim().replace(/^@+/, "").replace(/\/+$/,"");
const toAbsoluteUrl = (urlLike) => {
  const s = String(urlLike || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s)) return `https://${s}`;
  return s;
};

const validateAndNormalizeSocial = (platform, input) => {
  const raw = (input || "").trim();
  if (!raw) return { ok: true, value: "" };

  const allow = {
    instagram: ["instagram.com", "www.instagram.com", "m.instagram.com"],
    facebook:  ["facebook.com", "www.facebook.com", "m.facebook.com"],
    youtube:   ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  };

  // Sadece kullanıcı adı geldiyse otomatik tamamla
  if (!/^https?:\/\//i.test(raw) && !/^www\./i.test(raw) && !raw.includes(".")) {
    const h = normalizeHandle(raw);
    if (!h) return { ok: true, value: "" };
    if (platform === "instagram") return { ok: true, value: `https://instagram.com/${h}` };
    if (platform === "facebook")  return { ok: true, value: `https://facebook.com/${h}` };
    if (platform === "youtube")   return { ok: true, value: `https://youtube.com/@${h}` };
  }

  const abs = toAbsoluteUrl(raw);
  let urlObj;
  try {
    urlObj = new URL(abs);
  } catch {
    return { ok: false, value: raw, error: "Geçersiz URL formatı." };
  }

  const host = urlObj.hostname.toLowerCase();
  const okHost = allow[platform].includes(host);
  if (!okHost) {
    return { ok: false, value: abs, error: `Lütfen sadece ${platform}.com adresi girin.` };
  }

  return { ok: true, value: abs };
};

const validateAllSocials = ({ instagram, facebook, youtube }) => {
  const resI = validateAndNormalizeSocial("instagram", instagram);
  const resF = validateAndNormalizeSocial("facebook",  facebook);
  const resY = validateAndNormalizeSocial("youtube",   youtube);
  const errors = {};
  if (!resI.ok) errors.instagram = resI.error;
  if (!resF.ok) errors.facebook  = resF.error;
  if (!resY.ok) errors.youtube   = resY.error;

  return {
    ok: Object.keys(errors).length === 0,
    values: {
      instagram: resI.value,
      facebook:  resF.value,
      youtube:   resY.value,
    },
    errors
  };
};

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};

  const [fadeAnim] = useState(new Animated.Value(0));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    officeName: user?.officeName || '',
    city: user?.city || '',
    phone: user?.phone || '',
    email: user?.email || '',
    socialInstagram: user?.socialInstagram || '',
    socialFacebook: user?.socialFacebook || '',
    socialYoutube: user?.socialYoutube || '',
  });

  const [profileImagePreview, setProfileImagePreview] = useState(user?.profilePicture || null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePick = () => {
    // Gerçek uygulamada image picker kullanılacak
    Alert.alert(
      'Profil Resmi',
      'Bu özellik yakında eklenecek',
      [{ text: 'Tamam' }]
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
      return false;
    }
    if (!formData.officeName.trim()) {
      Alert.alert('Hata', 'Lütfen ofis adını girin.');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Hata', 'Lütfen şehir seçin.');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin.');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Sosyal linkleri doğrula
    const socialCheck = validateAllSocials({
      instagram: formData.socialInstagram,
      facebook: formData.socialFacebook,
      youtube: formData.socialYoutube,
    });

    if (!socialCheck.ok) {
      const firstErr =
        socialCheck.errors.instagram ||
        socialCheck.errors.facebook ||
        socialCheck.errors.youtube ||
        "Lütfen sosyal bağlantıları kontrol edin.";
      Alert.alert('Hata', firstErr);
      return;
    }

    setIsLoading(true);

    try {
      // Simüle edilmiş güncelleme işlemi
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUser = {
        ...user,
        ...formData,
        socialInstagram: socialCheck.values.instagram,
        socialFacebook: socialCheck.values.facebook,
        socialYoutube: socialCheck.values.youtube,
      };

      console.log('Updated user data:', updatedUser);

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 2000);

    } catch (error) {
      Alert.alert('Hata', 'Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı ve tüm portföylerinizi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi.');
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff0000&color=fff&size=200`;
  };

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.modalTitle}>Başarılı!</Text>
          <Text style={styles.modalMessage}>
            Profil bilgileriniz başarıyla güncellendi.
          </Text>
        </View>
      </View>
    </Modal>
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
        <Text style={styles.headerTitle}>Profil Düzenle</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Profil Resmi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil Resmi</Text>
            
            <View style={styles.profileImageSection}>
              <Image
                source={{ 
                  uri: profileImagePreview || getAvatarUrl(formData.name)
                }}
                style={styles.profileImage}
                defaultSource={{ uri: getAvatarUrl(formData.name) }}
              />
              
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={handleImagePick}
              >
                <Text style={styles.changeImageText}>Resmi Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kişisel Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ad Soyad *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Adınız ve soyadınız"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ofis Adı *</Text>
              <TextInput
                style={styles.input}
                value={formData.officeName}
                onChangeText={(text) => handleInputChange('officeName', text)}
                placeholder="Ofis adınız"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şehir *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    'Şehir Seçin',
                    '',
                    [
                      ...turkishCities.map(city => ({
                        text: city,
                        onPress: () => handleInputChange('city', city)
                      })),
                      { text: 'İptal', style: 'cancel' }
                    ]
                  );
                }}
              >
                <Text style={styles.pickerButtonText}>
                  {formData.city || 'Şehir seçin'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefon *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="+90 555 123 45 67"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-posta *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="ornek@email.com"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Sosyal Medya */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sosyal Medya</Text>
            <Text style={styles.sectionDescription}>
              Sosyal medya hesaplarınızı ekleyin (isteğe bağlı)
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Instagram</Text>
              <TextInput
                style={styles.input}
                value={formData.socialInstagram}
                onChangeText={(text) => handleInputChange('socialInstagram', text)}
                placeholder="instagram.com/kullaniciadi"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Facebook</Text>
              <TextInput
                style={styles.input}
                value={formData.socialFacebook}
                onChangeText={(text) => handleInputChange('socialFacebook', text)}
                placeholder="facebook.com/kullaniciadi"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>YouTube</Text>
              <TextInput
                style={styles.input}
                value={formData.socialYoutube}
                onChangeText={(text) => handleInputChange('socialYoutube', text)}
                placeholder="youtube.com/@kanaladi"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Kaydet Butonu */}
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Text>
          </TouchableOpacity>

          {/* Hesap Silme */}
          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Tehlikeli Bölge</Text>
            <Text style={styles.dangerDescription}>
              Bu işlem geri alınamaz. Hesabınızı ve tüm verilerinizi kalıcı olarak siler.
            </Text>
            
            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteAccountText}>Hesabı Sil</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {renderSuccessModal()}
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
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  changeImageButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  changeImageText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
  },
  pickerButton: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  dangerSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: theme.spacing.sm,
  },
  dangerDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  deleteAccountButton: {
    backgroundColor: '#ef4444',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  deleteAccountText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  successIconText: {
    fontSize: 40,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EditProfile;
