import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import instance from '@/api/axios'

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      // Simuler un appel backend
      
      await instance.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      toast.success('Mot de passe changé avec succès.');
    } catch (err) {
      toast.error('Une erreur est survenue lors du changement.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-md py-10 animate-slide-up">
        <h1 className="text-2xl font-bold mb-6 text-center">Changer le mot de passe</h1>

        <form onSubmit={handleChangePassword} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ancien mot de passe</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full input"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="button-outline"
            >
              Retour
            </button>
            <button type="submit" className="button-primary">
              Valider
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePassword;
