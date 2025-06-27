import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ExchangeRateForm from '../components/ExchangeRateForm';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Paramètres Généraux</h1>
          <button
            onClick={() => navigate('/')}
            className="button-outline flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Retour à l'accueil
          </button>
        </div>

        {/* Taux de change et Configuration établissement */}
        <div className="glass-card rounded-xl p-6 mb-8 animate-slide-up">
          <h2 className="text-xl font-medium mb-6">Paramètres de l'établissement</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Taux de change</h3>
              <ExchangeRateForm />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Configuration des écoles</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ajouter des écoles, classes, options et élèves
              </p>
              <button
                className="button-primary"
                onClick={() => navigate('/school-structure')}
              >
                Gérer la structure scolaire
              </button>
            </div>
          </div>
        </div>

        {/* Administration */}
        <div
          className="glass-card rounded-xl p-6 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <h2 className="text-xl font-medium mb-6">Administration</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-border p-4">
              <h3 className="text-lg font-medium mb-2">Sauvegarde</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Effectuer une sauvegarde complète des données
              </p>
              <button className="button-outline w-full">Sauvegarder maintenant</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border p-4">
              <h3 className="text-lg font-medium mb-2">Année scolaire</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configurer la nouvelle année scolaire
              </p>
              <button
                onClick={() => navigate('/school-year-config')}
                className="button-outline w-full"
              >
                Configurer
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border p-4">
              <h3 className="text-lg font-medium mb-2">Utilisateurs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gérer les comptes utilisateurs et les permissions
              </p>
              <button
                onClick={() => navigate('/user-management')}
                className="button-outline w-full"
              >
                Gérer les utilisateurs
              </button>
            </div>

            {/* 👇 Nouvelle carte pour changer le mot de passe */}
            <div className="bg-white rounded-lg shadow-sm border border-border p-4">
              <h3 className="text-lg font-medium mb-2">Mot de passe</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Modifier votre mot de passe actuel
              </p>
              <button
                onClick={() => navigate('/change-password')}
                className="button-outline w-full"
              >
                Modifier le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
