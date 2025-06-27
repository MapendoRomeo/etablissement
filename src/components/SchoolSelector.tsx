
import React from 'react';
import { motion } from 'framer-motion';

type SchoolType = 'maternelle' | 'primaire' | 'secondaire';

interface SchoolSelectorProps {
  selectedSchool: SchoolType;
  onSelectSchool: (school: SchoolType) => void;
}

const SchoolSelector: React.FC<SchoolSelectorProps> = ({ 
  selectedSchool, 
  onSelectSchool 
}) => {
  const schools = [
    { id: 'maternelle', name: 'École Maternelle', color: 'school-kindergarten', lightColor: 'school-kindergarten-light' },
    { id: 'primaire', name: 'École Primaire', color: 'school-primary', lightColor: 'school-primary-light' },
    { id: 'secondaire', name: 'École Secondaire', color: 'school-secondary', lightColor: 'school-secondary-light' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      <h2 className="text-2xl font-medium text-center mb-6">Sélectionnez une école</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schools.map((school) => (
          <button
            key={school.id}
            onClick={() => onSelectSchool(school.id as SchoolType)}
            className={`
              relative overflow-hidden rounded-xl glass-card p-6 hover-lift
              ${selectedSchool === school.id ? 
                `ring-2 ring-${school.color} bg-${school.lightColor}/10` : 
                'hover:bg-white/90'
              }
            `}
          >
            {selectedSchool === school.id && (
              <motion.div
                layoutId="schoolHighlight"
                className={`absolute inset-0 bg-${school.lightColor}/20 backdrop-blur-xs`}
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white bg-${school.color}`}
              >
                {school.id === 'kindergarten' && (
                  <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 4c-1.1 0-2 .9-2 2v4H8V6c0-1.1-.9-2-2-2s-2 .9-2 2v14a2 2 0 0 0 4 0v-4h8v4c0 1.1.9 2 2 2s2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                  </svg>
                )}
                {school.id === 'primary' && (
                  <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                )}
                {school.id === 'secondary' && (
                  <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-medium">{school.name}</h3>
                {school.id === 'kindergarten' && (
                  <p className="text-sm text-muted-foreground mt-1">Âges 3-5 ans</p>
                )}
                {school.id === 'primary' && (
                  <p className="text-sm text-muted-foreground mt-1">Âges 6-11 ans</p>
                )}
                {school.id === 'secondary' && (
                  <p className="text-sm text-muted-foreground mt-1">Âges 12-18 ans</p>
                )}
              </div>
              
              {selectedSchool === school.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute bottom-3 right-3 w-6 h-6 rounded-full bg-${school.color} flex items-center justify-center`}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchoolSelector;
