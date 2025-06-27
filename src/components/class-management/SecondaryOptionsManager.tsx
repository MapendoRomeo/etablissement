
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Users, GraduationCap, Eye } from 'lucide-react';
import { Class, StudentData } from '@/types/user';
import AddClassModal from './AddClassModal';
import AddStudentModal from '../student-management/AddStudentModal';
import ClassDetailModal from './ClassDetailModal';
import { getOptionFromClassName } from '@/utils/validationUtils';

interface SecondaryOptionsManagerProps {
  classes: Class[];
  students: StudentData[];
  onAddClass: (classData: Omit<Class, 'id'> & { options?: string[] }) => void;
  onAddStudent: (studentData: Omit<StudentData, 'id'>) => void;
  onDeleteStudent?: (studentId: string) => void;
  onImportStudents?: (students: Omit<StudentData, 'id'>[]) => void;
}

const SecondaryOptionsManager: React.FC<SecondaryOptionsManagerProps> = ({
  classes,
  students,
  onAddClass,
  onAddStudent,
  onDeleteStudent,
  onImportStudents
}) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const secondaryClasses = classes.filter(c => c.school === 'Secondaire');
  
  // Grouper les classes par option
  const classesByOption = secondaryClasses.reduce((acc, classItem) => {
    const option = getOptionFromClassName(classItem.name);
    
    if (!acc[option]) {
      acc[option] = [];
    }
    acc[option].push(classItem);
    return acc;
  }, {} as Record<string, Class[]>);

  const getStudentsInClass = (className: string) => {
    return students.filter(s => s.class === className && s.school === 'Secondaire');
  };

  const getOptionStats = (option: string) => {
    const optionClasses = classesByOption[option] || [];
    const totalStudents = optionClasses.reduce((total, classItem) => {
      return total + getStudentsInClass(classItem.name).length;
    }, 0);
    
    return {
      classCount: optionClasses.length,
      studentCount: totalStudents
    };
  };

  const handleViewClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowClassDetail(true);
  };

  const handleAddStudentToClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowAddStudent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion du Secondaire</h2>
          <p className="text-muted-foreground">Organisez les classes par options et gérez les élèves</p>
        </div>
        <Button onClick={() => setShowAddClass(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle classe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(classesByOption).map(([option, optionClasses]) => {
          const stats = getOptionStats(option);
          
          return (
            <Card key={option} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {stats.classCount} classes
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {stats.studentCount} élèves
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {optionClasses.map(classItem => {
                  const classStudents = getStudentsInClass(classItem.name);
                  const paidStudents = classStudents.filter(s => s.resteAPayer === 0);
                  
                  return (
                    <div key={classItem.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{classItem.name}</h4>
                        <Badge variant="outline">
                          {classStudents.length} élèves
                        </Badge>
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
                          onClick={() => handleViewClass(classItem)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAddStudentToClass(classItem)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                      
                      {classStudents.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Derniers ajouts: {classStudents.slice(-2).map(s => s.name).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {optionClasses.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    Aucune classe dans cette option
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {Object.keys(classesByOption).length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune classe créée</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer des classes avec leurs options pour organiser le secondaire
              </p>
              <Button onClick={() => setShowAddClass(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer la première classe
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddClassModal
        open={showAddClass}
        onOpenChange={setShowAddClass}
        schoolType="Secondaire"
        onSubmit={onAddClass}
      />

      <AddStudentModal
        open={showAddStudent}
        onOpenChange={setShowAddStudent}
        schoolType="Secondaire"
        classes={classes}
        onSubmit={onAddStudent}
      />

      <ClassDetailModal
        open={showClassDetail}
        onOpenChange={setShowClassDetail}
        classData={selectedClass}
        students={students}
        onAddStudent={() => {
          setShowClassDetail(false);
          setShowAddStudent(true);
        }}
        onDeleteStudent={onDeleteStudent || (() => {})}
        onImportStudents={onImportStudents || (() => {})}
      />
    </div>
  );
};

export default SecondaryOptionsManager;
