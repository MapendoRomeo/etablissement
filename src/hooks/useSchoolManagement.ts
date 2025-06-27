import { useState, useCallback, useEffect } from 'react';
import { Class, StudentData, SchoolType } from '@/types/user';
import { toast } from 'sonner';
import instance from '@/api/axios';

export const useSchoolManagement = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);

  useEffect(() => {
    const schoolYearId = localStorage.getItem('selectedYearId');
    if (!schoolYearId) return;

    const fetchData = async () => {
      try {
        const res = await instance.get(`/school-management/${schoolYearId}`);
        const { classes, students } = res.data.data;
        setClasses(classes);
        setStudents(students);
      } catch (err) {
        toast.error("Erreur de chargement des données scolaires");
      }
    };

    fetchData();
  }, []);

  const addClass = useCallback((classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      id: 'class-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      ...classData
    };

    setClasses(prev => [...prev, newClass]);
    return newClass;
  }, []);

  const addStudent = useCallback((studentData: Omit<StudentData, 'id'>) => {
    const newStudent: StudentData = {
      id: 'student-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      ...studentData
    };

    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  }, []);

  const updateStudent = useCallback((studentId: string, updates: Partial<StudentData>) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, ...updates, resteAPayer: (updates.tuition ?? student.tuition) - (updates.paid ?? student.paid) }
        : student
    ));
  }, []);

  const deleteStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  }, []);

  const deleteClass = useCallback((classId: string) => {
    const classToDelete = classes.find(c => c.id === classId);
    if (!classToDelete) return;

    const studentsInClass = students.filter(s => s.class === classToDelete.name);
    if (studentsInClass.length > 0) {
      toast.error(`Impossible de supprimer la classe ${classToDelete.name}. Elle contient ${studentsInClass.length} élève(s).`);
      return false;
    }

    setClasses(prev => prev.filter(c => c.id !== classId));
    return true;
  }, [classes, students]);

  const getSchoolStats = useCallback((school: SchoolType) => {
    const schoolClasses = classes.filter(c => c.school === school);
    const schoolStudents = students.filter(s => s.school === school);

    return {
      classCount: schoolClasses.length,
      studentCount: schoolStudents.length,
      paidStudents: schoolStudents.filter(s => s.resteAPayer === 0).length,
      unpaidAmount: schoolStudents.reduce((sum, s) => sum + s.resteAPayer, 0)
    };
  }, [classes, students]);

  const getClassStudents = useCallback((className: string, school: SchoolType) => {
    return students.filter(s => s.class === className && s.school === school);
  }, [students]);

  const getSecondaryOptions = useCallback(() => {
    const secondaryClassOptions = classes
      .filter(c => c.school === 'Secondaire')
      .map(c => {
        const match = c.name.match(/\((.*?)\)$/);
        return match ? match[1] : null;
      })
      .filter((opt): opt is string => !!opt);

    return Array.from(new Set(secondaryClassOptions));
  }, [classes]);

  return {
    classes,
    students,
    addClass,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteClass,
    getSchoolStats,
    getClassStudents,
    getSecondaryOptions
  };
};
