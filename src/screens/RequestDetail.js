import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme/theme';

const RequestDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { request } = route.params || {};

  if (!request) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Talep bilgisi bulunamadı</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Talep Detayı</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Talep Bilgileri</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Başlık:</Text>
            <Text style={styles.infoValue}>{request.title}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Açıklama:</Text>
            <Text style={styles.infoValue}>{request.description}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Şehir:</Text>
            <Text style={styles.infoValue}>{request.city}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>İlçe:</Text>
            <Text style={styles.infoValue}>{request.district}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bütçe:</Text>
            <Text style={styles.infoValue}>{request.budget}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emlak Tipi:</Text>
            <Text style={styles.infoValue}>{request.propertyType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Oda Sayısı:</Text>
            <Text style={styles.infoValue}>{request.roomCount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>İletişim</Text>
          <Text style={styles.contactText}>
            Bu talep için iletişime geçmek istiyorsanız, lütfen portföy sahibi ile iletişime geçin.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },

  backButtonText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
  },

  headerTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textWhite,
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },

  cardTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },

  infoLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    flex: 1,
  },

  infoValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    flex: 2,
    textAlign: 'right',
  },

  contactText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  actionContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
  },

  errorText: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
});

export default RequestDetail;
