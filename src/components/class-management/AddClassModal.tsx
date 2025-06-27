import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Class, SchoolType } from '@/types/user';
import { validateClassName, formatClassNameWithOption } from '@/utils/validationUtils';
import { useSchoolManagement } from '@/hooks/useSchoolManagement';
import instance from '@/api/axios';

interface AddClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolType: SchoolType;
  onSubmit: (classData: Omit<Class, 'id'> & { option?: string }) => void;
  isSubmitting?: boolean;
}

interface SchoolOption {
  id: string;
  name: string;
}

interface SchoolStructureResponse {
  school: string;
  classes: string[];
  options: SchoolOption[];
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  open,
  onOpenChange,
  schoolType,
  onSubmit,
  isSubmitting = false
}) => {
  const { classes } = useSchoolManagement();
  const [formData, setFormData] = useState({
    name: '',
    selectedOption: ''
  });
  const [validationError, setValidationError] = useState<string>('');
  const [schoolStructure, setSchoolStructure] = useState<SchoolStructureResponse | null>(null);

  useEffect(() => {
    const fetchSchoolStructure = async () => {
      try {
        const response = await instance.get<SchoolStructureResponse>('/school/structure/Secondaire');
        setSchoolStructure(response.data);
      } catch (error) {
      }
    };
    fetchSchoolStructure();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleOptionSelect = (option: string) => {
    setFormData(prev => ({ ...prev, selectedOption: option }));
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  let finalClassName = formData.name;

  if (schoolType === 'Secondaire') {
    finalClassName = formatClassNameWithOption(formData.name, formData.selectedOption);
  }

  const validation = validateClassName(
    finalClassName,
    schoolType,
    classes,
    schoolType === 'Secondaire' ? formData.selectedOption : undefined
  );

  if (!validation.isValid) {
    setValidationError(validation.error || 'Erreur de validation');
    return;
  }

  // Construction de la payload à envoyer
  const payload: {
    name: string;
    school: SchoolType;
    options?: string[];
  } = {
    name: finalClassName,
    school: schoolType,
  };

  if (schoolType === 'Secondaire' && formData.selectedOption) {
    payload.options = [formData.selectedOption]; // ← C'est l'id ici
  }

  // Appel de la fonction de soumission
  onSubmit(payload);
};



  const resetForm = () => {
    setFormData({ name: '', selectedOption: '' });
    setValidationError('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Ajouter une classe - {schoolType}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la classe</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: 6ème, 5ème, etc."
              required
            />
          </div>

          {schoolType === 'Secondaire' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Option de la classe</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Chaque classe ne peut avoir qu'une seule option
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sélectionner une option *</Label>
                  <Select value={formData.selectedOption} onValueChange={handleOptionSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une option" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolStructure?.options.map(option => (
                        <SelectItem key={option?.id} value={option?.name}>
                          {option?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.selectedOption && (
                  <div className="space-y-2">
                    <Label>Aperçu du nom final</Label>
                    <Badge variant="outline" className="px-3 py-1">
                      {formatClassNameWithOption(formData.name || 'Nom de classe', formData.selectedOption)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer la classe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
