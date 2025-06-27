import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SchoolManagementDashboard from '@/components/school-management/SchoolManagementDashboard';
import { Class, StudentData } from '@/types/user';
import instance from '@/api/axios';
import { addClass, addStudent, deleteStudentById } from '@/services/schoolManagementService';
import {useSchools} from '@/hooks/useSchools';
import { toast } from 'sonner';

const SchoolManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {schools} = useSchools(); // { schools: [...] }
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Charger les options au montage
    const fetchOptions = async () => {
      try {
        const res = await instance.get('/school/structure/Secondaire');
        setOptions(res.data.options || []);
      } catch (err) {
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const schoolYearId = localStorage.getItem('selectedYearId');
    if (!schoolYearId) return;

    const fetchData = async () => {
      try {
        const res = await instance.get(`/school-management/${schoolYearId}`);
        const { classes, students } = res.data.data;
        setClasses(classes);
        setStudents(students);
      } catch (err: any) {
        setError("Échec de chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClass = async (classData: Omit<Class, 'id'>) => {
    try {
      const school = schools.find(s => s.name === classData.school);
      if (!school) throw new Error("École non trouvée");

      const optionId = options.find(o => Array.isArray(classData.options) ? classData.options.includes(o.name) : o.name === classData.options)?.id;
      const created = await addClass({
        name: classData.name,
        school: school._id,
        option: optionId
      });
      const newClass: Class = {
        id: created._id,
        name: created.name,
        school: school.name,
        options: created.option?.name || undefined
      };

      setClasses(prev => [...prev, newClass]);
    } catch (err) {
    }
  };

  const handleAddStudent = async (studentData: Omit<StudentData, 'id'>) => {
    try {
      const school = schools.find(s => s.name === studentData.school);
      const schoolYearId = localStorage.getItem('selectedYearId');
      const classId = classes.find(c => 
        c.name === studentData.class &&
        (Array.isArray(c.options)
          ? c.options.includes(studentData.option)
          : c.options === studentData.option)
      )?.id;

      if (!school || !schoolYearId || !classId) {
        throw new Error("Données incomplètes pour l'ajout de l'élève");
      }

      const created = await addStudent({
        fullName: studentData.name,
        classId,
        schoolId: school._id,
        schoolYearId,
        paid: studentData.paid
      });

      const newStudent: StudentData = {
        id: created._id,
        name: created.fullName,
        class: studentData.class,
        option: studentData.option,
        school: studentData.school,
        tuition: created.tuition,
        paid: created.paid,
        resteAPayer: created.resteAPayer
      };

      setStudents(prev => [...prev, newStudent]);
    } catch (err) {
    }
  };

  const handleDeleteStudent = async (student: string) => {

  try {
    await deleteStudentById(student);
    setStudents(prev => prev.filter(s => s.id !== student));
    toast.success(`élève supprimé`);
  } catch (err) {
    toast.error("Erreur lors de la suppression.");
  }
};

  if (loading) return <Layout><p>Chargement en cours...</p></Layout>;
  if (error) return <Layout><p className="text-red-600">{error}</p></Layout>;

  return (
    <Layout>
      <SchoolManagementDashboard
        classes={classes}
        students={students}
        onAddClass={handleAddClass}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </Layout>
  );
};

export default SchoolManagement;
