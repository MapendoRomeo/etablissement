import React from 'react';
import { PaymentSummary as PaymentSummaryType } from '../../types/payment';

interface PaymentSummaryProps {
  summary: PaymentSummaryType;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ summary }) => {
  const progress = (summary.totalPaid / summary.tuitionFee) * 100;
  const remaining = summary.tuitionFee - summary.totalPaid;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé des paiements</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Frais de scolarité</span>
          <span className="text-sm font-semibold text-gray-900">
            {summary.tuitionFee.toLocaleString()} CDF
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Total payé</span>
          <span className="text-sm font-semibold text-green-600">
            {summary.totalPaid.toLocaleString()} CDF
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Reste à payer</span>
          <span className={`text-sm font-semibold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {remaining.toLocaleString()} CDF
          </span>
        </div>

        <div className="pt-2">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-600">
                  Progression
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {progress.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Nombre de paiements</span>
          <span className="text-sm font-semibold text-gray-900">
            {summary.paymentCount}
          </span>
        </div>
      </div>
    </div>
  );
}; 