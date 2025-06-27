import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PaymentFormData, PaymentMethod } from '../../types/payment';
import { usePayments } from '../../hooks/usePayments';

interface PaymentFormProps {
  studentId?: string;
  schoolYearId?: string;
  onSubmit: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
}

const paymentMethods: PaymentMethod[] = ['cash', 'bank_transfer', 'mobile_money', 'check'];

export const PaymentForm: React.FC<PaymentFormProps> = ({
  studentId,
  schoolYearId,
  onSubmit,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PaymentFormData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof PaymentFormData, value);
      });
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Étudiant</label>
        <input
          type="text"
          {...register('student', { required: 'L\'étudiant est requis' })}
          defaultValue={studentId}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.student && (
          <p className="mt-1 text-sm text-red-600">{errors.student.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Année scolaire</label>
        <input
          type="text"
          {...register('schoolYear', { required: 'L\'année scolaire est requise' })}
          defaultValue={schoolYearId}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.schoolYear && (
          <p className="mt-1 text-sm text-red-600">{errors.schoolYear.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Montant</label>
        <input
          type="number"
          {...register('amount', {
            required: 'Le montant est requis',
            min: { value: 0, message: 'Le montant doit être positif' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date de paiement</label>
        <input
          type="date"
          {...register('paymentDate', { required: 'La date de paiement est requise' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.paymentDate && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Méthode de paiement</label>
        <select
          {...register('paymentMethod', { required: 'La méthode de paiement est requise' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez une méthode</option>
          {paymentMethods.map(method => (
            <option key={method} value={method}>
              {method === 'cash' ? 'Espèces' :
               method === 'bank_transfer' ? 'Virement bancaire' :
               method === 'mobile_money' ? 'Mobile Money' :
               'Chèque'}
            </option>
          ))}
        </select>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro de référence</label>
        <input
          type="text"
          {...register('referenceNumber', { required: 'Le numéro de référence est requis' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.referenceNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.referenceNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: 'La description est requise' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}; 