import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const content = {
  pt: {
    title: "Gerenciar Conteúdo",
    projects: "Projetos",
    consultations: "Consultas",
    courses: "Cursos",
    name: "Nome",
    description: "Descrição",
    actions: "Ações",
    add: "Adicionar",
    edit: "Editar",
    delete: "Excluir",
    noData: "Nenhum conteúdo encontrado"
  },
  en: {
    title: "Manage Content",
    projects: "Projects",
    consultations: "Consultations",
    courses: "Courses",
    name: "Name",
    description: "Description",
    actions: "Actions",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    noData: "No content found"
  }
};

interface ContentItem {
  _id: string;
  name?: string;
  title?: string;
  description: string;
  category?: string;
  status?: string;
  createdAt: string;
}

const AdminContent: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const contentData = content[language];
  
  const [currentTab, setCurrentTab] = useState('projects');
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchContent();
    }
  }, [currentTab, isAuthenticated, user]);

    const fetchContent = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      let endpoint = '';
      
      switch (currentTab) {
        case 'projects':
          endpoint = 'http://localhost:5000/api/admin/projects';
          break;
        case 'consultations':
          endpoint = 'http://localhost:5000/api/admin/consultations';
          break;
        case 'courses':
          endpoint = 'http://localhost:5000/api/admin/courses';
          break;
        default:
          endpoint = 'http://localhost:5000/api/admin/projects';
      }

      const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
          const data = await response.json();
      console.log('API Response for', currentTab, ':', data);
          if (data.success) {
        // Handle different response structures
        let contentData = [];
        if (data.data && Array.isArray(data.data)) {
          contentData = data.data;
        } else if (data.data && data.data[currentTab] && Array.isArray(data.data[currentTab])) {
          contentData = data.data[currentTab];
        } else if (data[currentTab] && Array.isArray(data[currentTab])) {
          contentData = data[currentTab];
        } else if (Array.isArray(data)) {
          contentData = data;
        }
        setContentList(contentData);
      } else {
        setContentList([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm(language === 'pt' ? 'Tem certeza que deseja excluir este item?' : 'Are you sure you want to delete this item?')) {
      return;
    }

    try {
      let endpoint = '';
      
      switch (currentTab) {
        case 'projects':
          endpoint = `http://localhost:5000/api/admin/projects/${itemId}`;
          break;
        case 'consultations':
          endpoint = `http://localhost:5000/api/admin/consultations/${itemId}`;
          break;
        case 'courses':
          endpoint = `http://localhost:5000/api/admin/courses/${itemId}`;
          break;
        default:
          endpoint = `http://localhost:5000/api/admin/projects/${itemId}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh the content list
      fetchContent();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (itemId: string) => {
    navigate(`/admin/content/${currentTab}/${itemId}/edit`);
  };

  const handleAdd = () => {
    navigate(`/admin/content/${currentTab}/new`);
  };

  const getItemName = (item: ContentItem) => {
    return item.name || item.title || 'Untitled';
  };

  if (loading && authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="text-center">
          <div className="text-lg">
            {language === 'pt' ? 'Carregando conteúdo...' : 'Loading content...'}
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
                ? 'Gerencie projetos, consultas e conteúdo educacional'
                : 'Manage projects, consultations and educational content'
              }
            </p>
          </div>
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

      {/* Tabs Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="projects" 
                className="px-6 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                {contentData.projects}
              </TabsTrigger>
              <TabsTrigger 
                value="consultations" 
                className="px-6 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                {contentData.consultations}
            </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="px-6 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none"
              >
                {contentData.courses}
            </TabsTrigger>
          </TabsList>
              </div>
                    
          <div className="p-6">
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                {currentTab === 'projects' && contentData.projects}
                {currentTab === 'consultations' && contentData.consultations}
                {currentTab === 'courses' && contentData.courses}
              </h2>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                {contentData.add}
              </button>
            </div>

            {/* Content Table */}
            {!Array.isArray(contentList) || contentList.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">{contentData.noData}</h3>
                <p className="text-slate-500">
                  {language === 'pt' 
                    ? 'Comece adicionando um novo item'
                    : 'Start by adding a new item'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                      <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                        {contentData.name}
                      </th>
                      <th className="text-left px-6 py-4 font-semibold text-slate-700 tracking-wide">
                        {contentData.description}
                      </th>
                      <th className="text-center px-6 py-4 font-semibold text-slate-700 tracking-wide">
                        {contentData.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {Array.isArray(contentList) && contentList.map((item, index) => (
                      <tr key={item._id} className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {getItemName(item).charAt(0).toUpperCase()}
                </div>
                <div>
                              <div className="font-semibold text-slate-900">{getItemName(item)}</div>
                              {item.category && (
                                <div className="text-sm text-slate-500 capitalize">{item.category}</div>
                              )}
                </div>
              </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-600 max-w-md">
                            <p className="line-clamp-2">{item.description}</p>
              </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item._id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-150 group"
                              title={contentData.edit}
                            >
                              <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
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
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContent;