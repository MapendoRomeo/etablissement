import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import instance from '@/api/axios';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReceiptModal from './ReceiptModal';
import { AlertDescription } from './ui/alert';

type SchoolType = 'maternelle' | 'primaire' | 'secondaire';
type Currency = 'USD' | 'CDF';
type PaymentType = 'tuition' | 'extra';

interface StudentPaymentData {
  id: string; // ou ObjectId si tu l'importes depuis mongoose
  name: string;
  class: string;
  school: string;
  option?: string; // seulement pour "secondaire"
  trimesters: TermPayment[];
  extraFees: ExtraFeePayment[];
}

interface TermPayment {
  term: string;        // ex: "1er trimestre"
  tuition: number;     // montant à payer
  paid: number;        // montant payé
  status: 'paid' | 'pending';
}

interface ExtraFeePayment {
  id: string;
  school: string;
  schoolYear: string;
  name: string;
  amount: number;
  dueDate: string;            
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;

  // Champs ajoutés dynamiquement dans le service :
  paid: number;
  status: 'paid' | 'pending';
}


interface PaymentFormProps {
  selectedSchool: SchoolType;
}
interface exchangeRate{
  usdToFc: number;
  updatedAt: Date;
}
const PaymentForm: React.FC<PaymentFormProps> = ({ selectedSchool }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentPaymentData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [term, setTerm] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [exchangeRateData, setExchangeRateData] = useState<exchangeRate | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentPaymentData[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [paymentType, setPaymentType] = useState<PaymentType>('tuition');
  const [loading, setLoading] = useState<boolean>(false);
  const [feeName, setFeeName] = useState<string>('')

  // Récupérer les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les élèves
        const studentsResponse = await instance.get(`/student-payments/${selectedSchool}`);
        setStudents(studentsResponse.data);

        // Récupérer le taux de change
        const rateResponse = await instance.get('/exchange-rate/latest');
        setExchangeRateData(rateResponse.data);
      } catch (error) {
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSchool]);

  const getTermType = (name: string): string => {
        if (name === '1er trimestre') return '1er Trimestre';
        if (name === '2e trimestre') return '2e Trimestre';
        if (name === '3e trimestre') return '3e Trimestre';
        return '';
      };
  // Filtrer les élèves par recherche
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student => 
      `${student.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  useEffect(() => {
  if (selectedStudent && paymentType === 'tuition') {
    const firstPendingTerm = selectedStudent.trimesters.find(t => t.status === 'pending');
    if (firstPendingTerm) {
      setTerm(firstPendingTerm.term);
    }
  }
}, [selectedStudent, paymentType]);
const adjustedMaxAmount = useMemo(() => {
  if (!exchangeRateData || !selectedStudent) return 0;

  if (paymentType === 'tuition') {
    const selectedTerm = selectedStudent.trimesters.find(t => t.term === term);
    if (!selectedTerm) return 0;

    const remaining = selectedTerm.tuition - selectedTerm.paid;
    return currency === 'USD'
      ? remaining
      : Math.round(remaining * exchangeRateData.usdToFc);
  }

  if (paymentType === 'extra') {
    const selectedFee = selectedStudent.extraFees.find(fee => fee.name === feeName);
    if (!selectedFee) return 0;

    const remaining = selectedFee.amount - selectedFee.paid;
    return currency === 'USD'
      ? remaining
      : Math.round(remaining * exchangeRateData.usdToFc);
  }

  return 0;
}, [paymentType, selectedStudent, term, feeName, currency, exchangeRateData]);


  // Gérer la recherche d'élèves
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    setSelectedStudent(null);
  };

  // Sélectionner un étudiant
  const handleStudentSelect = (student: StudentPaymentData) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.name}`);
    setShowDropdown(false);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > adjustedMaxAmount) {
      toast.error(`Le montant dépasse la limite autorisée (${adjustedMaxAmount} ${currency})`);
      return;
    }
    if (!selectedStudent || !amount || parseFloat(amount) <= 0) {
      toast.error('Veuillez remplir correctement tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);

      // Convertir le montant si nécessaire
      const amountValue = parseFloat(amount);
      const usdAmount = currency === 'USD' ? amountValue : amountValue / exchangeRateData?.usdToFc;
      const cdfAmount = currency === 'CDF' ? amountValue : amountValue * exchangeRateData?.usdToFc;
      const schoolYearId = localStorage.getItem('selectedYearId') || '';
      // Créer le paiement
      const paymentData = {
        student: selectedStudent.id,
        schoolYear: schoolYearId,
        amountPaidUSD: usdAmount,
        originalAmount: amountValue,
        currency: currency,
        paymentMode: paymentMethod,
        paymentType: paymentType,
        termName: null,
        feeId: null,
        status: 'completed',
        reference: reference,
        notes: notes
      };

      
      // Ajouter les champs spécifiques au type de paiement
      if (paymentType === 'tuition') {
        paymentData.termName = getTermType(term);
      } else {
        const selectedFee = selectedStudent?.extraFees.find(fee => fee.name === feeName);
        if (selectedFee) {
          paymentData.feeId = selectedFee.id;
        }
      }

      // Envoyer le paiement
      const response = await instance.post('/payments', paymentData);

      // Créer les données du reçu
      const receiptData = {
        receiptNumber: response.data.data.receiptNumber,
        date: new Date().toLocaleDateString('fr-FR'),
        student: `${selectedStudent.name}`,
        class: selectedStudent.class,
        school: selectedSchool,
        term: paymentType === 'tuition' ? term : feeName,
        paymentMethod: paymentMethod,
        amount: amountValue,
        currency: currency,
        amountUSD: usdAmount.toFixed(2),
        amountCDF: cdfAmount.toFixed(2),
        reference: reference,
        notes: notes
      };

      // Afficher le reçu
      setReceiptData(receiptData);
      setShowReceipt(true);

      // Réinitialiser le formulaire
      toast.success('Paiement enregistré avec succès');
      
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du paiement');
    } finally {
      setLoading(false);
    }
  };
  // Fermer le modal du reçu
  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setSelectedStudent(null);
    setSearchTerm('');
    setPaymentMethod('cash');
    setTerm('');
    setAmount('');
    setFeeName('');
    setReference('');
    setNotes('');
    setCurrency('USD');
    setPaymentType('tuition');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enregistrer un paiement</h1>
        <p className="text-muted-foreground">
          École {selectedSchool}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card rounded-xl p-6 animate-slide-up">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="labeled-input relative">
                    <label htmlFor="student">Élève <span className="text-destructive">*</span></label>
                    <Input
                      id="student"
                      type="text"
                      placeholder="Rechercher un élève..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowDropdown(true)}
                      className="input-field"
                    />
                    {showDropdown && searchTerm && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredStudents.length > 0 ? (
                          <ul className="py-1">
                            {filteredStudents.map((student) => (
                              <li
                                key={student.id}
                                className="px-4 py-2 hover:bg-muted cursor-pointer"
                                onClick={() => handleStudentSelect(student)}
                              >
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {student.class}
                                  {student.option && ` - ${student.option}`}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="px-4 py-2 text-sm text-muted-foreground">Aucun élève trouvé</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="labeled-input">
                    <label htmlFor="class">Classe</label>
                    <Input
                      id="class"
                      type="text"
                      value={selectedStudent ? `${selectedStudent.class}${selectedStudent.option ? ` - ${selectedStudent.option}` : ''}` : ''}
                      readOnly
                      disabled
                      className="input-field bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="labeled-input">
                    <label htmlFor="paymentType">Type de paiement <span className="text-destructive">*</span></label>
                    <Select 
                      value={paymentType}
                      onValueChange={(value: PaymentType) => setPaymentType(value)}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue placeholder="Sélectionner un type de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">Frais de scolarité</SelectItem>
                        <SelectItem value="extra">Frais supplémentaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentType === 'tuition' ? (
                    <div className="labeled-input">
                      <label htmlFor="term">Trimestre <span className="text-destructive">*</span></label>
                      <Select 
                        value={term}
                        onValueChange={setTerm}
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Sélectionner un trimestre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1er trimestre">1er Trimestre</SelectItem>
                          <SelectItem value="2e trimestre">2e Trimestre</SelectItem>
                          <SelectItem value="3e trimestre">3e Trimestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="labeled-input">
                      <label htmlFor="fee">Frais <span className="text-destructive">*</span></label>
                      <Select 
                        value={feeName}
                        onValueChange={setFeeName}
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Sélectionner un frais" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedStudent?.extraFees.map((fee) => (
                            <SelectItem key={fee.id} value={fee.name.toString()}>
                              {fee.name} 
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="labeled-input">
                    <label htmlFor="paymentMethod">Mode de paiement <span className="text-destructive">*</span></label>
                    <Select 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue placeholder="Sélectionner un mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="labeled-input">
                    <label htmlFor="currency">Devise <span className="text-destructive">*</span></label>
                    <Select 
                      value={currency}
                      onValueChange={(value: Currency) => setCurrency(value)}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="CDF">CDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="labeled-input">
                    <label htmlFor="amount">Montant <span className="text-destructive">*</span></label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value <= adjustedMaxAmount) {
                            setAmount(e.target.value);
                          } else {
                            toast.warning(`Le montant ne peut pas dépasser ${adjustedMaxAmount} ${currency}`);
                          }
                        }}
                        max={adjustedMaxAmount}
                        placeholder={`maximum: ${adjustedMaxAmount} ${currency}`}
                      className="input-field"
                    />
                  </div>

                  <div className="labeled-input">
                    <label htmlFor="reference">Référence</label>
                    <Input
                      id="reference"
                      type="text"
                      placeholder="Numéro de référence (optionnel)"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="labeled-input">
                  <label htmlFor="notes">Notes</label>
                  <Input
                    id="notes"
                    type="text"
                    placeholder="Notes additionnelles (optionnel)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer le paiement'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-medium mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Taux de change</p>
                <p className="text-lg font-medium">1 USD = {exchangeRateData?.usdToFc} CDF</p>
              </div>
              {selectedStudent && (
                <div>
                  <p className="text-sm text-muted-foreground">Classe</p>
                  <p className="text-lg font-medium">
                    {selectedStudent.class}
                    {selectedStudent.option && ` - ${selectedStudent.option}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReceipt && receiptData && (
        <ReceiptModal
          receiptData={receiptData}
          onClose={handleCloseReceipt}
          isOpen={showReceipt}
        />
      )}
    </div>
  );
};

export default PaymentForm;
