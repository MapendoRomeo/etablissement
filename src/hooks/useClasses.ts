// hooks/useClasses.ts
import { useEffect, useState } from 'react';
import instance from '@/api/axios';
import { FeeCategory } from '../types/user';

export type SchoolType = 'maternelle' | 'primaire' | 'secondaire';

export type ClassItem = {
  id: string;
  name: string;
  school: SchoolType;
};

const useClasses = () => {
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await instance.get<ClassItem[]>('/classes/formatted');
        setClassesList(res.data); 
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);
  const defaultFeeCategories: FeeCategory[] = [
    { 
      id: '1',
      name: 'Frais de scolarité',
      feesByClass: classesList.map(c => ({ 
        classId: c.id, 
        termFees: { term1: 0, term2: 0, term3: 0 } 
      })), 
      currency: 'USD' as const, 
      frequency: 'term' as const 
    },
  ];
  return { classesList, loading, defaultFeeCategories };
};

export default useClasses;
