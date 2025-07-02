import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import SchoolSelector from './SchoolSelector';
import instance from '../api/axios';

type SchoolType = 'maternelle' | 'primaire' | 'secondaire';

interface DashboardProps {
  selectedSchool: SchoolType;
  onSelectSchool: (school: SchoolType) => void;
}

interface exchangeRate{
  usdToFc: number;
  updatedAt: Date;
}
interface DashboardData {
  data:{
    stats: {
      total: number;
      paymentStatus: {
        àJour: number;
        enRetard: number;
      };
      classes: {
        name: string;
        count: number;
        options?: string[];
      }[];
      studentDetails: {
        id: string;
        fullName: string;
        className: string;
        firstTermPaid: number;
        secondTermPaid: number;
        thirdTermPaid: number;
        extraFees: {
          name: string;
          amountPaid: number;
        }[];
        isUpToDate: boolean;
      }[];
      totalPages: number;
      currentPage: number;
    };
    paymentData: {
      name: string;
      payé: number;
      dû: number;
    }[];
  }
}

const Dashboard: React.FC<DashboardProps> = ({ selectedSchool, onSelectSchool }) => {
  const [activeView, setActiveView] = useState<'overview' | 'financial' | 'classes'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [exchangeRateData, setExchangeRateData] = useState<exchangeRate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const navigate = useNavigate();
  
  const schoolYearId = localStorage.getItem('selectedYearId');

  const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Récupérer les données du dashboard
        const response = await instance.get<DashboardData>(`/dashboard/stats/${selectedSchool}`, {
        params: { 
          schoolYearId,
          page: currentPage,
          limit: itemsPerPage 
        },
      });  
        // Récupérer le taux de change
        const rateResponse = await instance.get(`/exchange-rate/latest`);

        setDashboardData(response.data);
        setExchangeRateData(rateResponse.data);
      } catch (err) {
        setError( error);
        console.log('Erreur lors du chargement des données', error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchDashboardData();
  }, [selectedSchool,currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          className="button-primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  const paginatedStudents = dashboardData.data.stats.studentDetails
  return (
    <div className="page-container">
      <SchoolSelector selectedSchool={selectedSchool} onSelectSchool={onSelectSchool} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-3 md:col-span-1">
          <div className="glass-card rounded-xl p-6 h-full animate-slide-up">
            <h3 className="text-lg font-medium mb-2">École {selectedSchool === 'maternelle' ? 'Maternelle' : selectedSchool === 'primaire' ? 'Primaire' : 'Secondaire'}</h3>
            <div className="text-4xl font-bold text-foreground mt-4">{dashboardData.data.stats.total}</div>
            <p className="text-sm text-muted-foreground">Élèves inscrits</p>
            
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">À jour</p>
                <p className="text-xl font-medium text-green-600">{dashboardData.data.stats.paymentStatus.àJour}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="text-xl font-medium text-destructive">{dashboardData.data.stats.paymentStatus.enRetard}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-3 md:col-span-2">
          <div className="glass-card rounded-xl p-6 h-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Tendance des paiements</h3>
              <div className="text-sm text-muted-foreground">Derniers 6 mois</div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.data.paymentData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} USD`, '']}
                  />
                  <Bar dataKey="payé" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dû" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-border">
          <button
            className={`px-4 py-2 text-sm font-medium btn-transition ${
              activeView === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveView('overview')}
          >
            Vue d'ensemble
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium btn-transition ${
              activeView === 'financial' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveView('financial')}
          >
            Finances
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium btn-transition ${
              activeView === 'classes' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveView('classes')}
          >
            Classes
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {activeView === 'overview' && (
          <div>
            <h3 className="text-xl font-medium mb-4">Vue d'ensemble</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Total des élèves</h4>
                <p className="text-2xl font-bold">{dashboardData.data.stats.total}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Nombre de classes</h4>
                <p className="text-2xl font-bold">{dashboardData.data.stats.classes.length}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Taux de paiement</h4>
                <p className="text-2xl font-bold">
                  {Math.round((dashboardData.data.stats.paymentStatus.àJour / dashboardData.data.stats.total) * 100)}%
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Détails des paiements par élève</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Élève</th>
                      <th className="text-left py-3 px-4">Classe</th>
                      <th className="text-left py-3 px-4">1er Trimestre</th>
                      <th className="text-left py-3 px-4">2ème Trimestre</th>
                      <th className="text-left py-3 px-4">3ème Trimestre</th>
                      <th className="text-left py-3 px-4">Frais connexes</th>
                      <th className="text-left py-3 px-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">{student.fullName}</td>
                        <td className="py-3 px-4">{student.className}</td>
                        <td className="py-3 px-4">{student.firstTermPaid.toLocaleString()} USD</td>
                        <td className="py-3 px-4">{student.secondTermPaid.toLocaleString()} USD</td>
                        <td className="py-3 px-4">{student.thirdTermPaid.toLocaleString()} USD</td>
                        <td className="py-3 px-4">
                          {student.extraFees.map((fee, index) => (
                            <div key={index} className="text-sm">
                              {fee.name}: {fee.amountPaid.toLocaleString()} USD
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.isUpToDate ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.isUpToDate ? 'À jour' : 'En retard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} sur {dashboardData.data.stats.totalPages}
                </p>
                <div className="space-x-2">
                  <button
                    type='button'
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="button-outline px-4 py-1 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    type='button'
                    disabled={currentPage === dashboardData.data.stats.totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, dashboardData.data.stats.totalPages))}
                    className="button-outline px-4 py-1 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Actions rapides</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  className="button-primary flex items-center justify-center gap-2"
                  onClick={() => navigate(`/students/${selectedSchool}`)}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Voir les élèves
                </button>
                <button 
                  className="button-secondary flex items-center justify-center gap-2"
                  onClick={() => navigate(`/payments/${selectedSchool}`)}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  Enregistrer paiement
                </button>
                <button 
                  className="button-outline flex items-center justify-center gap-2"
                  onClick={() => toast.info('Fonctionnalité de rapports à venir')}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Générer rapports
                </button>
                <button 
                  className="button-outline flex items-center justify-center gap-2"
                  onClick={() => navigate('/settings')}
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Paramètres
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'financial' && (
          <div>
            <h3 className="text-xl font-medium mb-6">Aperçu financier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
                <h4 className="text-sm font-medium text-muted-foreground">Recettes du mois</h4>
                <p className="text-2xl font-bold mt-2">
                  {dashboardData.data.paymentData[dashboardData.data.paymentData.length - 1]?.payé.toLocaleString()} USD
                </p>
                <div className="text-xs text-green-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 15l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Mois en cours
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
                <h4 className="text-sm font-medium text-muted-foreground">Paiements en attente</h4>
                <p className="text-2xl font-bold mt-2">
                  {dashboardData.data.paymentData[dashboardData.data.paymentData.length - 1]?.dû.toLocaleString()} USD
                </p>
                <div className="text-xs text-destructive flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 15l-6 6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 9l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  À recouvrer
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
                <h4 className="text-sm font-medium text-muted-foreground">Taux de recouvrement</h4>
                <p className="text-2xl font-bold mt-2">
                  {Math.round((dashboardData.data.stats.paymentStatus.àJour / dashboardData.data.stats.total) * 100)}%
                </p>
                <div className="text-xs text-green-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 15l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Trimestre en cours
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
                <h4 className="text-sm font-medium text-muted-foreground">Taux de change USD/CDF</h4>
                <p className="text-2xl font-bold mt-2">{exchangeRateData.usdToFc.toLocaleString()}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {`Mise à jour le ${exchangeRateData.updatedAt}` }
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'classes' && (
          <div>
            <h3 className="text-xl font-medium mb-4">Classes</h3>
            <div className="overflow-hidden">
              <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Classe
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Nombre d'élèves
                    </th>
                    {selectedSchool === 'secondaire' && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Options
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.data.stats.classes.map((classItem, index) => (
                    <tr key={index} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {classItem.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {classItem.count} élèves
                      </td>
                      {selectedSchool === 'secondaire' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          <div className="flex flex-wrap gap-1">
                            {classItem.options?.map((option, optIndex) => (
                              <span key={optIndex} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-school-secondary-light text-school-secondary">
                                {option}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
                        <button 
                          className="text-primary hover:text-primary/80 font-medium"
                          onClick={() => navigate(`/classes/${selectedSchool}/${classItem.name}`)}
                        >
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
