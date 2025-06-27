 // src/types/schoolYear.ts
 export interface Trimester {
    name: string;
    startDate: string;
    endDate: string;
    tuitionFees: Record<string, number>; // { classId: montant }
  }
  
  export interface ExtraFee {
    label: string;
    amount: number;
  }
  
  export interface SchoolYear {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    trimesters: Trimester[];
    extraFees: Record<string, ExtraFee[]>; // par école
    isActive: boolean;
  }
  