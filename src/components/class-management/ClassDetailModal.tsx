
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, UserPlus, Upload, Trash2 } from 'lucide-react';
import { Class, StudentData, SchoolType } from '@/types/user';
import StudentCSVImport from './StudentCSVImport';

interface ClassDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class | null;
  students: StudentData[];
  onAddStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
  onImportStudents: (students: Omit<StudentData, 'id'>[]) => void;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  open,
  onOpenChange,
  classData,
  students,
  onAddStudent,
  onDeleteStudent,
  onImportStudents
}) => {
  const [deletingStudent, setDeletingStudent] = useState<{ id: string; name: string } | null>(null);
  const [showCSVImport, setShowCSVImport] = useState(false);

  if (!classData) return null;

  const classStudents = students.filter(s => s.class === classData.name && s.school === classData.school);
  const totalStudents = classStudents.length;
  const paidStudents = classStudents.filter(s => s.resteAPayer === 0).length;
  const totalDue = classStudents.reduce((sum, s) => sum + s.resteAPayer, 0);

  const handleDeleteStudent = (student: StudentData) => {
    setDeletingStudent({ id: student.id, name: student.name });
  };

  const confirmDelete = () => {
    if (deletingStudent) {
      onDeleteStudent(deletingStudent.id);
      setDeletingStudent(null);
    }
  };

  const handleCSVImport = (importedStudents: Omit<StudentData, 'id'>[]) => {
    onImportStudents(importedStudents);
    setShowCSVImport(false);
  };

  const getSchoolName = (school: SchoolType) => {
    switch (school) {
      case 'Maternelle': return 'maternelle';
      case 'Primaire': return 'primaire';
      case 'Secondaire': return 'secondaire';
      default: return school;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {classData.name} - {getSchoolName(classData.school)}
            </DialogTitle>
            <DialogDescription>
              Gestion des élèves de la classe
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Statistiques de la classe */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total élèves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Paiements à jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{paidStudents}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">En retard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{totalStudents - paidStudents}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total dû</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDue} USD</div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Liste des élèves</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCSVImport(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button onClick={onAddStudent}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter élève
                </Button>
              </div>
            </div>

            {/* Liste des élèves */}
            {classStudents.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom complet</TableHead>
                      <TableHead className="text-right">Frais scolaires</TableHead>
                      <TableHead className="text-right">Payé</TableHead>
                      <TableHead className="text-right">Reste à payer</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student, key) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-right">{student.tuition} USD</TableCell>
                        <TableCell className="text-right">{student.paid} USD</TableCell>
                        <TableCell className="text-right">{student.resteAPayer} USD</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={student.resteAPayer === 0 ? "secondary" : "destructive"}>
                            {student.resteAPayer === 0 ? "À jour" : "En retard"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteStudent(student)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">Aucun élève dans cette classe</p>
                  <Button onClick={onAddStudent}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter le premier élève
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Modal */}
      <StudentCSVImport
        open={showCSVImport}
        onOpenChange={setShowCSVImport}
        classData={classData}
        onImport={handleCSVImport}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingStudent} onOpenChange={() => setDeletingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'élève</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'élève "{deletingStudent?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClassDetailModal;
