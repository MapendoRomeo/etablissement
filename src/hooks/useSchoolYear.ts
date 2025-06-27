
import { useState, useEffect } from 'react';
import { SchoolYear, Class, SchoolType } from '@/types/user';
import { toast } from 'sonner';
import { getActiveSchoolYear } from '@/services/schoolYearService';

export const useSchoolYear = () => {
  const [activeSchoolYear, setActiveSchoolYear] = useState<SchoolYear | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean, message: string } | null>(null);
  


  const fetchActiveSchoolYear = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = true;
      const schoolYear = await getActiveSchoolYear();
      setActiveSchoolYear(schoolYear);
      
      if (!isConnected) {
        setError(`Erreur de connexion à la base de données: ${connectionStatus?.message}`);
        toast.error("Impossible de se connecter à la base de données");
        setLoading(false);
        return;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError('Erreur lors de la récupération des données de l\'année scolaire: ' + errorMessage);
      toast.error('Erreur de chargement des données');
      // Définir un tableau vide en cas d'erreur
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSchoolYear();
  }, []);

  return {
    activeSchoolYear,
    classes,
    loading,
    error,
    connectionStatus,
    refetch: fetchActiveSchoolYear
  };
};
