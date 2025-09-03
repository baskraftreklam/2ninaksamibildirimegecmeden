import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { makePhoneCall, sendWhatsAppMessage } from '../utils/contactUtils';

const Calendar = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '09:00',
    type: 'meeting',
    clientName: '',
    phone: '',
  });

  // Mock data - gerçek uygulamada Firebase'den gelecek
  const mockAppointments = useMemo(() => [
    {
      id: '1',
      title: 'Müşteri Görüşmesi - Ahmet Yılmaz',
      description: 'Atakum Denizevleri daire görüşmesi',
      date: new Date(),
      time: '14:00',
      type: 'meeting',
      clientName: 'Ahmet Yılmaz',
      phone: '+90 555 123 4567',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Portföy İnceleme - Villa',
      description: 'Canik villa detay incelemesi',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Yarın
      time: '10:30',
      type: 'inspection',
      clientName: 'Mehmet Kaya',
      phone: '+90 555 456 7890',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Sözleşme İmza - Daire',
      description: 'İlkadım daire sözleşme imzası',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
      time: '16:00',
      type: 'contract',
      clientName: 'Ayşe Demir',
      phone: '+90 555 987 6543',
      status: 'confirmed'
    }
  ], []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '🤝';
      case 'inspection': return '🔍';
      case 'contract': return '📋';
      case 'phone': return '📞';
      default: return '📅';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'meeting': return 'Görüşme';
      case 'inspection': return 'İnceleme';
      case 'contract': return 'Sözleşme';
      case 'phone': return 'Telefon';
      default: return 'Diğer';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.info;
      case 'cancelled': return theme.colors.primary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Bekliyor';
      case 'cancelled': return 'İptal';
      default: return 'Bilinmiyor';
    }
  };

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const selectedDateOnly = new Date(selectedDate);
      
      return appointmentDate.toDateString() === selectedDateOnly.toDateString();
    });
  }, [selectedDate, mockAppointments]);

  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={() => {
        // Randevu detayını modal olarak göster veya Profile sayfasına yönlendir
        Alert.alert(
          'Randevu Detayı',
          `${item.title}\n\n${item.description}\n\nMüşteri: ${item.clientName}\nSaat: ${item.time}\nDurum: ${getStatusLabel(item.status)}`,
          [
            { text: 'Tamam', style: 'default' },
            { text: 'Düzenle', onPress: () => setShowAddModal(true) }
          ]
        );
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
          <Text style={styles.typeLabel}>{getTypeLabel(item.type)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.appointmentTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.appointmentDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Müşteri:</Text>
          <Text style={styles.detailValue}>{item.clientName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Saat:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.phoneButton}
          onPress={() => makePhoneCall(item.phone)}
        >
          <Text style={styles.phoneButtonText}>📞 Ara</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.whatsappButton}
          onPress={() => sendWhatsAppMessage(item.phone, `Merhaba, ${item.title} randevusu hakkında bilgi almak istiyorum.`)}
        >
          <Text style={styles.whatsappButtonText}>💬 WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDateButton = (date, isSelected = false) => {
    const dayName = new Date(date).toLocaleDateString('tr-TR', { weekday: 'short' });
    const dayNumber = new Date(date).getDate();
    
    return (
      <TouchableOpacity
        style={[styles.dateButton, isSelected && styles.dateButtonActive]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
          {dayName}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.dayNumberActive]}>
          {dayNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handleAddAppointment = () => {
    // Burada yeni randevu ekleme işlemi yapılacak
    setShowAddModal(false);
    setNewAppointment({
      title: '',
      description: '',
      date: new Date(),
      time: '09:00',
      type: 'meeting',
      clientName: '',
      phone: '',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Takvim</Text>
          <Text style={styles.headerSubtitle}>
            Randevularınızı yönetin ve planlayın
          </Text>
        </View>
      </View>

      <View style={styles.dateSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {generateWeekDates().map((date, index) => (
            <View key={index} style={styles.dateButtonContainer}>
              {renderDateButton(date, date.toDateString() === selectedDate.toDateString())}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateText}>
          {formatDate(selectedDate)}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Yeni Randevu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Bu tarihte randevu yok</Text>
            <Text style={styles.emptySubtext}>
              Yeni randevu eklemek için + butonuna tıklayın
            </Text>
          </View>
        }
      />

      {/* Add Appointment Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Randevu</Text>
            
            <ScrollView style={styles.modalForm}>
              <TextInput
                style={styles.input}
                placeholder="Randevu başlığı"
                placeholderTextColor={theme.colors.textSecondary}
                value={newAppointment.title}
                onChangeText={(text) => setNewAppointment({...newAppointment, title: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Açıklama"
                placeholderTextColor={theme.colors.textSecondary}
                value={newAppointment.description}
                onChangeText={(text) => setNewAppointment({...newAppointment, description: text})}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Müşteri adı"
                placeholderTextColor={theme.colors.textSecondary}
                value={newAppointment.clientName}
                onChangeText={(text) => setNewAppointment({...newAppointment, clientName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Telefon"
                placeholderTextColor={theme.colors.textSecondary}
                value={newAppointment.phone}
                onChangeText={(text) => setNewAppointment({...newAppointment, phone: text})}
                keyboardType="phone-pad"
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddAppointment}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  headerSubtitle: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.textSecondary,
  },
  
  dateSelector: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  
  dateButtonContainer: {
    marginRight: theme.spacing.sm,
  },
  
  dateButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 60,
  },
  
  dateButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  
  dayName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  
  dayNameActive: {
    color: theme.colors.white,
  },
  
  dayNumber: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  
  dayNumberActive: {
    color: theme.colors.white,
  },
  
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  
  selectedDateText: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  
  addButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  listContainer: {
    padding: theme.spacing.lg,
  },
  
  appointmentCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  typeIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  
  typeLabel: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  
  statusText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  
  appointmentTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  appointmentDescription: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  
  appointmentDetails: {
    marginBottom: theme.spacing.md,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  detailLabel: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  
  detailValue: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.semibold,
  },
  
  cardFooter: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  
  phoneButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  phoneButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  whatsappButton: {
    flex: 1,
    backgroundColor: theme.colors.info,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  whatsappButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  
  emptyText: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: theme.fontWeights.semibold,
  },
  
  emptySubtext: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '90%',
    maxHeight: '80%',
  },
  
  modalTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  
  modalForm: {
    marginBottom: theme.spacing.lg,
  },
  
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.inputText,
    fontSize: theme.fontSizes.xxl,
    marginBottom: theme.spacing.md,
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
  },
  
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
  },
});

export default Calendar;
