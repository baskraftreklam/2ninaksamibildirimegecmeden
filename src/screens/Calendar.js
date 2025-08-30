import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { makePhoneCall, sendWhatsAppMessage } from '../utils/contactUtils';

const { width } = Dimensions.get('window');

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
  const mockAppointments = [
    {
      id: '1',
      title: 'Müşteri Görüşmesi - Ahmet Yılmaz',
      description: 'Atakum Denizevleri daire görüşmesi',
      date: new Date('2024-01-20'),
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
      date: new Date('2024-01-21'),
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
      date: new Date('2024-01-22'),
      time: '16:00',
      type: 'contract',
      clientName: 'Ayşe Demir',
      phone: '+90 555 987 6543',
      status: 'confirmed'
    }
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time;
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
      onPress={() => navigation.navigate('AppointmentDetail', { appointment: item })}
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
          <Text style={styles.detailValue}>{formatTime(item.time)}</Text>
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
        <Text style={styles.headerTitle}>Takvim</Text>
        <Text style={styles.headerSubtitle}>
          Randevularınızı yönetin ve planlayın
        </Text>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  headerSubtitle: {
    fontSize: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 60,
  },
  
  dateButtonActive: {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  
  dayName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  
  dayNameActive: {
    color: theme.colors.white,
  },
  
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  addButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  
  addButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
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
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  appointmentDescription: {
    fontSize: 14,
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
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  detailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
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
    fontSize: 14,
    fontWeight: '600',
  },
  
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  whatsappButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: width * 0.9,
    maxHeight: '80%',
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
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
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.md,
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  
  saveButton: {
    flex: 1,
    backgroundColor: '#ff0000',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Calendar;
