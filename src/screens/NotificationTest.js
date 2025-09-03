import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import simpleNotificationService from '../services/simpleNotificationService';
import reminderScheduler from '../services/reminderScheduler';

const NotificationTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (message) => {
    setTestResults(prev => [...prev, { id: Date.now(), message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testPortfolioNotification = async () => {
    try {
      const testPortfolio = {
        id: 'test-portfolio-' + Date.now(),
        title: 'Test Portföy Başlığı',
        userName: user?.displayName || user?.email || 'Test Kullanıcı'
      };

      await simpleNotificationService.sendPortfolioReminder(
        testPortfolio.id,
        testPortfolio.title,
        testPortfolio.userName,
        10
      );

      addTestResult('✅ Portföy bildirimi gönderildi (10. gün)');
    } catch (error) {
      addTestResult(`❌ Portföy bildirimi hatası: ${error.message}`);
    }
  };

  const testRequestNotification = async () => {
    try {
      const testRequest = {
        id: 'test-request-' + Date.now(),
        title: 'Test Talep Başlığı',
        userName: user?.displayName || user?.email || 'Test Kullanıcı'
      };

      await simpleNotificationService.sendRequestReminder(
        testRequest.id,
        testRequest.title,
        testRequest.userName,
        20
      );

      addTestResult('✅ Talep bildirimi gönderildi (20. gün)');
    } catch (error) {
      addTestResult(`❌ Talep bildirimi hatası: ${error.message}`);
    }
  };

  const testAllNotifications = async () => {
    try {
      const testPortfolio = {
        id: 'test-all-' + Date.now(),
        title: 'Test Tüm Bildirimler Portföy',
        userName: user?.displayName || user?.email || 'Test Kullanıcı'
      };

      // Tüm günler için bildirim gönder
      for (const day of [10, 20, 30, 45]) {
        await simpleNotificationService.sendPortfolioReminder(
          testPortfolio.id,
          testPortfolio.title,
          testPortfolio.userName,
          day
        );
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
      }

      addTestResult('✅ Tüm günler için bildirimler gönderildi (10, 20, 30, 45)');
    } catch (error) {
      addTestResult(`❌ Toplu bildirim hatası: ${error.message}`);
    }
  };

  const testReminderScheduler = async () => {
    try {
      reminderScheduler.manualCheck();
      addTestResult('✅ Hatırlatma zamanlayıcısı manuel kontrol yapıldı');
    } catch (error) {
      addTestResult(`❌ Zamanlayıcı hatası: ${error.message}`);
    }
  };

  const clearNotifications = async () => {
    try {
      simpleNotificationService.clearAllNotifications();
      addTestResult('✅ Tüm bildirimler temizlendi');
    } catch (error) {
      addTestResult(`❌ Bildirim temizleme hatası: ${error.message}`);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bildirim Sistemi Test</Text>
        <Text style={styles.headerSubtitle}>Bildirim sistemini test etmek için butonları kullanın</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Tekil Testler</Text>
          
          <TouchableOpacity style={styles.testButton} onPress={testPortfolioNotification}>
            <Text style={styles.testButtonText}>Portföy Bildirimi Test (10. gün)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testRequestNotification}>
            <Text style={styles.testButtonText}>Talep Bildirimi Test (20. gün)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testAllNotifications}>
            <Text style={styles.testButtonText}>Tüm Günler Test (10, 20, 30, 45)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testReminderScheduler}>
            <Text style={styles.testButtonText}>Zamanlayıcı Manuel Kontrol</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Sistem İşlemleri</Text>
          
          <TouchableOpacity style={[styles.testButton, styles.clearButton]} onPress={clearNotifications}>
            <Text style={styles.testButtonText}>Tüm Bildirimleri Temizle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.testButton, styles.clearButton]} onPress={clearTestResults}>
            <Text style={styles.testButtonText}>Test Sonuçlarını Temizle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Sonuçları</Text>
          
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>Henüz test yapılmadı</Text>
          ) : (
            testResults.map((result) => (
              <View key={result.id} style={styles.resultItem}>
                <Text style={styles.resultMessage}>{result.message}</Text>
                <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
              </View>
            ))
          )}
        </View>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  testSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#666',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultItem: {
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resultMessage: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 5,
  },
  resultTimestamp: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  noResults: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default NotificationTest;
