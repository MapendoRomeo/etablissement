import React from 'react';
import { SchoolType } from './studentListTypes';

interface StudentPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  studentCount: number;
  selectedSchool: SchoolType;
}

const StudentPagination: React.FC<StudentPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  studentCount,
  selectedSchool
}) => {
  if (studentCount === 0) return null;
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-muted/50 border-t border-border">
      <span className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </span>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StudentPagination; 