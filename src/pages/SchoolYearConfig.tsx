import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SchoolYearConfirmation from '../components/SchoolYearConfirmation';
import { CalendarRange, ChevronLeft, ChevronRight, CheckCircle, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { FeeCategory, TermFees, SchoolType } from '../types/user';
import useClasses from '@/hooks/useClasses';

interface FormData {
  schoolYear: string;
  startDate: string;
  endDate: string;
  terms: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  }[];
  feeCategories: FeeCategory[];
  additionalFees: {
    id: string;
    name: string;
    description: string;
    amount: number;
    currency: 'USD' | 'CDF';
    frequency: 'one-time' | 'monthly' | 'term' | 'yearly';
    school: SchoolType;
    paymentDeadline: string;
  }[];
}

const defaultTerms = [
  { id: '1', name: '1er trimestre', startDate: '', endDate: '' },
  { id: '2', name: '2e trimestre', startDate: '', endDate: '' },
  { id: '3', name: '3e trimestre', startDate: '', endDate: '' },
];

const defaultAdditionalFees = [
  { 
    id: '1',
    name: 'Frais connexe', 
    description: 'Description du frais connexe', 
    amount: 0, 
    currency: 'USD' as const, 
    frequency: 'one-time' as const,
    school: 'Maternelle' as SchoolType,
    paymentDeadline: ''
  },
];

const getSchoolName = (school: SchoolType) => {
  switch (school) {
    case 'Maternelle': return 'maternelle';
    case 'Primaire': return 'primaire';
    case 'Secondaire': return 'secondaire';
    default: return school;
  }
};

const SchoolYearConfig: React.FC = () => {
  const { classesList, loading, defaultFeeCategories } = useClasses();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    schoolYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    startDate: '',
    endDate: '',
    terms: defaultTerms,
    feeCategories: defaultFeeCategories,
    additionalFees: defaultAdditionalFees,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleTermChange = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      terms: formData.terms.map(term => 
        term.id === id ? { ...term, [field]: value } : term
      ),
      feeCategories: defaultFeeCategories,
    });
  };
  
  const handleFeeByClassTermChange = (feeId: string, classId: string, term: keyof TermFees, value: string) => {
    setFormData({
      ...formData,
      feeCategories: formData.feeCategories.map(fee => 
        fee.id === feeId ? {
          ...fee,
          feesByClass: fee.feesByClass.map(classFee => 
            classFee.classId === classId ? { 
              ...classFee,
              termFees: {
                ...classFee.termFees,
                [term]: parseFloat(value) || 0
              }
            } : classFee
          )
        } : fee
      ),
    });
  };

  const handleFeeCategoryChange = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      feeCategories: formData.feeCategories.map(fee => 
        fee.id === id ? { ...fee, [field]: value } : fee
      ),
    });
  };
  
  const handleAdditionalFeeChange = (id: string, field: string, value: string | number) => {
    setFormData({
      ...formData,
      additionalFees: formData.additionalFees.map(fee => 
        fee.id === id ? { ...fee, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value } : fee
      ),
    });
  };
  
  const addFeeCategory = () => {
    const newId = (parseInt(Math.max(...formData.feeCategories.map(cat => parseInt(cat.id))).toString()) + 1).toString();
    
    setFormData({
      ...formData,
      feeCategories: [
        ...formData.feeCategories,
        { 
          id: newId, 
          name: '', 
          feesByClass: classesList.map(c => ({ 
            classId: c.id, 
            termFees: { term1: 0, term2: 0, term3: 0 } 
          })), 
          currency: 'USD', 
          frequency: 'term' 
        }
      ],
    });
  };
  
  const removeFeeCategory = (id: string) => {
    setFormData({
      ...formData,
      feeCategories: formData.feeCategories.filter(cat => cat.id !== id),
    });
  };
  
  const addAdditionalFee = () => {
    const newId = (parseInt(Math.max(...formData.additionalFees.map(fee => parseInt(fee.id))).toString()) + 1).toString();
    
    setFormData({
      ...formData,
      additionalFees: [
        ...formData.additionalFees,
        { id: newId, name: '', description: '', amount: 0, currency: 'USD', frequency: 'term', school: 'Maternelle', paymentDeadline: '' }
      ],
    });
  };
  
  const removeAdditionalFee = (id: string) => {
    setFormData({
      ...formData,
      additionalFees: formData.additionalFees.filter(fee => fee.id !== id),
    });
  };
  
  const nextStep = () => {
    if (step === 1 && (!formData.startDate || !formData.endDate)) {
      toast.error('Veuillez remplir les dates de début et de fin de l\'année scolaire');
      return;
    }
    
    if (step === 2) {
      const invalidTerm = formData.terms.find(term => !term.startDate || !term.endDate);
      if (invalidTerm) {
        toast.error(`Veuillez remplir les dates du ${invalidTerm.name}`);
        return;
      }
    }
    
    if (step === 3) {
      const invalidFee = formData.feeCategories.find(fee => !fee.name);
      if (invalidFee) {
        toast.error('Veuillez compléter tous les noms des catégories de frais');
        return;
      }
    }

    if (step === 4) {
      const invalidAdditionalFee = formData.additionalFees.find(fee => !fee.name || !fee.paymentDeadline);
      if (invalidAdditionalFee) {
        toast.error('Veuillez compléter tous les frais connexes et leurs dates limites');
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    toast.success('Année scolaire configurée avec succès');
    setIsSubmitting(true);
    navigate('/settings');
  };

  const handleConfirm = () => {
    handleSubmit();
  };

  const handleBack = () => {
    setStep(4);
  };

  // Grouper les classes par école
  const classesBySchool = classesList.reduce((acc, classe) => {
    if (!acc[classe.school]) {
      acc[classe.school] = [];
    }
    acc[classe.school].push(classe);
    return acc;
  }, {} as Record<SchoolType, typeof classesList>);
  
  if (loading)  return <p>Chargement des classes...</p>;
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Configuration de l'année scolaire</h1>
          <button
            onClick={() => navigate('/settings')}
            className="button-outline flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Retour aux paramètres
          </button>
        </div>
        
        <div className="glass-card rounded-xl p-6 overflow-hidden">
          {step < 5 && (
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted transform -translate-y-1/2 z-0"></div>
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step === stepNumber 
                        ? 'bg-primary text-white' 
                        : step > stepNumber 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle size={16} /> : stepNumber}
                  </div>
                  <span className={`text-xs ${
                    step === stepNumber ? 'font-medium text-primary' : 'text-muted-foreground'
                  }`}>
                    {stepNumber === 1 && 'Période'}
                    {stepNumber === 2 && 'Trimestres'}
                    {stepNumber === 3 && 'Frais par classe'}
                    {stepNumber === 4 && 'Frais connexes'}
                    {stepNumber === 5 && 'Résumé'}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {step === 5 ? (
            <SchoolYearConfirmation
              schoolYearData={formData}
              classes={classesList}
              onConfirm={handleConfirm}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-primary" />
                    Définir la période de l'année scolaire
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="schoolYear" className="block text-sm font-medium mb-1">Année scolaire</label>
                      <input
                        type="text"
                        id="schoolYear"
                        name="schoolYear"
                        className="w-full p-2 border border-border rounded-md"
                        value={formData.schoolYear}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Format: 2023-2024</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium mb-1">Date de début</label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="w-full p-2 border border-border rounded-md"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium mb-1">Date de fin</label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="w-full p-2 border border-border rounded-md"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-medium mb-6">Configurer les trimestres</h2>
                  
                  {formData.terms.map((term, index) => (
                    <div key={term.id} className="mb-6 p-4 border border-border rounded-lg">
                      <h3 className="text-lg font-medium mb-4">{term.name}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Date de début</label>
                          <input
                            type="date"
                            className="w-full p-2 border border-border rounded-md"
                            value={term.startDate}
                            onChange={(e) => handleTermChange(term.id, 'startDate', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Date de fin</label>
                          <input
                            type="date"
                            className="w-full p-2 border border-border rounded-md"
                            value={term.endDate}
                            onChange={(e) => handleTermChange(term.id, 'endDate', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {step === 3 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Configurer les frais par classe</h2>
                    <button 
                      type="button" 
                      onClick={addFeeCategory}
                      className="button-outline text-sm flex items-center gap-1"
                    >
                      <PlusCircle size={16} />
                      Ajouter une catégorie
                    </button>
                  </div>
                  
                  {formData.feeCategories.map((fee) => (
                    <div key={fee.id} className="mb-6 p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">Nom de la catégorie</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-border rounded-md"
                            value={fee.name}
                            onChange={(e) => handleFeeCategoryChange(fee.id, 'name', e.target.value)}
                            required
                          />
                        </div>
                        
                        {formData.feeCategories.length > 1 && (
                          <button 
                            type="button" 
                            className="ml-2 p-1.5 text-destructive hover:bg-destructive/10 rounded-md"
                            onClick={() => removeFeeCategory(fee.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Devise</label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={fee.currency}
                            onChange={(e) => handleFeeCategoryChange(fee.id, 'currency', e.target.value)}
                            required
                          >
                            <option value="USD">USD</option>
                            <option value="CDF">CDF</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Fréquence</label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={fee.frequency}
                            onChange={(e) => handleFeeCategoryChange(fee.id, 'frequency', e.target.value)}
                            required
                          >
                            <option value="one-time">Unique</option>
                            <option value="monthly">Mensuel</option>
                            <option value="term">Par trimestre</option>
                            <option value="yearly">Annuel</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-md font-medium mb-3">Montant par classe et par trimestre</h4>
                        
                        {/* Subdivision par école */}
                        {Object.entries(classesBySchool).map(([school, classes]) => (
                          <div key={school} className="mb-6">
                            <h5 className="text-sm font-semibold mb-3 text-primary bg-primary/10 px-3 py-2 rounded-md">
                              {getSchoolName(school as SchoolType)}
                            </h5>
                            
                            {classes.map((classe) => {
                              const classFee = fee.feesByClass.find(cf => cf.classId === classe.id);
                              if (!classFee) return null;
                              
                              return (
                                <div key={classe.id} className="border border-border/50 p-3 rounded-md mb-3 ml-4">
                                  <label className="block text-sm font-medium mb-2">{classe.name}</label>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-xs text-muted-foreground mb-1">Premier trimestre</label>
                                      <div className="flex items-center">
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          className="w-full p-2 border border-border rounded-md"
                                          value={classFee.termFees.term1}
                                          onChange={(e) => handleFeeByClassTermChange(fee.id, classe.id, 'term1', e.target.value)}
                                        />
                                        <span className="ml-2 text-xs text-muted-foreground">{fee.currency}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-muted-foreground mb-1">Deuxième trimestre</label>
                                      <div className="flex items-center">
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          className="w-full p-2 border border-border rounded-md"
                                          value={classFee.termFees.term2}
                                          onChange={(e) => handleFeeByClassTermChange(fee.id, classe.id, 'term2', e.target.value)}
                                        />
                                        <span className="ml-2 text-xs text-muted-foreground">{fee.currency}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-muted-foreground mb-1">Troisième trimestre</label>
                                      <div className="flex items-center">
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          className="w-full p-2 border border-border rounded-md"
                                          value={classFee.termFees.term3}
                                          onChange={(e) => handleFeeByClassTermChange(fee.id, classe.id, 'term3', e.target.value)}
                                        />
                                        <span className="ml-2 text-xs text-muted-foreground">{fee.currency}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {step === 4 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Configurer les frais connexes</h2>
                    <button 
                      type="button" 
                      onClick={addAdditionalFee}
                      className="button-outline text-sm flex items-center gap-1"
                    >
                      <PlusCircle size={16} />
                      Ajouter un frais
                    </button>
                  </div>
                  
                  {formData.additionalFees.map((fee) => (
                    <div key={fee.id} className="mb-6 p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-full">
                          <label className="block text-sm font-medium mb-1">Nom du frais</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-border rounded-md"
                            value={fee.name}
                            onChange={(e) => handleAdditionalFeeChange(fee.id, 'name', e.target.value)}
                            required
                          />
                        </div>
                        
                        {formData.additionalFees.length > 1 && (
                          <button 
                            type="button" 
                            className="ml-2 p-1.5 text-destructive hover:bg-destructive/10 rounded-md"
                            onClick={() => removeAdditionalFee(fee.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          className="w-full p-2 border border-border rounded-md"
                          value={fee.description}
                          onChange={(e) => handleAdditionalFeeChange(fee.id, 'description', e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">École</label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={fee.school}
                            onChange={(e) => handleAdditionalFeeChange(fee.id, 'school', e.target.value)}
                            required
                          >
                            <option value="Maternelle">Maternelle</option>
                            <option value="Primarire">Primaire</option>
                            <option value="Secondaire">Secondaire</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Date limite de paiement</label>
                          <input
                            type="date"
                            className="w-full p-2 border border-border rounded-md"
                            value={fee.paymentDeadline}
                            onChange={(e) => handleAdditionalFeeChange(fee.id, 'paymentDeadline', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Montant</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full p-2 border border-border rounded-md"
                            value={fee.amount}
                            onChange={(e) => handleAdditionalFeeChange(fee.id, 'amount', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Devise</label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={fee.currency}
                            onChange={(e) => handleAdditionalFeeChange(fee.id, 'currency', e.target.value)}
                            required
                          >
                            <option value="USD">USD</option>
                            <option value="CDF">CDF</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Fréquence</label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={fee.frequency}
                            onChange={(e) => handleAdditionalFeeChange(fee.id, 'frequency', e.target.value)}
                            required
                          >
                            <option value="one-time">Unique</option>
                            <option value="monthly">Mensuel</option>
                            <option value="term">Par trimestre</option>
                            <option value="yearly">Annuel</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {step === 5 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-medium mb-6">Résumé de la configuration</h2>
                  
                  <div className="mb-6 p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Période de l'année scolaire</h3>
                    <p><strong>Année scolaire:</strong> {formData.schoolYear}</p>
                    <p><strong>Date de début:</strong> {new Date(formData.startDate).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Date de fin:</strong> {new Date(formData.endDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  
                  <div className="mb-6 p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Trimestres</h3>
                    {formData.terms.map((term) => (
                      <div key={term.id} className="mb-2 last:mb-0">
                        <p><strong>{term.name}:</strong> Du {new Date(term.startDate).toLocaleDateString('fr-FR')} au {new Date(term.endDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6 p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Frais par classe</h3>
                    {formData.feeCategories.map((fee) => (
                      <div key={fee.id} className="mb-4 last:mb-0">
                        <h4 className="font-medium">{fee.name} ({fee.currency})</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Fréquence: {
                            fee.frequency === 'one-time' ? 'Unique' :
                            fee.frequency === 'monthly' ? 'Mensuel' :
                            fee.frequency === 'term' ? 'Par trimestre' : 'Annuel'
                          }
                        </p>
                        
                        <div className="mt-3">
                          {Object.entries(classesBySchool).map(([school, classes]) => {
                            const hasFeesInSchool = classes.some(c => {
                              const classFee = fee.feesByClass.find(f => f.classId === c.id);
                              return classFee && (classFee.termFees.term1 > 0 || classFee.termFees.term2 > 0 || classFee.termFees.term3 > 0);
                            });
                            
                            if (!hasFeesInSchool) return null;
                            
                            return (
                              <div key={school} className="mb-4">
                                <h5 className="font-medium text-primary mb-2">{getSchoolName(school as SchoolType)}</h5>
                                {classes.map(c => {
                                  const classFee = fee.feesByClass.find(f => f.classId === c.id);
                                  if (!classFee || (classFee.termFees.term1 === 0 && classFee.termFees.term2 === 0 && classFee.termFees.term3 === 0)) {
                                    return null;
                                  }
                                  
                                  return (
                                    <div key={c.id} className="mb-2 p-3 bg-muted/30 rounded ml-4">
                                      <p className="font-medium mb-1">{c.name}</p>
                                      <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div>Premier trimestre: <span className="font-medium">{classFee.termFees.term1} {fee.currency}</span></div>
                                        <div>Deuxième trimestre: <span className="font-medium">{classFee.termFees.term2} {fee.currency}</span></div>
                                        <div>Troisième trimestre: <span className="font-medium">{classFee.termFees.term3} {fee.currency}</span></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Frais connexes</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="py-2 px-4 text-left font-medium">Frais</th>
                            <th className="py-2 px-4 text-left font-medium">École</th>
                            <th className="py-2 px-4 text-left font-medium">Description</th>
                            <th className="py-2 px-4 text-left font-medium">Montant</th>
                            <th className="py-2 px-4 text-left font-medium">Date limite</th>
                            <th className="py-2 px-4 text-left font-medium">Fréquence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.additionalFees.map((fee) => (
                            <tr key={fee.id} className="border-b border-border/60 last:border-0">
                              <td className="py-2 px-4">{fee.name}</td>
                              <td className="py-2 px-4">{getSchoolName(fee.school)}</td>
                              <td className="py-2 px-4">{fee.description}</td>
                              <td className="py-2 px-4">{fee.amount.toFixed(2)} {fee.currency}</td>
                              <td className="py-2 px-4">{new Date(fee.paymentDeadline).toLocaleDateString('fr-FR')}</td>
                              <td className="py-2 px-4">
                                {fee.frequency === 'one-time' && 'Unique'}
                                {fee.frequency === 'monthly' && 'Mensuel'}
                                {fee.frequency === 'term' && 'Par trimestre'}
                                {fee.frequency === 'yearly' && 'Annuel'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="button-outline flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Précédent
                  </button>
                )}
                {step < 5 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="button-primary flex items-center gap-2 ml-auto"
                  >
                    Suivant
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="button-primary flex items-center gap-2 ml-auto"
                  >
                    Valider la configuration
                    <CheckCircle size={16} />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SchoolYearConfig;
