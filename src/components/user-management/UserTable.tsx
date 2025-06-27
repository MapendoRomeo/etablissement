
import React from 'react';
import { User, UserX, Edit, CheckCircle, XCircle } from 'lucide-react';
import { UserData, UserRole } from '@/types/user';

interface UserTableProps {
  users: UserData[];
  onEditUser: (user: UserData) => void;
  onToggleStatus: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser, onToggleStatus }) => {
  const getRoleName = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Enseignant';
      case 'accountant': return 'Comptable';
      default: return role;
    }
  };

  return (
    <table className="w-full min-w-[600px]">
      <thead>
        <tr className="border-b border-border">
          <th className="py-3 px-4 text-left font-medium">Nom</th>
          <th className="py-3 px-4 text-left font-medium">Email</th>
          <th className="py-3 px-4 text-left font-medium">Rôle</th>
          <th className="py-3 px-4 text-left font-medium">Statut</th>
          <th className="py-3 px-4 text-right font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-border/60 hover:bg-muted/40">
            <td className="py-3 px-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                {user.name}
              </div>
            </td>
            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
            <td className="py-3 px-4">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                  user.role === 'teacher' ? 'bg-emerald-100 text-emerald-800' : 
                    'bg-amber-100 text-amber-800'
                }`}
              >
                {getRoleName(user.role)}
              </span>
            </td>
            <td className="py-3 px-4">
              {user.isActive ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} /> Actif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <XCircle size={14} /> Inactif
                </span>
              )}
            </td>
            <td className="py-3 px-4">
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => onEditUser(user)}
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  title="Modifier"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onToggleStatus(user.id)}
                  className={`p-1.5 rounded-md ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                  title={user.isActive ? 'Désactiver' : 'Activer'}
                >
                  {user.isActive ? <UserX size={16} /> : <CheckCircle size={16} />}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
