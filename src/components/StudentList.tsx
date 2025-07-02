import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import instance from '../api/axios';
import {
  SchoolType,
  PaymentStatus,
  TermType,
  TrimesterPayment,
  ExtraFeePayment,
  PaymentQueryParams,
  StudentPaymentData,
  SchoolOption,
  SchoolStructureResponse
} from './student-management/studentListTypes';
import StudentFilters from './student-management/StudentFilters';
import StudentTable from './student-management/StudentTable';
import StudentPagination from './student-management/StudentPagination';

interface StudentListProps {
  selectedSchool: SchoolType;
}

const StudentList: React.FC<StudentListProps> = ({ selectedSchool }) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [paymentStatus, setPaymentStatus] = useState<string>('all');
  const [term, setTerm] = useState<string>('all');
  const [option, setOption] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPaid, setMinPaid] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData, setStudentData] = useState([]);
  const [schoolStructure, setSchoolStructure] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const itemsPerPage = 20;

  useEffect(() => {
    if (selectedSchool === 'secondaire' || selectedSchool === 'primaire' || selectedSchool === 'maternelle') {
      fetchStudentPaymentStats(selectedSchool);
      fetchSchoolStructure(selectedSchool);
    }
  }, [selectedSchool]);

  const fetchStudentPaymentStats = async (schoolType: string) => {
    try {
      const selectedYearId = localStorage.getItem('selectedYearId');

      const params: PaymentQueryParams = {
        schoolYearId: selectedYearId,
        page: currentPage,
        limit: itemsPerPage,
      };

      // ✅ Appliquer les filtres conditionnels
      if (selectedClass !== 'all') params.class = selectedClass;
      if (term !== 'all') params.term = term;
      if (paymentStatus !== 'all') params.paymentStatus = paymentStatus;
      if (schoolType === 'secondaire' && option !== 'all') params.option = option;
      if (searchTerm.trim() !== '') params.searchTerm = searchTerm.trim();
      if (minPaid !== '') params.minPaid = minPaid;

      const { data } = await instance.get(`/student-payments/${schoolType}`, { params });

      setStudentData(data.students);
      setTotalPages(data.totalPages);
      setTotalStudents(data.totalStudents);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    }
  };

  const fetchSchoolStructure = async (schoolType: string) => {
    try {
      const response = await instance.get(`/school/structure/${schoolType}`);
      setSchoolStructure(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement de la structure scolaire');
    }
  };
  
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
      const tableRows = studentData.map((student, key) => {
        const index = (currentPage - 1) * itemsPerPage + key + 1;
        const row = [
          index,
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudentPaymentStats(selectedSchool);
      setCurrentPage(1);
    }, 500); // attend 500ms après le dernier caractère tapé

    return () => clearTimeout(timeout); // nettoyage si l'utilisateur continue à taper
  }, [searchTerm, selectedSchool, selectedClass, option, term, paymentStatus]);

  useEffect(() => {
    if (selectedSchool) {
      fetchStudentPaymentStats(selectedSchool);
    }
  }, [currentPage]);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Liste des élèves</h1>
        <p className="text-muted-foreground">
          École {selectedSchool === 'maternelle' ? 'maternelle' : selectedSchool === 'primaire' ? 'primaire' : 'secondaire'}
        </p>
      </div>
      {/* Filtres */}
      <StudentFilters
        selectedSchool={selectedSchool}
        schoolStructure={schoolStructure}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        paymentStatus={paymentStatus as PaymentStatus}
        setPaymentStatus={setPaymentStatus}
        term={term as TermType}
        setTerm={setTerm}
        option={option}
        setOption={setOption}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPaid={minPaid}
        setMinPaid={setMinPaid}
        getOptionName={getOptionName}
      />
      <div className="glass-card rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-medium">Résultats ({totalStudents})</h2>
          <button 
            className="button-primaire text-sm"
            onClick={exportStudentData}
          >
            Imprimer la liste
          </button>
        </div>
        <div className="overflow-x-auto">
          <StudentTable
            studentData={studentData}
            selectedSchool={selectedSchool}
            term={term as TermType}
            minPaid={minPaid}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            getOptionName={getOptionName}
            toast={toast}
          />
          <StudentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            studentCount={studentData.length}
            selectedSchool={selectedSchool}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentList;
