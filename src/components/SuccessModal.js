// src/components/SuccessModal.js
// Koyu tema ile merkezde görünen başarı popup komponenti
// Kullanım: showSuccess("Mesaj")

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
} from 'react-native';


let showSuccessFunction = null;

export const showSuccess = (message) => {
  if (showSuccessFunction) {
    showSuccessFunction(message);
  }
};

export default function SuccessModal() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    showSuccessFunction = (msg) => {
      setMessage(msg);
      setVisible(true);
      
      // Animasyon başlat
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // 2 saniye sonra otomatik kapat
      setTimeout(() => {
        hideModal();
      }, 2000);
    };

    return () => {
      showSuccessFunction = null;
    };
  }, [fadeAnim, scaleAnim, hideModal]);

  const hideModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [fadeAnim, scaleAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={hideModal}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouch} 
          activeOpacity={1} 
          onPress={hideModal}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Başarı İkonu */}
          <View style={styles.iconContainer}>
            <Text style={styles.successIcon}>
              <Text>✅</Text>
            </Text>
          </View>
          
          {/* Mesaj */}
          <Text style={styles.message}>
            <Text>{message}</Text>
          </Text>
          
          {/* Kapat Butonu */}
          <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeText}>
              <Text>Tamam</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#07141e',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
    color: '#10b981',
  },
  message: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 80,
  },
  closeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
