import { useState } from 'react';
import { Payment, PaymentFormData, PaymentSearchParams, PaymentSummary } from '../types/payment';
import { paymentApi } from '../api/paymentApi';

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  const createPayment = async (data: PaymentFormData): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);
      const payment = await paymentApi.createPayment(data);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getStudentPayments = async (studentId: string, schoolYearId?: string): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      const payments = await paymentApi.getStudentPayments(studentId, schoolYearId);
      return payments;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPaymentSummary = async (studentId: string, schoolYearId: string): Promise<PaymentSummary | null> => {
    try {
      setLoading(true);
      setError(null);
      const summary = await paymentApi.getPaymentSummary(studentId, schoolYearId);
      return summary;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (id: string): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);
      const payment = await paymentApi.verifyPayment(id);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelPayment = async (id: string, notes: string): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);
      const payment = await paymentApi.cancelPayment(id, notes);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchPayments = async (params: PaymentSearchParams): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      const payments = await paymentApi.searchPayments(params);
      setPayments(payments);
      return payments;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    payments,
    createPayment,
    getStudentPayments,
    getPaymentSummary,
    verifyPayment,
    cancelPayment,
    searchPayments
  };
}; 