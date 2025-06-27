
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DashboardComponent from '../components/Dashboard';

const Dashboard: React.FC = () => {
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
      <DashboardComponent 
        selectedSchool={schoolType as 'maternelle' | 'primaire' | 'secondaire'} 
        onSelectSchool={(school) => navigate(`/dashboard/${school}`)}
      />
    </Layout>
  );
};

export default Dashboard;
