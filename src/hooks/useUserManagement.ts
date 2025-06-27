
import { useState } from 'react';
import { UserData, UserFormData, UserRole } from '@/types/user';
import { toast } from 'sonner';

// Mock data
const mockUsers: UserData[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@ecole.com', role: 'admin', isActive: true },
  { id: '2', name: 'Jean Dumont', email: 'jdumont@ecole.com', role: 'teacher', isActive: true },
  { id: '3', name: 'Marie Claire', email: 'mclaire@ecole.com', role: 'accountant', isActive: true },
  { id: '4', name: 'Pierre Leclerc', email: 'pleclerc@ecole.com', role: 'teacher', isActive: false },
];

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'teacher' as UserRole,
    password: '',
    confirmPassword: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAddUser = () => {
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'teacher',
      password: '',
      confirmPassword: '',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };
  
  const handleEditUser = (user: UserData) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setEditingId(user.id);
    setIsModalOpen(true);
  };
  
  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
    const updatedUser = users.find(user => user.id === id);
    if (updatedUser) {
      toast.success(`Statut de ${updatedUser.name} mis à jour avec succès`);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (editingId) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingId 
          ? { ...user, name: formData.name, email: formData.email, role: formData.role }
          : user
      ));
      toast.success('Utilisateur mis à jour avec succès');
    } else {
      // Add new user
      const newUser: UserData = {
        id: `${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: true,
      };
      setUsers([...users, newUser]);
      toast.success('Utilisateur ajouté avec succès');
    }
    
    setIsModalOpen(false);
  };

  return {
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
  };
};
