
export type UserRole = 'admin' | 'teacher' | 'accountant';
export type SchoolType = 'Maternelle' | 'Primaire' | 'Secondaire';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  schools?: SchoolType[]; // Écoles auxquelles l'utilisateur a accès
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  schools?: SchoolType[]; // Écoles auxquelles l'utilisateur a accès
}

export interface StudentData {
  id?: string;
  name: string;
  class: string;
  option?: string;  
  school: SchoolType;
  tuition: number;
  paid: number; // Montant déjà payé
  resteAPayer: number; // Reste à payer (anciennement "due")
}

export interface ClassFee {
  classId: string;
  amount: number;
}

export interface TermFees {
  term1: number;
  term2: number;
  term3: number;
}

export interface FeeCategory {
  id: string;
  name: string;
  feesByClass: {
    classId: string;
    termFees: TermFees;
  }[];
  currency: 'USD' | 'CDF';
  frequency: 'one-time' | 'monthly' | 'term' | 'yearly';
}

export interface AdditionalFee {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: 'USD' | 'CDF';
  frequency: 'one-time' | 'monthly' | 'term' | 'yearly';
}

export interface SchoolYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  terms: Term[];
}

export interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  schoolYearId: string;
}

export interface Class {
  id: string;
  name: string;
  school: SchoolType;
  options?: string[]; // Pour le secondaire, les options comme "Maths", "Sciences", etc.
}

export interface PaymentStatus {
  isUpToDate: boolean;
  termRequired: number;
  termPaid: number;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  currency: 'USD' | 'CDF';
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money';
  reference: string;
  notes?: string;
  studentName?: string;
}

export interface ExchangeRate {
  id: string;
  date: string;
  usdToCdf: number;
  createdAt: string;
  updatedAt: string;
}
