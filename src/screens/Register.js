import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

// Cloudinary ayarları (web projesi ile aynı)
const CLOUDINARY_CLOUD_NAME = "dutsz2qlo";
const CLOUDINARY_UPLOAD_PRESET = "armenkuL_preset";

// Türkiye il listesi
const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
].sort();

// OTP 6 kutucuklu input
const OtpInput = ({ value, onChange, disabled }) => {
  const inputsRef = useRef([]);
  const vals = String(value || "").split("").slice(0, 6);
  while (vals.length < 6) vals.push("");

  const setAt = (i, ch) => {
    const next = [...vals];
    next[i] = ch;
    onChange(next.join(""));
  };

  const handleChange = (i, text) => {
    const cleanText = text.replace(/\D+/g, "");
    if (!cleanText) {
      setAt(i, "");
      return;
    }
    if (cleanText.length === 1) {
      setAt(i, cleanText);
      if (i < 5) inputsRef.current[i + 1]?.focus();
    } else {
      const chars = cleanText.slice(0, 6).split("");
      const next = [];
      for (let k = 0; k < 6; k++) next[k] = chars[k] || vals[k];
      onChange(next.join(""));
      const last = Math.min(5, i + cleanText.length - 1);
      inputsRef.current[last]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.nativeEvent.key === "Backspace") {
      if (vals[i]) setAt(i, "");
      else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        setAt(i - 1, "");
      }
    }
  };

  return (
    <View style={styles.otpContainer}>
      {vals.map((ch, i) => (
        <TextInput
          key={i}
          style={styles.otpBox}
          value={ch}
          onChangeText={(text) => handleChange(i, text)}
          onKeyPress={(e) => handleKeyDown(i, e)}
          keyboardType="numeric"
          maxLength={1}
          disabled={disabled}
          ref={(el) => (inputsRef.current[i] = el)}
        />
      ))}
    </View>
  );
};

// Başarı Modalı
const SuccessModal = ({ visible, title, message, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.checkmark}>
          <View style={styles.checkmarkCircle} />
          <View style={styles.checkmarkStem} />
          <View style={styles.checkmarkKick} />
        </View>
        <Text style={styles.modalTitle}>{title}</Text>
        {message && <Text style={styles.modalMessage}>{message}</Text>}
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>Tamam</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Register = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  
  const [step, setStep] = useState(1); // 1: telefon+şifre, 2: OTP, 3: profil resmi, 4: bilgiler
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Step 2
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const timerRef = useRef(null);

  // Step 3
  const [profileImage, setProfileImage] = useState(null);

  // Step 4
  const [name, setName] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [city, setCity] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [hasReferralCode, setHasReferralCode] = useState(false);

  // Success modal
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // City picker
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Geri sayım timer
  const startCountdown = (secs = 30) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setResendCountdown(secs);
    timerRef.current = setInterval(() => {
      setResendCountdown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // Profil resmi seç (Cloudinary ile)
  const pickImage = async () => {
    try {
      // Şimdilik mock resim ekleyelim, gerçek uygulamada ImagePicker kullanılacak
      Alert.alert(
        'Profil Resmi',
        'Şimdilik örnek resim ekleniyor. Gerçek uygulamada galeriden seçim yapılacak.',
        [
          { text: 'Tamam', style: 'default' }
        ]
      );
      
      // Mock resim ekle (gerçek uygulamada bu kısım ImagePicker ile değiştirilecek)
      const mockImage = {
        uri: 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=Profil',
        type: 'image/jpeg',
        name: 'profile.jpg'
      };
      setProfileImage(mockImage);
    } catch (error) {
      console.error('Resim seçme hatası:', error);
      Alert.alert('Hata', 'Resim seçilemedi');
    }
  };

  // Step 1: Telefon + Şifre
  const handleSendOtp = async () => {
    setError("");
    
    // Telefon numarasını temizle ve formatla
    let cleanPhone = phone.replace(/\D/g, ''); // Sadece rakamları al
    
    // Türkiye telefon numarası kontrolü
    if (cleanPhone.length === 10 && cleanPhone.startsWith('5')) {
      // 5xxxxxxxxx formatı
      cleanPhone = '+90' + cleanPhone;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('05')) {
      // 05xxxxxxxxx formatı
      cleanPhone = '+90' + cleanPhone.substring(1);
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('+90')) {
      // +905xxxxxxxxx formatı - zaten doğru format
    } else {
      setError("Telefon numarası geçerli değil. 5xxxxxxxxx veya 05xxxxxxxxx formatında girin");
      return;
    }
    
    // Temizlenmiş telefon numarasını state'e kaydet
    setPhone(cleanPhone);
    
    if (!password || password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }
    if (password !== password2) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    try {
      setLoading(true);
      // Mock OTP gönderimi (gerçek uygulamada Firebase Auth kullanılacak)
      setStep(2);
      startCountdown(30);
      setOtp("");
    } catch (error) {
      setError("Doğrulama kodu gönderilemedi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Doğrula
  const handleVerifyOtp = async () => {
    setError("");
    
    if (String(otp).length !== 6) {
      setError("6 haneli doğrulama kodu girin");
      return;
    }

    try {
      setLoading(true);
      // Mock OTP doğrulama (gerçek uygulamada Firebase Auth kullanılacak)
      setStep(3);
    } catch (error) {
      setError("Doğrulama hatalı: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP yeniden gönder
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    
    try {
      setLoading(true);
      startCountdown(30);
      setOtp("");
    } catch (error) {
      setError("Kod yeniden gönderilemedi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Son kayıt
  const handleFinish = async () => {
    setError("");
    
    if (!name || !officeName || !city) {
      setError("İsim, ofis adı ve şehir zorunludur");
      return;
    }

    try {
      setLoading(true);
      
      // Profil resmini Cloudinary'ye yükle
      let profilePictureUrl = null;
      if (profileImage && profileImage.uri && !profileImage.uri.includes('placeholder')) {
        try {
          // Cloudinary'ye yükle (fetch API ile)
          const formData = new FormData();
          formData.append('file', {
            uri: profileImage.uri,
            type: profileImage.type || 'image/jpeg',
            name: profileImage.name || 'profile.jpg'
          });
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          
          const responseData = await response.json();
          profilePictureUrl = responseData.secure_url;
          console.log('Resim Cloudinary\'ye yüklendi:', profilePictureUrl);
        } catch (uploadError) {
          console.error('Cloudinary upload hatası:', uploadError);
          Alert.alert('Uyarı', 'Profil resmi yüklenemedi, varsayılan resim kullanılacak.');
          // Varsayılan resim kullan
          profilePictureUrl = 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=Profil';
        }
      } else if (profileImage) {
        // Mock resim kullan
        profilePictureUrl = profileImage.uri;
      }

      // Kayıt işlemi
      const result = await signUp(phone, password, {
        displayName: name,
        phoneNumber: phone,
        city: city,
        officeName: officeName,
        profilePicture: profilePictureUrl,
        referredBy: hasReferralCode && referralCode ? referralCode : null,
      });

      if (result.success) {
        // Kayıt başarılı, otomatik giriş yap
        setSuccessMessage("Kaydınız tamamlanmıştır. 7 günlük deneme sürümü aktifleştirilmiştir. Otomatik giriş yapılıyor...");
        setSuccessVisible(true);
        
        // 2 saniye sonra otomatik giriş yap
        setTimeout(() => {
          setSuccessVisible(false);
          navigation.navigate('MainTabs');
        }, 2000);
      } else {
        setError("Kayıt tamamlanamadı: " + (result.error || "Bilinmeyen hata"));
      }
    } catch (error) {
      setError("Kayıt tamamlanamadı: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const closeSuccessModal = () => {
    setSuccessVisible(false);
    // Zaten otomatik giriş yapılıyor, sadece modal'ı kapat
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emlakçı Olarak Kayıt Olun</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Step 1: Telefon + Şifre */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 1: Telefon ve Şifre</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefon Numarası *</Text>
                             <TextInput
                 style={styles.textInput}
                 placeholder="5xxxxxxxxx veya 05xxxxxxxxx"
                 value={phone}
                 onChangeText={setPhone}
                 keyboardType="phone-pad"
                 placeholderTextColor="#999"
               />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="En az 6 karakter"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre Tekrar *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Şifrenizi tekrar girin"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 2: SMS Doğrulama</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>6 Haneli Kod</Text>
              <OtpInput value={otp} onChange={setOtp} disabled={loading} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.halfButton]}
                onPress={goBack}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Geri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.halfButton, String(otp).length !== 6 && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading || String(otp).length !== 6}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Kontrol ediliyor..." : "Onayla"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.secondaryButton, resendCountdown > 0 && styles.buttonDisabled]}
              onPress={handleResendOtp}
              disabled={loading || resendCountdown > 0}
            >
              <Text style={styles.secondaryButtonText}>
                {resendCountdown > 0
                  ? `Kodu Tekrar Gönder (${resendCountdown}s)`
                  : "Kodu Tekrar Gönder"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Profil Resmi */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 3: Profil Resmi</Text>
            
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageIcon}>📷</Text>
                  <Text style={styles.profileImageText}>+ Resim Ekle</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.halfButton]}
                onPress={goBack}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Geri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.halfButton]}
                onPress={goNext}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>Devam Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 4: Bilgiler */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adım 4: Kişisel Bilgiler</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>İsim Soyisim *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Adınız ve soyadınız"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ofis Adı *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Yılmaz Emlak"
                value={officeName}
                onChangeText={setOfficeName}
                placeholderTextColor="#999"
              />
            </View>

                                     <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şehir *</Text>
              <View style={styles.cityPickerContainer}>
                <TouchableOpacity
                  style={styles.cityPickerButton}
                  onPress={() => setShowCityPicker(true)}
                >
                  <Text style={[styles.cityPickerText, !city && styles.cityPickerPlaceholder]}>
                    {city || 'Şehir seçin'}
                  </Text>
                  <Text style={styles.cityPickerIcon}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Referans Kodu */}
            <View style={styles.inputContainer}>
              <View style={styles.referralHeader}>
                <Text style={styles.inputLabel}>Referans Kodu</Text>
                <TouchableOpacity
                  style={styles.referralToggle}
                  onPress={() => setHasReferralCode(!hasReferralCode)}
                >
                  <Text style={[styles.referralToggleText, hasReferralCode && styles.referralToggleActive]}>
                    {hasReferralCode ? '✓ Var' : 'Yok'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {hasReferralCode && (
                <TextInput
                  style={styles.textInput}
                  placeholder="Referans kodunuzu girin (opsiyonel)"
                  value={referralCode}
                  onChangeText={setReferralCode}
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                />
              )}
              
              {hasReferralCode && (
                <Text style={styles.referralInfo}>
                  💡 Referans kodu ile kayıt olursanız, abonelik satın aldığınızda referans kodu sahibine 30 gün ek süre verilir.
                </Text>
              )}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.halfButton]}
                onPress={goBack}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Geri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.halfButton]}
                onPress={handleFinish}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Kaydediliyor..." : "Kaydı Tamamla"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bilgi kutusu */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Kayıt olduktan sonra 7 günlük ücretsiz deneme sürümü otomatik olarak başlar.
          </Text>
        </View>
      </View>

             {/* Başarı Modalı */}
       <SuccessModal
         visible={successVisible}
         title="Başarılı!"
         message={successMessage}
         onClose={closeSuccessModal}
       />
       
       {/* Şehir Seçim Modalı */}
       <Modal
         visible={showCityPicker}
         animationType="slide"
         transparent={true}
         onRequestClose={() => setShowCityPicker(false)}
       >
         <View style={styles.cityModalOverlay}>
           <View style={styles.cityModalContent}>
             <View style={styles.cityModalHeader}>
               <Text style={styles.cityModalTitle}>Şehir Seçin</Text>
               <TouchableOpacity
                 style={styles.cityModalCloseButton}
                 onPress={() => setShowCityPicker(false)}
               >
                 <Text style={styles.cityModalCloseText}>✕</Text>
               </TouchableOpacity>
             </View>
             <ScrollView style={styles.cityListContainer}>
               {TURKEY_CITIES.map((cityName) => (
                 <TouchableOpacity
                   key={cityName}
                   style={styles.cityItem}
                   onPress={() => {
                     setCity(cityName);
                     setShowCityPicker(false);
                   }}
                 >
                   <Text style={styles.cityItemText}>{cityName}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
           </View>
         </View>
       </Modal>
     </ScrollView>
   );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 44,
  },
  content: {
    padding: 20,
  },
  stepContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageIcon: {
    fontSize: 40,
    marginBottom: 5,
  },
  profileImageText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
    textAlign: 'center',
  },
  // OTP Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  checkmark: {
    width: 56,
    height: 56,
    marginBottom: 16,
    position: 'relative',
  },
  checkmarkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    opacity: 0.2,
  },
  checkmarkStem: {
    position: 'absolute',
    width: 6,
    height: 22,
    backgroundColor: '#22C55E',
    top: 18,
    left: 26,
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  checkmarkKick: {
    position: 'absolute',
    width: 6,
    height: 12,
    backgroundColor: '#22C55E',
    top: 28,
    left: 18,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
     modalButtonText: {
     color: '#FFFFFF',
     fontSize: 16,
     fontWeight: '600',
   },
   
   // City Picker Styles
   cityPickerContainer: {
     marginBottom: 20,
   },
   cityPickerButton: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     borderWidth: 1,
     borderColor: '#E0E0E0',
     borderRadius: 8,
     paddingHorizontal: 16,
     paddingVertical: 12,
     backgroundColor: '#FFFFFF',
   },
   cityPickerText: {
     fontSize: 16,
     color: '#333',
   },
   cityPickerPlaceholder: {
     color: '#999',
   },
   cityPickerIcon: {
     fontSize: 16,
     color: '#666',
   },
   
   // City Modal Styles
   cityModalOverlay: {
     flex: 1,
     backgroundColor: 'rgba(0,0,0,0.5)',
     justifyContent: 'center',
     alignItems: 'center',
   },
   cityModalContent: {
     backgroundColor: '#FFFFFF',
     borderRadius: 16,
     margin: 20,
     width: '90%',
     maxHeight: '80%',
   },
   cityModalHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: 20,
     borderBottomWidth: 1,
     borderBottomColor: '#E0E0E0',
   },
   cityModalTitle: {
     fontSize: 18,
     fontWeight: '600',
     color: '#333',
   },
   cityModalCloseButton: {
     padding: 5,
   },
   cityModalCloseText: {
     fontSize: 24,
     color: '#666',
   },
   cityListContainer: {
     maxHeight: 400,
   },
   cityItem: {
     paddingVertical: 15,
     paddingHorizontal: 20,
     borderBottomWidth: 1,
     borderBottomColor: '#F0F0F0',
   },
   cityItemText: {
     fontSize: 16,
     color: '#333',
   },
   
   // Referans Kodu Stilleri
   referralHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 8,
   },
   referralToggle: {
     backgroundColor: '#F3F4F6',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 16,
     borderWidth: 1,
     borderColor: '#D1D5DB',
   },
   referralToggleText: {
     fontSize: 14,
     color: '#6B7280',
     fontWeight: '500',
   },
   referralToggleActive: {
     color: '#059669',
     fontWeight: '600',
   },
   referralInfo: {
     fontSize: 12,
     color: '#6B7280',
     fontStyle: 'italic',
     marginTop: 8,
     lineHeight: 16,
     backgroundColor: '#F9FAFB',
     padding: 8,
     borderRadius: 6,
     borderLeftWidth: 3,
     borderLeftColor: '#10B981',
   },
 });

export default Register;
