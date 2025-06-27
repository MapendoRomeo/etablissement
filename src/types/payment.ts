// src/types/payment.ts
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
export type PaymentStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface Payment {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  };
  schoolYear: {
    _id: string;
    name: string;
  };
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  status: PaymentStatus;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  verifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  verificationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalPaid: number;
  tuitionFee: number;
  remaining: number;
  paymentCount: number;
}

export interface PaymentFormData {
  student: string;
  schoolYear: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  description: string;
}

export interface PaymentSearchParams {
  studentId?: string;
  schoolYearId?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export interface PaymentFilterParams {
  schoolId?: string;
  classId?: string;
  name?: string;
  minAmount?: number;
  paymentStatus?: "complete" | "incomplete";
}
  