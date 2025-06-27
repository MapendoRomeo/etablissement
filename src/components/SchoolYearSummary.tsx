
import React from 'react';
import { useSchoolYear } from '@/hooks/useSchoolYear';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, School, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SchoolYearSummary: React.FC = () => {
  const { activeSchoolYear, loading, error, refetch } = useSchoolYear();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getCurrentTerm = () => {
    if (!activeSchoolYear || !activeSchoolYear.terms.length) {
      return null;
    }
    
    const now = new Date();
    
    const currentTerm = activeSchoolYear.terms.find(term => {
      const startDate = new Date(term.startDate);
      const endDate = new Date(term.endDate);
      const isCurrentTerm = now >= startDate && now <= endDate;
      return isCurrentTerm;
    });
    return currentTerm;
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const currentTerm = getCurrentTerm();
  
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Année scolaire en cours
          </CardTitle>
          {!loading && (
            <Button variant="ghost" size="sm" onClick={handleRefresh} title="Actualiser">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>Informations sur l'année scolaire actuelle</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">Une erreur est survenue lors du chargement des données</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        ) : !activeSchoolYear ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucune année scolaire active</p>
            <p className="text-xs mt-2">
              Configurez une nouvelle année scolaire dans les paramètres
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Vérifier à nouveau
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium text-lg">{activeSchoolYear.name}</h3>
              <p className="text-sm text-muted-foreground">
                Du {formatDate(activeSchoolYear.startDate)} au {formatDate(activeSchoolYear.endDate)}
              </p>
            </div>
            
            {currentTerm && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Trimestre actuel : {currentTerm.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Du {formatDate(currentTerm.startDate)} au {formatDate(currentTerm.endDate)}
                </p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-2">Trimestres :</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {activeSchoolYear.terms.map((term) => (
                  <div 
                    key={String(term.id)} 
                    className={`p-2 text-xs border rounded ${currentTerm && currentTerm.id === term.id ? 'bg-primary/10 border-primary/30' : ''}`}
                  >
                    <p className="font-medium">{term.name}</p>
                    <p className="text-muted-foreground mt-1">
                      {formatDate(term.startDate)} - {formatDate(term.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolYearSummary;
