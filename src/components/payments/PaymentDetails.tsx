import React from 'react';
import { Payment } from '../../types/payment';
import { formatDateTime } from '../../utils/dateUtils';

interface PaymentDetailsProps {
  payment: Payment;
  onClose: () => void;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    pending: 'En attente',
    completed: 'Complété',
    cancelled: 'Annulé',
    refunded: 'Remboursé'
  };

  const paymentMethodLabels = {
    cash: 'Espèces',
    bank_transfer: 'Virement bancaire',
    mobile_money: 'Mobile Money',
    check: 'Chèque'
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-900">Détails du paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Étudiant</h3>
              <p className="mt-1 text-sm text-gray-900">
                {payment.student.firstName} {payment.student.lastName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Année scolaire</h3>
              <p className="mt-1 text-sm text-gray-900">{payment.schoolYear.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Montant</h3>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {payment.amount.toLocaleString()} CDF
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de paiement</h3>
              <p className="mt-1 text-sm text-gray-900">
                {formatDateTime(payment.paymentDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Méthode de paiement</h3>
              <p className="mt-1 text-sm text-gray-900">
                {paymentMethodLabels[payment.paymentMethod]}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                {statusLabels[payment.status]}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Numéro de référence</h3>
            <p className="mt-1 text-sm text-gray-900">{payment.referenceNumber}</p>
          </div>

          {payment.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-sm text-gray-900">{payment.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Créé par</h3>
              <p className="mt-1 text-sm text-gray-900">
                {payment.createdBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatDateTime(payment.createdAt)}
              </p>
            </div>
            {payment.verifiedBy && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vérifié par</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {payment.verifiedBy.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(payment.verificationDate!)}
                </p>
              </div>
            )}
          </div>

          {payment.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 text-sm text-gray-900">{payment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 