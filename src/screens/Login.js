import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      alert('Lütfen geçerli bir telefon numarası girin');
      return;
    }

    setLoading(true);
    try {
      // Mock OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowOtpInput(true);
    } catch (error) {
      alert('OTP gönderilemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert('Lütfen 6 haneli OTP kodunu girin');
      return;
    }

    setLoading(true);
    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigation.replace('MainTabs');
    } catch (error) {
      alert('OTP doğrulanamadı: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOtpInput = (index, value) => {
    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);
    setOtp(newOtp.join(''));
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>
              <Text>🏠</Text>
            </Text>
            <Text style={styles.logoText}>
              <Text>Talepify</Text>
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {!showOtpInput ? (
              <>
                <Text style={styles.title}>
                  <Text>Telefon Numarası</Text>
                </Text>
                <Text style={styles.subtitle}>
                  <Text>Giriş yapmak için telefon numaranızı girin</Text>
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>
                    <Text>📞</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0555 123 45 67"
                    placeholderTextColor="#666"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  <View style={styles.loadingContainer}>
                    {loading && <Text style={styles.spinning}>
                      <Text>⏳</Text>
                    </Text>}
                    <Text style={styles.buttonText}>
                      {loading ? (
                        <Text>Gönderiliyor...</Text>
                      ) : (
                        <Text>OTP Gönder</Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>
                  <Text>OTP Doğrulama</Text>
                </Text>
                <Text style={styles.subtitle}>
                  <Text>Telefonunuza gönderilen 6 haneli kodu girin</Text>
                </Text>

                <View style={styles.otpContainer}>
                  {otpInputs.map((digit, index) => (
                    <View key={index} style={styles.otpDigitContainer}>
                      <Text style={styles.otpDigit}>
                        {otp[index] || ''}
                      </Text>
                    </View>
                  ))}
                </View>

                <TextInput
                  style={styles.hiddenOtpInput}
                  value={otp}
                  onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
                  keyboardType="numeric"
                  maxLength={6}
                  autoFocus
                />

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                >
                  <View style={styles.loadingContainer}>
                    {loading && <Text style={styles.spinning}>
                      <Text>⏳</Text>
                    </Text>}
                    <Text style={styles.buttonText}>
                      {showOtpInput ? (
                        <Text>OTP Doğrulama</Text>
                      ) : (
                        <Text>Giriş Yap</Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendButton}>
                  <Text style={styles.resendText}>
                    <Text>Tekrar Gönder</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Register Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                <Text>Hesabınız yok mu? </Text>
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.linkText}>
                  <Text>Kayıt Ol</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07141e',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    fontSize: 20,
    color: '#E50000',
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50000',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#E50000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    fontSize: 20,
    color: '#fff',
    transform: [{ rotate: '360deg' }],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpDigitContainer: {
    width: 45,
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    color: '#E50000',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
  },
  linkText: {
    color: '#E50000',
    fontWeight: '600',
  },
});

export default Login;
