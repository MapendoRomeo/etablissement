import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import instance from '../api/axios';

type SchoolType = 'maternelle' | 'primaire' | 'secondaire';
type PaymentStatus = 'all' | 'paid' | 'pending';
type TermType = 'all' | '1er trimestre' | '2e trimestre' | '3e trimestre';


interface TrimesterPayment {
  term: string;         // ex: "1er trimestre"
  tuition: number;      // montant à payer
  paid: number;         // montant payé
  status: 'paid' | 'pending';
}

interface ExtraFeePayment {
  name: string;         // nom du frais connexe
  amount: number;       // montant à payer
  paid: number;         // montant payé
  status: 'paid' | 'pending';
}

interface StudentPaymentData {
  id: string;
  name: string;
  class: string;
  school: string;       // ex: "secondaire", "primaire"
  option?: string;      // seulement si école = secondaire
  trimesters: TrimesterPayment[];
  extraFees: ExtraFeePayment[];
}
export interface SchoolOption {
  id: string;
  name: string;
}

export interface SchoolStructureResponse {
  school: string;
  classes: string[]; // ou: { id: string, name: string }[] si on veut aussi les ID
  options: SchoolOption[];
}

// Classes par école
const classesBySchool = {
  maternelle: ['Petite Section', 'Moyenne Section', 'Grande Section'],
  primaire: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
  secondaire: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale']
};

// Options disponibles pour l'école secondaire
const secondaireOptions = [
  { id: 'general', name: 'Général' },
  { id: 'scientific', name: 'Scientifique' },
  { id: 'literary', name: 'Littéraire' },
  { id: 'economic', name: 'Économique' }
];

interface StudentListProps {
  selectedSchool: SchoolType;
}

const StudentList: React.FC<StudentListProps> = ({ selectedSchool }) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('all');
  const [term, setTerm] = useState<TermType>('all');
  const [option, setOption] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPaid, setMinPaid] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData, setStudentData] = useState<StudentPaymentData[]>([]);
  const [schoolStructure, setSchoolStructure] = useState<SchoolStructureResponse | null>(null);

  useEffect(() => {
  if (selectedSchool === 'secondaire' || selectedSchool === 'primaire' || selectedSchool === 'maternelle') {
    fetchStudentPaymentStats(selectedSchool);
    fetchSchoolStructure(selectedSchool);
  }
}, [selectedSchool]);

  const fetchStudentPaymentStats = async (schoolType) => {
  try {
    const selectedYearId = localStorage.getItem('selectedYearId'); 

    const { data } = await instance.get(`/student-payments/${schoolType}`,{
  params: { schoolYearId: selectedYearId }});
    setStudentData(data); // ← stocke les élèves dans ton state
  } catch (error) {
    toast.error('Erreur lors du chargement des statistiques');
  }
};
const fetchSchoolStructure = async (schoolType: string) => {
  try {
    const response = await instance.get<SchoolStructureResponse>(`/school/structure/${schoolType}`);
    setSchoolStructure(response.data);
  } catch (error) {
    toast.error('Erreur lors du chargement de la structure scolaire');
  }
};

  // Filtrer les élèves en fonction des critères sélectionnés
  const filteredStudents = studentData.filter(student => {
    if (student.school !== selectedSchool) return false;
    if (selectedClass !== 'all' && student.class !== selectedClass) return false;
    if (paymentStatus !== 'all') {
  let isPaid = false;

  if (term === 'all') {
    const totalPaid = student.trimesters.reduce((sum, t) => sum + (t.paid || 0), 0);
    isPaid = minPaid !== ''
      ? totalPaid >= parseFloat(minPaid)
      : student.trimesters.every(t => t.status === 'paid');
  } else {
    const selectedTerm = student.trimesters.find(t => t.term === term);
    if (!selectedTerm) return false;
    isPaid = minPaid !== ''
      ? (selectedTerm.paid || 0) >= parseFloat(minPaid)
      : selectedTerm.status === 'paid';
  }

  return paymentStatus === 'paid' ? isPaid : !isPaid;
}

    if (term !== 'all' && !student.trimesters.some((trimester) => trimester.term === term)) return false;
    if (selectedSchool === 'secondaire' && option !== 'all' && student.option !== option) return false;
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (minPaid !== '') {
  term === 'all'
    ? student.trimesters.reduce((sum, t) => sum + (t.paid || 0), 0)
    : student.trimesters.find(t => t.term === term)?.paid || 0;
}

    return true;
  });
  
  
  // Fonction pour exporter les données des étudiants en PDF
  const exportStudentData = () => {
  try {
    const doc = new jsPDF();

    const schoolNames = {
      maternelle: 'École maternelle',
      primaire: 'École primaire',
      secondaire: 'École secondaire',
    };

    // Titre
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text('École Etoile Mugunga', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Sous-titre
    doc.setFontSize(14);
    doc.text(schoolNames[selectedSchool], doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Liste des élèves - ${new Date().toLocaleDateString('fr-FR')}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    // Colonnes
    const tableColumn = selectedSchool === 'secondaire'
      ? ['ID', 'Nom', 'Classe', 'Option', 'Statut']
      : ['ID', 'Nom', 'Classe', 'Statut'];

    // Lignes
    const tableRows = filteredStudents.map((student, key) => {
      const row = [
        key + 1,
        student.name,
        student.class,
        ...(selectedSchool === 'secondaire' ? [student.option ? schoolStructure.options.find(opt => getOptionName(opt.id) === student.option)?.name : 'N/A'] : []),
        student.trimesters.every(t => t.status === 'paid') ? 'Payé' : 'En attente'
      ];
      return row;
    });

    // Tableau
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [156, 135, 245],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 250],
      },
      margin: { top: 50 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 50;

    // Signature + Sceau
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text('Signature du comptable:', 20, finalY + 30);
    doc.line(20, finalY + 35, 100, finalY + 35);
    doc.text('Sceau de l\'école:', doc.internal.pageSize.getWidth() - 90, finalY + 30);
    doc.circle(doc.internal.pageSize.getWidth() - 60, finalY + 50, 20, 'S');

    // ✅ Imprimer au lieu de sauvegarder
    doc.autoPrint(); // Active la boîte de dialogue d'impression
    const blobUrl = doc.output('bloburl'); // Crée une URL temporaire
    window.open(blobUrl, '_blank'); // Ouvre dans une nouvelle fenêtre pour lancer l'impression

    toast.success('Document prêt pour impression');
  } catch (error) {
    toast.error('Erreur lors de la génération du document');
  }
};

  
  // Fonction pour obtenir le nom de l'option à partir de son ID
  const getOptionName = (optionId: string) => {
    const option = schoolStructure.options.find(opt => opt.id === optionId);
    return option ? option.name : optionId;
  };
  const itemsPerPage = 20;

const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

useEffect(() => {
  setCurrentPage(1);
}, [selectedClass, paymentStatus, term, option, selectedSchool]);
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Liste des élèves</h1>
        <p className="text-muted-foreground">
          École {selectedSchool === 'maternelle' ? 'maternelle' : selectedSchool === 'primaire' ? 'primaire' : 'secondaire'}
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-8 animate-slide-up">
        <h2 className="text-lg font-medium mb-4">Filtres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="labeled-input">
            <label htmlFor="class-filter">Classe</label>
            <select 
              id="class-filter" 
              className="input-field"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Toutes les classes</option>
              {schoolStructure?.classes?.map((className, index) => (
                <option key={index} value={className}>{className}</option>
              ))}
            </select>
          </div>
          
          <div className="labeled-input">
            <label htmlFor="payment-filter">Statut de paiement</label>
            <select 
              id="payment-filter" 
              className="input-field"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            >
              <option value="all">Tous</option>
              <option value="paid">Payé</option>
              <option value="pending">En attente</option>
            </select>
          </div>
          
          <div className="labeled-input">
            <label htmlFor="term-filter">Trimestre</label>
            <select 
              id="term-filter" 
              className="input-field"
              value={term}
              onChange={(e) => setTerm(e.target.value as TermType)}
            >
              <option value="all">Tous</option>
              <option value="1er trimestre">1er Trimestre</option>
              <option value="2e trimestre">2ème Trimestre</option>
              <option value="3e trimestre">3ème Trimestre</option>
            </select>
          </div>
          
          {selectedSchool === 'secondaire' && (
            <div className="labeled-input">
              <label htmlFor="option-filter">Option</label>
              <select 
                id="option-filter" 
                className="input-field"
                value={option}
                onChange={(e) => setOption(e.target.value)}
              >
                <option value="all">Toutes</option>
                {schoolStructure?.options?.map((opt) => (
                  <option key={opt.id} value={getOptionName(opt.id)}>{opt.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 items-end">
  {/* Champ de recherche par nom */}
  <div className="labeled-input">
    <label htmlFor="search">Recherche par nom</label>
    <div className="relative">
      <input
        id="search"
        type="text"
        className="input-field pl-10"
        placeholder="Rechercher un élève..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <svg 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  </div>

  {/* Champ pour le montant minimum payé */}
  <div className="labeled-input">
    <label htmlFor="minPaid">Montant payé minimum ({term !== 'all' ? `Trimestre ${term}` : 'Tous'})</label>
    <input
      id="minPaid"
      type="number"
      className="input-field"
      placeholder="Ex: 500"
      value={minPaid}
      onChange={(e) => setMinPaid(e.target.value)}
      min={0}
    />
  </div>
</div>

      </div>
      
      <div className="glass-card rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-medium">Résultats ({filteredStudents.length})</h2>
          <button 
            className="button-primaire text-sm"
            onClick={exportStudentData}
          >
            Imprimer la liste
          </button>
        </div>
        
        <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-border">
    <thead>
      <tr className="bg-muted/50">
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Classe</th>
        {selectedSchool === 'secondaire' && (
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Option</th>
        )}
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Frais de scolarité</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {paginatedStudents.map((student,key) => (
        <tr key={student.id} className="hover:bg-muted/20 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{key+1}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{student.class}</td>
          {selectedSchool === 'secondaire' && (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {student.option ? getOptionName(student.option) : 'N/A'}
            </td>
          )}
          {term === 'all' ? (
  <>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
      {minPaid !== ''
        ? `${parseFloat(minPaid)} USD`
        : `${student.trimesters.reduce((sum, t) => sum + t.tuition, 0)} USD`}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {(() => {
        const totalPaid = student.trimesters.reduce((sum, t) => sum + (t.paid || 0), 0);
        const isPaid = minPaid !== ''
          ? totalPaid >= parseFloat(minPaid)
          : student.trimesters.every(t => t.status === 'paid');

        return (
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isPaid ? 'Payé' : 'En attente'}
          </span>
        );
      })()}
    </td>
  </>
) : (
  <React.Fragment>
    {student.trimesters
      .filter(t => t.term === term)
      .map(filteredTerm => {
        const isPaid = minPaid !== ''
          ? (filteredTerm.paid || 0) >= parseFloat(minPaid)
          : filteredTerm.status === 'paid';

        return (
          <React.Fragment key={filteredTerm.term}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {minPaid !== ''
                ? `${parseFloat(minPaid)} USD`
                : `${filteredTerm.tuition} USD`}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {isPaid ? 'Payé' : 'En attente'}
              </span>
            </td>
          </React.Fragment>
        );
      })}
  </React.Fragment>
)}


          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
            <div className="flex justify-end space-x-2">
              <button 
                className="text-primaire hover:text-primaire/80"
                onClick={() => toast.success(`Affichage des détails de ${student.name}`)}
              >
                Détails
              </button>
              <button 
                className="text-primaire hover:text-primaire/80"
                onClick={() => toast.success(`Paiement pour ${student.name}`)}
              >
                Paiement
              </button>
            </div>
          </td>
        </tr>
      ))}

      {filteredStudents.length === 0 && (
        <tr>
          <td colSpan={selectedSchool === 'secondaire' ? 7 : 6} className="px-6 py-12 text-center text-muted-foreground">
            Aucun élève ne correspond aux critères sélectionnés
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* Pagination */}
  {filteredStudents.length > 0 && (
    <div className="flex justify-between items-center px-6 py-4 bg-muted/50 border-t border-border">
      <span className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </span>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default StudentList;
