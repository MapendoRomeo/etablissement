
import { SchoolYear } from '@/types/user';
import instance from '@/api/axios';

export const getActiveSchoolYear = async (): Promise<SchoolYear | null> => {
  const response = await instance.get('/schools/active');
  const mockSchoolYear = response.data;
  return mockSchoolYear;
};


