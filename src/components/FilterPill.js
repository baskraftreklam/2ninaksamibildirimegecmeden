// src/components/FilterPill.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function FilterPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.container,
        active && styles.containerActive
      ]}
    >
      <Text style={[
        styles.text,
        active && styles.textActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 90,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  containerActive: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
  },
  text: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  textActive: {
    color: theme.colors.white,
  },
});
