import React from 'react';
import { StudentPaymentData, SchoolType, TermType } from './studentListTypes';

interface StudentTableProps {
  studentData: StudentPaymentData[];
  selectedSchool: SchoolType;
  term: TermType;
  minPaid: string;
  currentPage: number;
  itemsPerPage: number;
  getOptionName: (id: string) => string;
  toast: any;
}

const StudentTable: React.FC<StudentTableProps> = ({
  studentData,
  selectedSchool,
  term,
  minPaid,
  currentPage,
  itemsPerPage,
  getOptionName,
  toast
}) => {
  return (
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
        {studentData.map((student, key) => (
          <tr key={student.id} className="hover:bg-muted/20 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{(currentPage - 1) * itemsPerPage + key + 1}</td>
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
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \
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
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \
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
        {studentData.length === 0 && (
          <tr>
            <td colSpan={selectedSchool === 'secondaire' ? 7 : 6} className="px-6 py-12 text-center text-muted-foreground">
              Aucun élève ne correspond aux critères sélectionnés
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StudentTable; 