import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Trash2, PlusCircle, Plus } from 'lucide-react';

const content = {
  pt: {
    title: "Gerenciar Planos",
    addPlan: "Adicionar Plano",
    name: "Nome",
    price: "Preço",
    features: "Recursos",
    actions: "Ações",
    edit: "Editar",
    delete: "Excluir",
    noData: "Nenhum plano encontrado",
    basic: "básico",
    complete : "completo",
    plus : "plus"
  },
  en: {
    title: "Manage Plans",
    addPlan: "Add Plan",
    name: "Name",
    price: "Price",
    features: "Features",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    noData: "No plans found",
    basic : "Basic",
    complete : "Complete",
    plus : "Plus"
  }
};

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  billingCycle: string;
  isActive: boolean;
}

const AdminPlans: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const contentData = content[language];
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/admin/plans', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        if (data.success) {
          setPlans(data.data.plans || data.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [isAuthenticated, user, authLoading]);

  const fetchPlans = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/plans', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      const data = await response.json();
      if (data.success) {
        setPlans(data.data.plans || data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm(language === 'pt' ? 'Tem certeza que deseja excluir este plano?' : 'Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      // Refresh the plans list
      fetchPlans();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (planId: string) => {
    navigate(`/admin/plans/${planId}/edit`);
  };

  const handleAddPlan = () => {
    navigate('/admin/plans/new');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="text-center">
          <div className="text-lg">
            {language === 'pt' ? 'Carregando planos...' : 'Loading plans...'}
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
                ? 'Gerencie planos de assinatura e recursos disponíveis'
                : 'Manage subscription plans and available features'
              }
            </p>
          </div>
          <button
            onClick={handleAddPlan}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            {contentData.addPlan}
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
      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">{contentData.noData}</h3>
          <p className="text-slate-500">
            {language === 'pt' 
              ? 'Comece criando um novo plano de assinatura'
              : 'Start by creating a new subscription plan'
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
                    {contentData.price}
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.features}
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-700 tracking-wide">
                    {contentData.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plans.map((plan, index) => (
                  <tr key={plan._id} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {plan.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{plan.name}</div>
                          <div className="text-sm text-slate-500 capitalize">
                            {plan.billingCycle} • {plan.isActive ? (language === 'pt' ? 'Ativo' : 'Active') : (language === 'pt' ? 'Inativo' : 'Inactive')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-semibold text-lg">
                        {formatPrice(plan.price, plan.currency)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {language === 'pt' ? 'por mês' : 'per month'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {feature}
                          </span>
                        ))}
                        {plan.features.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                            +{plan.features.length - 3} {language === 'pt' ? 'mais' : 'more'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(plan._id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-150 group"
                          title={contentData.edit}
                        >
                          <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-150 group"
                          title={contentData.delete}
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;