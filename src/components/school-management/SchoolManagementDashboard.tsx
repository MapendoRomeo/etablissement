import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, School, Users, GraduationCap, Eye } from 'lucide-react';
import { Class, StudentData, SchoolType } from '@/types/user';
import AddClassModal from '../class-management/AddClassModal';
import AddStudentModal from '../student-management/AddStudentModal';
import ClassDetailModal from '../class-management/ClassDetailModal';
import SecondaryOptionsManager from '../class-management/SecondaryOptionsManager';
import { validateStudentName } from '@/utils/validationUtils';
import { toast } from 'sonner';
import { useSchools } from '@/hooks/useSchools';
import { addStudent } from '@/services/schoolManagementService';  

interface SchoolManagementDashboardProps {
  classes: Class[];
  students: StudentData[];
  onAddClass: (classData: Omit<Class, 'id'>) => void;
  onAddStudent: (studentData: Omit<StudentData, 'id'>) => void;
  onDeleteStudent: (studentId: string) => void
}

const SchoolManagementDashboard: React.FC<SchoolManagementDashboardProps> = ({
  classes,
  students,
  onAddClass,
  onAddStudent,
  onDeleteStudent
}) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType>('Primaire');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [localStudents, setLocalStudents] = useState<StudentData[]>(students);

  const getSchoolStats = (school: SchoolType) => {
    const schoolClasses = classes.filter(c => c.school === school);
    const schoolStudents = students.filter(s => s.school === school);
    
    return {
      classCount: schoolClasses.length,
      studentCount: schoolStudents.length,
      paidStudents: schoolStudents.filter(s => s.resteAPayer === 0).length
    };
  };

  const handleAddClass = (classData: Omit<Class, 'id'>) => {
    onAddClass(classData);
    setShowAddClass(false);
    toast.success(`Classe ${classData.name} créée avec succès`);
  };

  const handleAddStudent = (studentData: Omit<StudentData, 'id'>) => {
    // Valider que l'élève n'existe pas déjà dans cette classe
    const validation = validateStudentName(
      studentData.name,
      studentData.class,
      studentData.school,
      localStudents
    );

    if (!validation.isValid) {
      toast.error(validation.error || 'Erreur lors de l\'ajout de l\'élève');
      return;
    }

    onAddStudent(studentData);
    setLocalStudents(students)
    setShowAddStudent(false);
    toast.success(`Élève ${studentData.name} ajouté avec succès`);
  };

 

const handleImportStudents = async (importedStudents: Omit<StudentData, 'id'>[]) => {
  const errors: string[] = [];
  
  for (const student of importedStudents) {
    const validation = validateStudentName(
      student.name,
      student.class,
      student.school,
      localStudents
    );

    if (!validation.isValid) {
      errors.push(`${student.name}: ${validation.error}`);
      continue;
    }
    const schoolYearId = localStorage.getItem('selectedYearId');
    
    const payload = {
      name: student.name,
      class: student.class, 
      school: student.school,
      option: student.option,
      schoolYearId: schoolYearId,
      tuition: 0,
      paid: student.paid ?? 0,
      resteAPayer: 0,
    };
    onAddStudent(payload);
    setLocalStudents(students)
  }

  if (errors.length > 0) {
    toast.error(`${errors.length} erreurs lors de l'importation`);
  }
};


  const handleViewClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowClassDetail(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    onDeleteStudent(studentId);
  };
  const SchoolOverview: React.FC<{ school: SchoolType }> = ({ school }) => {
    const stats = getSchoolStats(school);
    const schoolClasses = classes.filter(c => c.school === school);
    const schoolName = school === 'Maternelle' ? 'maternelle' : school === 'Primaire' ? 'primaire' : 'secondaire';

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">École {schoolName}</h2>
            <p className="text-muted-foreground">Gestion des classes et des élèves</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setSelectedSchool(school); setShowAddStudent(true); }}>
              <Users className="h-4 w-4 mr-2" />
              Ajouter élève
            </Button>
            <Button onClick={() => { setSelectedSchool(school); setShowAddClass(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle classe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.classCount}</div>
              <p className="text-xs text-muted-foreground">Classes créées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Élèves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studentCount}</div>
              <p className="text-xs text-muted-foreground">Élèves inscrits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4" />
                Paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidStudents}</div>
              <p className="text-xs text-muted-foreground">Élèves à jour</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolClasses.map(classItem => {
            const classStudents = students.filter(s => s.class === classItem.name && s.school === school);
            const paidStudents = classStudents.filter(s => s.resteAPayer === 0);
            
            return (
              <Card key={classItem.name} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{classItem.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Élèves:</span>
                    <span className="font-medium">{classStudents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Paiements à jour:</span>
                    <Badge variant={paidStudents.length === classStudents.length ? "secondary" : "destructive"}>
                      {paidStudents.length}/{classStudents.length}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewClass(classItem)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir détails
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSchool(school); 
                        setShowAddStudent(true); 
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {schoolClasses.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">Aucune classe créée pour cette école</p>
                <Button onClick={() => { setSelectedSchool(school); setShowAddClass(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première classe
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="Primaire" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Maternelle">Maternelle</TabsTrigger>
          <TabsTrigger value="Primaire">Primaire</TabsTrigger>
          <TabsTrigger value="Secondaire">Secondaire</TabsTrigger>
        </TabsList>

        <TabsContent value="Maternelle">
          <SchoolOverview school="Maternelle" />
        </TabsContent>

        <TabsContent value="Primaire">
          <SchoolOverview school="Primaire" />
        </TabsContent>

        <TabsContent value="Secondaire">
          <SecondaryOptionsManager
            classes={classes}
            students={students}
            onAddClass={handleAddClass}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onImportStudents={handleImportStudents}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddClassModal
        open={showAddClass}
        onOpenChange={setShowAddClass}
        schoolType={selectedSchool}
        onSubmit={handleAddClass}
      />

      <AddStudentModal
        open={showAddStudent}
        onOpenChange={setShowAddStudent}
        schoolType={selectedSchool}
        classes={classes}
        onSubmit={handleAddStudent}
      />

      <ClassDetailModal
        open={showClassDetail}
        onOpenChange={setShowClassDetail}
        classData={selectedClass}
        students={students}
        onAddStudent={() => {
          setShowClassDetail(true);
          setShowAddStudent(true);
        }}
        onDeleteStudent={handleDeleteStudent}
        onImportStudents={handleImportStudents}
      />
    </div>
  );
};

export default SchoolManagementDashboard;
