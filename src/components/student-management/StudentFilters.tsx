import React from 'react';
import { SchoolType, PaymentStatus, TermType, SchoolStructureResponse } from './studentListTypes';

interface StudentFiltersProps {
  selectedSchool: SchoolType;
  schoolStructure: SchoolStructureResponse | null;
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (value: PaymentStatus) => void;
  term: TermType;
  setTerm: (value: TermType) => void;
  option: string;
  setOption: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  minPaid: string;
  setMinPaid: (value: string) => void;
  getOptionName: (id: string) => string;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  selectedSchool,
  schoolStructure,
  selectedClass,
  setSelectedClass,
  paymentStatus,
  setPaymentStatus,
  term,
  setTerm,
  option,
  setOption,
  searchTerm,
  setSearchTerm,
  minPaid,
  setMinPaid,
  getOptionName
}) => {
  return (
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
            {schoolStructure?.classes?.map((classe, index) => (
              <option key={index} value={classe.id}>{classe.name}</option>
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
  );
};

export default StudentFilters; 