import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { theme } from '../theme/theme';

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
            <Text style={styles.logoIcon}>🏠</Text>
            <Text style={styles.logoText}>Talepify</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {!showOtpInput ? (
              <>
                <Text style={styles.title}>Telefon Numarası</Text>
                <Text style={styles.subtitle}>
                  Giriş yapmak için telefon numaranızı girin
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📞</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0555 123 45 67"
                    placeholderTextColor={theme.colors.textSecondary}
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
                    {loading && <Text style={styles.spinning}>⏳</Text>}
                    <Text style={styles.buttonText}>
                      {loading ? 'Gönderiliyor...' : 'OTP Gönder'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>OTP Doğrulama</Text>
                <Text style={styles.subtitle}>
                  Telefonunuza gönderilen 6 haneli kodu girin
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
                    {loading && <Text style={styles.spinning}>⏳</Text>}
                    <Text style={styles.buttonText}>
                      {showOtpInput ? 'OTP Doğrulama' : 'Giriş Yap'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendButton}>
                  <Text style={styles.resendText}>Tekrar Gönder</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Register Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Hesabınız yok mu?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.linkText}>Kayıt Ol</Text>
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
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
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
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  },
  formContainer: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textWhite,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  inputIcon: {
    fontSize: 20,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  input: {
    flex: 1,
    height: 50,
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    marginLeft: theme.spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    fontSize: 20,
    color: theme.colors.white,
    transform: [{ rotate: '360deg' }],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxl,
  },
  otpDigitContainer: {
    width: 45,
    height: 55,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  otpDigit: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  resendText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.md,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },
});

export default Login;
