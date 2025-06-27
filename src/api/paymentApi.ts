import axios from 'axios';
import { Payment, PaymentFormData, PaymentSearchParams, PaymentSummary } from '../types/payment';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const paymentApi = {
  // Créer un nouveau paiement
  createPayment: async (data: PaymentFormData): Promise<Payment> => {
    const response = await axios.post(`${API_URL}/payments`, data);
    return response.data.data;
  },

  // Obtenir un paiement par ID
  getPayment: async (id: string): Promise<Payment> => {
    const response = await axios.get(`${API_URL}/payments/${id}`);
    return response.data.data;
  },

  // Obtenir les paiements d'un étudiant
  getStudentPayments: async (studentId: string, schoolYearId?: string): Promise<Payment[]> => {
    const params = schoolYearId ? { schoolYearId } : {};
    const response = await axios.get(`${API_URL}/payments/student/${studentId}`, { params });
    return response.data.data;
  },

  // Obtenir les paiements d'une année scolaire
  getSchoolYearPayments: async (schoolYearId: string): Promise<Payment[]> => {
    const response = await axios.get(`${API_URL}/payments/school-year/${schoolYearId}`);
    return response.data.data;
  },

  // Mettre à jour un paiement
  updatePayment: async (id: string, data: Partial<PaymentFormData>): Promise<Payment> => {
    const response = await axios.put(`${API_URL}/payments/${id}`, data);
    return response.data.data;
  },

  // Supprimer un paiement
  deletePayment: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/payments/${id}`);
  },

  // Vérifier un paiement
  verifyPayment: async (id: string): Promise<Payment> => {
    const response = await axios.put(`${API_URL}/payments/${id}/verify`);
    return response.data.data;
  },

  // Annuler un paiement
  cancelPayment: async (id: string, notes: string): Promise<Payment> => {
    const response = await axios.put(`${API_URL}/payments/${id}/cancel`, { notes });
    return response.data.data;
  },

  // Obtenir le résumé des paiements d'un étudiant
  getPaymentSummary: async (studentId: string, schoolYearId: string): Promise<PaymentSummary> => {
    const response = await axios.get(
      `${API_URL}/payments/student/${studentId}/school-year/${schoolYearId}/summary`
    );
    return response.data.data;
  },

  // Rechercher des paiements
  searchPayments: async (params: PaymentSearchParams): Promise<Payment[]> => {
    const response = await axios.get(`${API_URL}/payments/search`, { params });
    return response.data.data;
  }
}; 