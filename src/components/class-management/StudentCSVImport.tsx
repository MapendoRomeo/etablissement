
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Class, StudentData } from '@/types/user';
import { toast } from 'sonner';

interface StudentCSVImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class;
  onImport: (students: Omit<StudentData, 'id'>[]) => void;
}

interface CSVStudent {
  nom: string;
  postNom: string;
  prenom: string;
  fraisPaye: number;
}

const StudentCSVImport: React.FC<StudentCSVImportProps> = ({
  open,
  onOpenChange,
  classData,
  onImport
}) => {
  const [csvData, setCsvData] = useState<CSVStudent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = ['nom', 'postNom', 'prenom', 'fraisPaye'];
    const exampleData = [
      ['Dupont', 'Jean', 'Pierre', '150'],
      ['Martin', 'Marie', 'Claire', '500'],
      ['Durand', 'Paul', 'Antoine', '0']
    ];

    const csvContent = [
      headers.join(','),
      ...exampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modele_eleves.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (content: string): CSVStudent[] => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Vérifier les en-têtes requis
    const requiredHeaders = ['nom', 'postnom', 'prenom', 'fraispaye'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Colonnes manquantes: ${missingHeaders.join(', ')}`);
    }

    const data: CSVStudent[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        throw new Error(`Ligne ${i + 1}: nombre de colonnes incorrect`);
      }

      const student: CSVStudent = {
        nom: values[headers.indexOf('nom')] || '',
        postNom: values[headers.indexOf('postnom')] || '',
        prenom: values[headers.indexOf('prenom')] || '',
        fraisPaye: parseFloat(values[headers.indexOf('fraispaye')] || '0')
      };

      // Validation basique
      if (!student.nom.trim() || !student.prenom.trim()) {
        throw new Error(`Ligne ${i + 1}: nom et prénom sont requis`);
      }

      if (isNaN(student.fraisPaye) || student.fraisPaye < 0) {
        throw new Error(`Ligne ${i + 1}: frais payé doit être un nombre positif`);
      }

      data.push(student);
    }

    return data;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Veuillez sélectionner un fichier CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = parseCSV(content);
        setCsvData(parsedData);
        setErrors([]);
        setIsValid(true);
        toast.success(`${parsedData.length} élèves trouvés dans le fichier`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la lecture du fichier';
        setErrors([errorMessage]);
        setCsvData([]);
        setIsValid(false);
        toast.error(errorMessage);
      }
    };

    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = () => {
    if (!isValid || csvData.length === 0) return;

    const students: Omit<StudentData, 'id'>[] = csvData.map(csvStudent => ({
      name: `${csvStudent.nom} ${csvStudent.postNom} ${csvStudent.prenom}`.trim(),
      class: classData.name,
      school: classData.school,
      tuition: 350, // Frais par défaut, à ajuster selon votre logique
      paid: csvStudent.fraisPaye,
      resteAPayer: Math.max(0, 350 - csvStudent.fraisPaye)
    }));

    onImport(students);
    setCsvData([]);
    setErrors([]);
    setIsValid(false);
    toast.success(`${students.length} élèves importés avec succès`);
  };

  const reset = () => {
    setCsvData([]);
    setErrors([]);
    setIsValid(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) reset();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import d'élèves par CSV
          </DialogTitle>
          <DialogDescription>
            Importez plusieurs élèves à la fois dans la classe {classData.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Téléchargez le modèle CSV en cliquant sur le bouton ci-dessous</p>
              <p>2. Remplissez le fichier avec les données des élèves</p>
              <p>3. Colonnes requises: nom, postNom, prenom, fraisPaye</p>
              <p>4. Uploadez le fichier complété</p>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger le modèle
              </Button>
            </CardContent>
          </Card>

          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sélectionner le fichier CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <FileText className="h-4 w-4 mr-2" />
                      Choisir un fichier CSV
                    </span>
                  </Button>
                </label>
                {csvData.length > 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{csvData.length} élèves prêts à importer</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Erreurs */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Aperçu des données */}
          {csvData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Aperçu des élèves à importer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead className="text-right">Frais payés</TableHead>
                        <TableHead className="text-right">Reste à payer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((student, index) => {
                        const fullName = `${student.nom} ${student.postNom} ${student.prenom}`.trim();
                        const resteAPayer = Math.max(0, 350 - student.fraisPaye);
                        return (
                          <TableRow key={index}>
                            <TableCell>{fullName}</TableCell>
                            <TableCell>{classData.name}</TableCell>
                            <TableCell className="text-right">{student.fraisPaye} USD</TableCell>
                            <TableCell className="text-right">{resteAPayer} USD</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!isValid || csvData.length === 0}
          >
            Importer {csvData.length} élève{csvData.length > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentCSVImport;
