
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { UserPlus } from 'lucide-react';
import UserTable from '../components/user-management/UserTable';
import UserFormModal from '../components/user-management/UserFormModal';
import { useUserManagement } from '../hooks/useUserManagement';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    users,
    isModalOpen,
    formData,
    editingId,
    handleInputChange,
    handleAddUser,
    handleEditUser,
    handleToggleStatus,
    handleSubmit,
    setIsModalOpen
  } = useUserManagement();
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="button-outline flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour
            </button>
            <button
              onClick={handleAddUser}
              className="button-primary flex items-center gap-2"
            >
              <UserPlus size={16} />
              Nouvel utilisateur
            </button>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 overflow-x-auto">
          <UserTable 
            users={users} 
            onEditUser={handleEditUser} 
            onToggleStatus={handleToggleStatus} 
          />
        </div>
        
        <UserFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isEditing={!!editingId}
        />
      </div>
    </Layout>
  );
};

export default UserManagement;
