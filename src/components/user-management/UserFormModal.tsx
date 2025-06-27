
import React from 'react';
import { UserFormData } from '@/types/user';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ 
  isOpen, 
  onClose, 
  formData, 
  onChange, 
  onSubmit, 
  isEditing 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Modifier un utilisateur' : 'Ajouter un nouvel utilisateur'}
          </h2>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="w-full p-2 border border-border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full p-2 border border-border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={onChange}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  required
                >
                  <option value="admin">Administrateur</option>
                  <option value="teacher">Enseignant</option>
                  <option value="accountant">Comptable</option>
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {isEditing ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className="w-full p-2 border border-border rounded-md"
                  required={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  className="w-full p-2 border border-border rounded-md"
                  required={!isEditing}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="button-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="button-primary"
              >
                {isEditing ? 'Enregistrer les modifications' : 'Ajouter l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
