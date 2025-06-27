import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import instance from '../api/axios';
import SchoolYearSelector from '@/components/SchoolYearSelector';
import SchoolYearSummary from '@/components/SchoolYearSummary';
import { toast } from 'sonner';

type SchoolData = {
  id: string;
  name: string;
  classCount: number;
  studentCount: number;
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  
  localStorage.setItem('selectedYearId', selectedYearId);
  const handleYearChange = (yearId: string) => {
    if (selectedYearId != yearId) toast.info(`Année académique changée`);
    setSelectedYearId(yearId);
  };

  const handleSchoolSelect = (schoolType: string) => {
    navigate(`/dashboard/${schoolType}`);
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        if (!selectedYearId) return; // protection
        const response = await instance.get("/schools/overview", {
          params: { schoolYearId: selectedYearId },
        });
        setSchools(response.data);
      } catch (error) {
      }
    };

    fetchSchools();
  }, [selectedYearId]); // met à jour quand une autre année est sélectionnée

  const getSchoolType = (name: string): string => {
    if (name === 'Maternelle') return 'maternelle';
    if (name === 'Primaire') return 'primaire';
    if (name === 'Secondaire') return 'secondaire';
    return '';
  };

  const getGradientColors = (name: string) => {
    switch (name) {
      case 'Maternelle':
        return 'from-blue-100 to-blue-300';
      case 'Primaire':
        return 'from-green-100 to-green-300';
      case 'Secondaire':
        return 'from-purple-100 to-purple-300';
      default:
        return 'from-gray-100 to-gray-300';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 min-h-screen items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Bienvenue sur Gestion CS ETOILE MUGUNGA</h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-muted-foreground py-4 max-w-2xl mx-auto">
            Sélectionnez une école pour accéder à son tableau de bord et gérer ses informations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
          {schools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleSchoolSelect(getSchoolType(school.name))}
            >
              <div className={`h-48 bg-gradient-to-br ${getGradientColors(school.name)} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path
                      d="M18 4c-1.1 0-2 .9-2 2v4H8V6c0-1.1-.9-2-2-2s-2 .9-2 2v14a2 2 0 0 0 4 0v-4h8v4c0 1.1.9 2 2 2s2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{school.name}</h2>
                <p className="text-muted-foreground mb-4">Description spécifique à {school.name}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {school.classCount} {school.classCount > 1 ? 'classes' : 'classe'}
                  </span>
                  <span className="text-sm text-muted-foreground">{school.studentCount} élèves</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <SchoolYearSummary />
            <SchoolYearSelector onYearChange={handleYearChange} />
          </div>

          <p className="text-muted-foreground mb-4">Vous pouvez également accéder directement aux paramètres généraux</p>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Paramètres
          </button>
        </motion.div>

      </div>
    </Layout>
  );
};

export default Index;
