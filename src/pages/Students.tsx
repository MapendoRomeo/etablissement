
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StudentList from '../components/StudentList';

const Students: React.FC = () => {
  const { schoolType } = useParams<{ schoolType: string }>();
  const navigate = useNavigate();
  
  
  // Valider le type d'école
  useEffect(() => {
    if (schoolType !== 'maternelle' && schoolType !== 'primaire' && schoolType !== 'secondaire') {
      navigate('/');
    }
  }, [schoolType, navigate]);
  
  if (!schoolType || (schoolType !== 'maternelle' && schoolType !== 'primaire' && schoolType !== 'secondaire')) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Élèves - 
            {schoolType === 'maternelle' ? ' École maternelle' : 
             schoolType === 'primaire' ? ' École primaire' : ' École secondaire'}
          </h1>
          <button
            onClick={() => navigate(`/dashboard/${schoolType}`)}
            className="button-outline flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour au tableau de bord
          </button>
        </div>
        
        <StudentList selectedSchool={schoolType as 'maternelle' | 'primaire' | 'secondaire'} />
      </div>
    </Layout>
  );
};

export default Students;
