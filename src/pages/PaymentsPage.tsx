import React, { useState, useEffect } from 'react';
import { usePayments } from '../hooks/usePayments';
import { PaymentForm } from '../components/payments/PaymentForm';
import { PaymentList } from '../components/payments/PaymentList';
import { PaymentSummary } from '../components/payments/PaymentSummary';
import { PaymentDetails } from '../components/payments/PaymentDetails';
import { PaymentFormData, PaymentSearchParams, Payment } from '../types/payment';

export const PaymentsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchParams, setSearchParams] = useState<PaymentSearchParams>({});
  const { 
    payments, 
    loading, 
    error, 
    createPayment, 
    verifyPayment, 
    cancelPayment, 
    searchPayments,
    getPaymentSummary
  } = usePayments();

  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    searchPayments(searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.studentId && searchParams.schoolYearId) {
      getPaymentSummary(searchParams.studentId, searchParams.schoolYearId)
        .then(setSummary);
    }
  }, [searchParams.studentId, searchParams.schoolYearId]);

  const handleCreatePayment = async (data: PaymentFormData) => {
    await createPayment(data);
    setShowForm(false);
    searchPayments(searchParams);
  };

  const handleVerifyPayment = async (id: string) => {
    await verifyPayment(id);
    searchPayments(searchParams);
  };

  const handleCancelPayment = async (id: string) => {
    await cancelPayment(id, 'Paiement annulé par l\'utilisateur');
    searchPayments(searchParams);
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des paiements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nouveau paiement
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Nouveau paiement</h2>
            <PaymentForm onSubmit={handleCreatePayment} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filtres de recherche</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={searchParams.status || ''}
                    onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Tous</option>
                    <option value="pending">En attente</option>
                    <option value="completed">Complété</option>
                    <option value="cancelled">Annulé</option>
                    <option value="refunded">Remboursé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de début</label>
                  <input
                    type="date"
                    value={searchParams.startDate || ''}
                    onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                  <input
                    type="date"
                    value={searchParams.endDate || ''}
                    onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <PaymentList
                payments={payments}
                onVerify={handleVerifyPayment}
                onCancel={handleCancelPayment}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        </div>

        <div>
          {summary && <PaymentSummary summary={summary} />}
        </div>
      </div>
    </div>
  );
}; 