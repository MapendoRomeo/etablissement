// src/hooks/useSchools.ts
import { useEffect, useState } from 'react';
import instance from '@/api/axios';
import { SchoolType } from '@/types/user';

interface School {
  _id: string;
  name: SchoolType;
}

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await instance.get('/schools/schools'); // ← adapte si ton endpoint a un autre nom
        setSchools(response.data);
      } catch (err) {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return { schools, loading, error };
};
