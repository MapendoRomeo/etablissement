import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import instance from '@/api/axios';
import { toast } from 'sonner';

interface SchoolYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface SchoolYearSelectorProps {
  onYearChange?: (yearId: string) => void;
}

const SchoolYearSelector: React.FC<SchoolYearSelectorProps> = ({ onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);

  useEffect(() => {
  const fetchSchoolYears = async () => {
    try {
      const response = await instance.get<SchoolYear[]>('/schools');
      const years = response.data;
      setSchoolYears(years);

      // Vérifie si une année est déjà enregistrée dans le localStorage
      const savedYearId = localStorage.getItem('selectedSchoolYear');
      const savedYear = years.find((year) => year.id === savedYearId);

      if (savedYear) {
        setSelectedYear(savedYear.id);
        onYearChange?.(savedYear.id);
      } else {
        // Sinon, on prend l’année active
        const activeYear = years.find((year) => year.isActive);
        if (activeYear) {
          setSelectedYear(activeYear.id);
          localStorage.setItem('selectedSchoolYear', activeYear.id);
          onYearChange?.(activeYear.id);
        }
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des années scolaires");
    }
  };

  fetchSchoolYears();
}, [onYearChange]);


  const handleYearChange = (yearId: string) => {
    setSelectedYear(yearId);
    localStorage.setItem('selectedSchoolYear', yearId);
    onYearChange?.(yearId);
   };

  const currentYear = schoolYears.find((year) => year.id === selectedYear);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Année Académique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une année académique" />
          </SelectTrigger>
          <SelectContent>
            {schoolYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{year.name}</span>
                  {year.isActive && (
                    <Badge variant="secondary" className="ml-2">
                      <Check className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentYear && (
          <div className="text-sm text-muted-foreground">
            <p>
              Période :{' '}
              {new Date(currentYear.startDate).toLocaleDateString('fr-FR')} -{' '}
              {new Date(currentYear.endDate).toLocaleDateString('fr-FR')}
            </p>
            {currentYear.isActive && (
              <Badge variant="outline" className="mt-2">
                Année en cours
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolYearSelector;
