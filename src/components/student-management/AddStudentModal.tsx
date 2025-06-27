
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, DollarSign } from 'lucide-react';
import { StudentData, SchoolType, Class } from '@/types/user';
import { fetchTuitionTotal } from '@/services/schoolManagementService';

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolType: SchoolType;
  classes: Class[];
  onSubmit: (studentData: Omit<StudentData, 'id'>) => void;
  isSubmitting?: boolean;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  open,
  onOpenChange,
  schoolType,
  classes,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    tuition: schoolType === 'Maternelle' ? 300 : schoolType === 'Primaire' ? 350 : 450,
    paid: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['tuition', 'paid'].includes(name) ? Number(value) : value
    }));
  };

  const handleClassChange = async (className: string) => {
  setFormData(prev => ({ ...prev, class: className }));
  const schoolYearId = localStorage.getItem('selectedYearId');
  if (!schoolYearId) return;

  try {
    const totalTuition = await fetchTuitionTotal(className, schoolYearId);
    setFormData(prev => ({
      ...prev,
      class: className,
      tuition: totalTuition
    }));
  } catch (error) {
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      class: formData.class,
      school: schoolType,
      tuition: formData.tuition,
      paid: formData.paid,
      resteAPayer: formData.tuition - formData.paid
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      tuition: schoolType === 'Maternelle' ? 300 : schoolType === 'Primaire' ? 350 : 450,
      paid: 0
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const schoolClasses = classes.filter(c => c.school === schoolType);
  const remainingAmount = formData.tuition - formData.paid;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ajouter un élève - {schoolType === 'Maternelle' ? 'maternelle' : schoolType === 'Primaire' ? 'primaire' : 'secondaire'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet de l'élève</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ex: Jean Dupont"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Classe</Label>
              <Select value={formData.class} onValueChange={handleClassChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {schoolClasses.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-green-600" />
                <Label className="text-lg font-medium">Informations financières</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tuition">Frais de scolarité (USD)</Label>
                  <Input
                    id="tuition"
                    name="tuition"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.tuition}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paid">Montant déjà payé (USD)</Label>
                  <Input
                    id="paid"
                    name="paid"
                    type="number"
                    min="0"
                    max={formData.tuition}
                    step="1"
                    value={formData.paid}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Reste à payer:</span>
                <Badge variant={remainingAmount > 0 ? "destructive" : "secondary"} className="text-sm">
                  {remainingAmount} USD
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.class}>
              {isSubmitting ? 'Ajout...' : 'Ajouter l\'élève'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
