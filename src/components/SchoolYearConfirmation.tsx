import React from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SchoolType } from '@/types/user';
import { transformSchoolYearPayload } from '@/utils/transformSchoolYear'; // ⬅️ Importe ici la fonction de transformation
import instance from '@/api/axios';

export interface SchoolYearConfirmationProps {
  schoolYearData: {
    schoolYear: string;
    startDate: string;
    endDate: string;
    terms: {
      id: string;
      name: string;
      startDate: string;
      endDate: string;
    }[];
    feeCategories: {
      id: string;
      name: string;
      currency: 'USD' | 'CDF';
      frequency: 'one-time' | 'monthly' | 'term' | 'yearly';
      feesByClass: {
        classId: string;
        termFees: {
          term1: number;
          term2: number;
          term3: number;
        };
      }[];
    }[];
    additionalFees: {
      name: string;
      description: string;
      amount: number;
      currency: 'USD' | 'CDF';
      frequency: 'one-time' | 'monthly' | 'term' | 'yearly';
      school: SchoolType;
      paymentDeadline: string;
    }[];
  };
  classes: Array<{ id: string; name: string; school: string | SchoolType }>;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const SchoolYearConfirmation: React.FC<SchoolYearConfirmationProps> = ({
  schoolYearData,
  classes,
  onConfirm,
  onBack,
  isSubmitting
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getClassNameById = (id: string) => {
    return classes.find(c => c.id === id)?.name || 'Classe inconnue';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount} ${currency}`;
  };

  const handleConfirm = async () => {
    try {
      const transformedData = transformSchoolYearPayload(schoolYearData);

      await instance.post('/schools', transformedData);
      onConfirm(); 
    } catch (error) {
    }
  };

  const getSchoolName = (school: SchoolType) => {
    switch (school) {
      case 'Maternelle':
        return 'maternelle';
      case 'Primaire':
        return 'primaire';
      case 'Secondaire':
        return 'secondaire';
      default:
        return school;
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle>Récapitulatif de l'année scolaire</CardTitle>
        <CardDescription>
          Veuillez vérifier toutes les informations avant de confirmer la création de l'année scolaire
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Infos générales */}
        <div>
          <h3 className="text-lg font-semibold">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-muted-foreground">Année scolaire</p>
              <p className="font-medium">{schoolYearData.schoolYear}</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-muted-foreground">Date de début</p>
              <p className="font-medium">{formatDate(schoolYearData.startDate)}</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
              <p className="font-medium">{formatDate(schoolYearData.endDate)}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trimestres */}
        <div>
          <h3 className="text-lg font-semibold">Trimestres</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {schoolYearData.terms.map((term, index) => (
              <div key={index} className="border rounded-md p-3">
                <h4 className="font-semibold">{term.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Du {formatDate(term.startDate)} au {formatDate(term.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Catégories de frais */}
        <div>
          <h3 className="text-lg font-semibold">Catégories de frais</h3>
          <div className="space-y-4 mt-2">
            {schoolYearData.feeCategories.map((category, catIndex) => (
              <div key={catIndex} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{category.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category.currency}</Badge>
                    <Badge variant="secondary">
                      {category.frequency === 'one-time' && 'Unique'}
                      {category.frequency === 'monthly' && 'Mensuel'}
                      {category.frequency === 'term' && 'Trimestriel'}
                      {category.frequency === 'yearly' && 'Annuel'}
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-2 text-left">Classe</th>
                        <th className="py-2 px-2 text-right">1er Trimestre</th>
                        <th className="py-2 px-2 text-right">2e Trimestre</th>
                        <th className="py-2 px-2 text-right">3e Trimestre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.feesByClass.map((classFee, feeIndex) => (
                        <tr key={feeIndex} className="border-b border-muted">
                          <td className="py-2 px-2">{getClassNameById(classFee.classId)}</td>
                          <td className="py-2 px-2 text-right">
                            {formatCurrency(classFee.termFees.term1, category.currency)}
                          </td>
                          <td className="py-2 px-2 text-right">
                            {formatCurrency(classFee.termFees.term2, category.currency)}
                          </td>
                          <td className="py-2 px-2 text-right">
                            {formatCurrency(classFee.termFees.term3, category.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frais additionnels */}
        {schoolYearData.additionalFees.length > 0 && (
          <>
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold">Frais additionnels</h3>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2 text-left">Nom</th>
                      <th className="py-2 px-2 text-left">Description</th>
                      <th className="py-2 px-2 text-left">École</th>
                      <th className="py-2 px-2 text-right">Montant</th>
                      <th className="py-2 px-2 text-center">Fréquence</th>
                      <th className="py-2 px-2 text-center">Échéance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolYearData.additionalFees.map((fee, index) => (
                      <tr key={index} className="border-b border-muted">
                        <td className="py-2 px-2 font-medium">{fee.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{fee.description}</td>
                        <td className="py-2 px-2">
                          <Badge variant="outline">{getSchoolName(fee.school)}</Badge>
                        </td>
                        <td className="py-2 px-2 text-right">{formatCurrency(fee.amount, fee.currency)}</td>
                        <td className="py-2 px-2 text-center">
                          <Badge variant="outline">
                            {fee.frequency === 'one-time' && 'Unique'}
                            {fee.frequency === 'monthly' && 'Mensuel'}
                            {fee.frequency === 'term' && 'Trimestriel'}
                            {fee.frequency === 'yearly' && 'Annuel'}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-center text-sm text-muted-foreground">
                          {formatDate(fee.paymentDeadline)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Retour</Button>
        <Button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement en cours..." : "Confirmer et enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchoolYearConfirmation;
