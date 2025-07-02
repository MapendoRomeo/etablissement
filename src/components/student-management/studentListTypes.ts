// Types et interfaces partagés pour StudentList et ses sous-composants

export type SchoolType = 'maternelle' | 'primaire' | 'secondaire';
export type PaymentStatus = 'all' | 'paid' | 'pending';
export type TermType = 'all' | '1er trimestre' | '2e trimestre' | '3e trimestre';

export interface TrimesterPayment {
  term: string;         // ex: "1er trimestre"
  tuition: number;      // montant à payer
  paid: number;         // montant payé
  status: 'paid' | 'pending';
}

export interface ExtraFeePayment {
  name: string;         // nom du frais connexe
  amount: number;       // montant à payer
  paid: number;         // montant payé
  status: 'paid' | 'pending';
}
export interface PaymentQueryParams {
  schoolYearId: string;
  page: number;
  limit: number;
  class?: string;
  option?: string;
  term?: string;
  paymentStatus?: string;
  searchTerm?: string; // pour la recherche par nom
  minPaid?: string;    // pour le montant minimum payé
}

export interface StudentPaymentData {
  id: string;
  name: string;
  class: string;
  school: string;       // ex: "secondaire", "primaire"
  option?: string;      // seulement si école = secondaire
  trimesters: TrimesterPayment[];
  extraFees: ExtraFeePayment[];
}
export interface SchoolOption {
  id: string;
  name: string;
}

export interface SchoolStructureResponse {
  school: string;
  classes: { id: string, name: string }[];
  options: SchoolOption[];
} 