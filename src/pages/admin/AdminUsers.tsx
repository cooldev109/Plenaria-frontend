import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Trash2, UserPlus, CheckCircle } from 'lucide-react';

const content = {
  pt: {
    title: "Gerenciar Usuários",
    addUser: "Adicionar Usuário",
    name: "Nome",
    email: "Email",
    role: "Função",
    status: "Estado",
    actions: "Ações",
    edit: "Editar",
    delete: "Excluir",
    approve: "Aprovar",
    noData: "Nenhum usuário encontrado",
    pending: "Pendente",
    approved: "Aprovado"
  },
  en: {
    title: "Manage Users",
    addUser: "Add User",
    name: "Name",
    email: "Email",
    role: "Role",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    approve: "Approve",
    noData: "No users found",
    pending: "Pending",
    approved: "Approved"
  }
};

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  lawyerStatus?: string;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const contentData = content[language];
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || data.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, user, authLoading]);


  const fetchUsers = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users || data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm(language === 'pt' ? 'Tem certeza que deseja excluir este usuário?' : 'Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the users list
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm(language === 'pt' ? 'Tem certeza que deseja aprovar este advogado?' : 'Are you sure you want to approve this lawyer?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve user');
      }

      // Refresh the users list
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleAddUser = () => {
    navigate('/admin/users/new');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-lg">
            {language === 'pt' ? 'Carregando usuários...' : 'Loading users...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              {contentData.title}
            </h1>
            <p className="text-slate-600 mt-1">
              {language === 'pt' 
                ? 'Gerencie usuários, funções e aprovações do sistema'
                : 'Manage users, roles and system approvals'
              }
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            <UserPlus className="w-5 h-5" />
            {contentData.addUser}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">{contentData.noData}</h3>
          <p className="text-slate-500">
            {language === 'pt' 
              ? 'Comece adicionando um novo usuário ao sistema'
              : 'Start by adding a new user to the system'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.name}
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.email}
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.role}
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.status}
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user, index) => {
                  const getUserStatus = () => {
                    if (user.role === 'lawyer') {
                      return user.lawyerStatus === 'pending' ? contentData.pending : contentData.approved;
                    }
                    return contentData.approved;
                  };

                  const getStatusBadgeClass = () => {
                    if (user.role === 'lawyer') {
                      return user.lawyerStatus === 'pending' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                    }
                    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  };

                  const getRoleBadgeClass = () => {
                    switch (user.role) {
                      case 'admin':
                        return 'bg-red-50 text-red-700 border border-red-200';
                      case 'lawyer':
                        return 'bg-blue-50 text-blue-700 border border-blue-200';
                      case 'customer':
                        return 'bg-slate-50 text-slate-700 border border-slate-200';
                      default:
                        return 'bg-gray-50 text-gray-700 border border-gray-200';
                    }
                  };

                  return (
                    <tr key={user._id} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 font-medium">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass()}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass()}`}>
                          {getUserStatus()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-150 group"
                            title={contentData.edit}
                          >
                            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-150 group"
                              title={contentData.delete}
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                          {user.role === 'lawyer' && user.lawyerStatus === 'pending' && (
                            <button
                              onClick={() => handleApprove(user._id)}
                              className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-150 group"
                              title={contentData.approve}
                            >
                              <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;