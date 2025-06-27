import React from 'react';
import { Payment, PaymentStatus } from '../../types/payment';
import { formatDate } from '../../utils/dateUtils';

interface PaymentListProps {
  payments: Payment[];
  onVerify?: (id: string) => void;
  onCancel?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (payment: Payment) => void;
}

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<PaymentStatus, string> = {
  pending: 'En attente',
  completed: 'Complété',
  cancelled: 'Annulé',
  refunded: 'Remboursé'
};

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  onVerify,
  onCancel,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Étudiant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Année scolaire
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Méthode
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {payment.student.firstName} {payment.student.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {payment.student.studentId}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{payment.schoolYear.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {payment.amount.toLocaleString()} CDF
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(payment.paymentDate)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {payment.paymentMethod === 'cash' ? 'Espèces' :
                   payment.paymentMethod === 'bank_transfer' ? 'Virement bancaire' :
                   payment.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                   'Chèque'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[payment.status]}`}>
                  {statusLabels[payment.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(payment)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Détails
                  </button>
                )}
                {payment.status === 'pending' && onVerify && (
                  <button
                    onClick={() => onVerify(payment._id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Vérifier
                  </button>
                )}
                {payment.status === 'pending' && onCancel && (
                  <button
                    onClick={() => onCancel(payment._id)}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    Annuler
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(payment._id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Modifier
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(payment._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 