
import { Class, StudentData, SchoolType } from '@/types/user';

export const validateClassName = (
  name: string,
  school: SchoolType,
  classes: Class[],
  option?: string
): { isValid: boolean; error?: string } => {
  // Vérifier si le nom de classe existe déjà dans cette école
  const existingClass = classes.find(
    c => c.name.toLowerCase() === name.toLowerCase() && c.school === school
  );
  
  if (existingClass) {
    return {
      isValid: false,
      error: `Une classe avec le nom "${name}" existe déjà dans cette école`
    };
  }

  // Pour le secondaire, vérifier l'unicité dans l'option
  if (school === 'Secondaire' && option) {
    const classesInOption = classes.filter(c => 
      c.school === 'Secondaire' && 
      getOptionFromClassName(c.name) === option
    );
    
    const duplicateInOption = classesInOption.find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (duplicateInOption) {
      return {
        isValid: false,
        error: `Une classe avec le nom "${name}" existe déjà dans l'option "${option}"`
      };
    }
  }

  return { isValid: true };
};

export const validateStudentName = (
  studentName: string,
  className: string,
  school: SchoolType,
  students: StudentData[]
): { isValid: boolean; error?: string } => {
  const existingStudent = students.find(
    s => s.name.toLowerCase() === studentName.toLowerCase() && 
         s.class === className && 
         s.school === school
  );

  if (existingStudent) {
    return {
      isValid: false,
      error: `Un élève avec le nom "${studentName}" existe déjà dans cette classe`
    };
  }

  return { isValid: true };
};

export const getOptionFromClassName = (className: string): string => {
  if (className.includes('HTS')) return 'Social';
  if (className.includes('HP')) return 'Pédagogie';
  if (className.includes('Eo')) return 'Electronique';
  if (className.includes('HTC')) return 'Construction';
  if (className.includes('HTN')) return 'Nutrition';
  return 'Général';
};

export const formatClassNameWithOption = (baseName: string, option: string): string => {
  const optionAbbrev = {
    'Social': 'HTS',
    'Pédagogie': 'HP',
    'Electronique': 'Eo',
    'Construction': 'HTC',
    'Nutrition': 'HTN',

  };
  
  const abbrev = optionAbbrev[option as keyof typeof optionAbbrev] || 'Général';
  return `${baseName} ${abbrev}`;
};
