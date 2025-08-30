// src/services/index.js
import { showSuccess as showSuccessModal } from '../components/SuccessModal';

export const showSuccess = (message) => {
  showSuccessModal(message);
};
