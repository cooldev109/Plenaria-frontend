import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Bell,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  Users,
  Eye,
  FileCheck
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { lawyerDashboardService } from '../../services/lawyer';

interface DashboardData {
  statistics: {
    assignedConsultations: number;
    completedConsultations: number;
    pendingConsultations: number;
    totalProjects: number;
    totalCourses: number;
    totalDrafts: number;
  };
  recentConsultations: Array<{
    _id: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    customerId: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
}

const LawyerDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    statistics: {
      assignedConsultations: 0,
      completedConsultations: 0,
      pendingConsultations: 0,
      totalProjects: 0,
      totalCourses: 0,
      totalDrafts: 0
    },
    recentConsultations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    pt: {
      title: "Painel do Advogado",
      welcome: "Bem-vindo de volta",
      overview: "Visão Geral",
      recentConsultations: "Consultas Recentes",
      quickActions: "Ações Rápidas",
      statistics: "Estatísticas",
      consultations: "Consultas",
      projects: "Projetos",
      courses: "Cursos",
      drafts: "Rascunhos",
      viewAll: "Ver Todos",
      newConsultation: "Nova Consulta",
      createDraft: "Criar Rascunho",
      viewProjects: "Ver Projetos",
      assignedConsultations: "Consultas Atribuídas",
      completedConsultations: "Consultas Concluídas",
      pendingConsultations: "Consultas Pendentes",
      totalProjects: "Total de Projetos",
      totalCourses: "Total de Cursos",
      totalDrafts: "Total de Rascunhos",
      thisWeek: "Esta Semana",
      thisMonth: "Este Mês",
      completionRate: "Taxa de Conclusão",
      noConsultations: "Nenhuma consulta recente",
      loading: "Carregando...",
      error: "Erro ao carregar dados",
      customer: "Cliente",
      priority: "Prioridade",
      status: "Status",
      view: "Ver",
      respond: "Responder"
    },
    en: {
      title: "Lawyer Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      recentConsultations: "Recent Consultations",
      quickActions: "Quick Actions",
      statistics: "Statistics",
      consultations: "Consultations",
      projects: "Projects",
      courses: "Courses",
      drafts: "Drafts",
      viewAll: "View All",
      newConsultation: "New Consultation",
      createDraft: "Create Draft",
      viewProjects: "View Projects",
      assignedConsultations: "Assigned Consultations",
      completedConsultations: "Completed Consultations",
      pendingConsultations: "Pending Consultations",
      totalProjects: "Total Projects",
      totalCourses: "Total Courses",
      totalDrafts: "Total Drafts",
      thisWeek: "This Week",
      thisMonth: "This Month",
      completionRate: "Completion Rate",
      noConsultations: "No recent consultations",
      loading: "Loading...",
      error: "Error loading data",
      customer: "Customer",
      priority: "Priority",
      status: "Status",
      view: "View",
      respond: "Respond"
    }
  };

  const contentData = content[language];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lawyerDashboardService.getDashboard();
      
      if (data.success && data.data) {
        setDashboardData(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: contentData.assignedConsultations,
      value: dashboardData.statistics?.assignedConsultations || 0,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/lawyer/consultations'
    },
    {
      title: contentData.completedConsultations,
      value: dashboardData.statistics?.completedConsultations || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      href: '/lawyer/consultations'
    },
    {
      title: contentData.totalProjects,
      value: dashboardData.statistics?.totalProjects || 0,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/lawyer/projects'
    },
    {
      title: contentData.totalDrafts,
      value: dashboardData.statistics?.totalDrafts || 0,
      icon: FileCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      href: '/lawyer/drafts'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{contentData.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600 mr-3">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-medium">{contentData.error}</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {contentData.welcome}, {user?.name}!
            </h1>
            <p className="text-blue-100">
              {language === 'pt' 
                ? 'Aqui está um resumo da sua atividade profissional'
                : 'Here\'s a summary of your professional activity'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(stat.href)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{contentData.thisWeek}</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {dashboardData.statistics?.completedConsultations || 0}
          </p>
          <p className="text-sm text-gray-600">
            {language === 'pt' ? 'consultas concluídas' : 'consultations completed'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{contentData.thisMonth}</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {dashboardData.statistics?.assignedConsultations || 0}
          </p>
          <p className="text-sm text-gray-600">
            {language === 'pt' ? 'consultas atribuídas' : 'consultations assigned'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{contentData.completionRate}</h3>
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {dashboardData.statistics?.assignedConsultations > 0 
              ? Math.round((dashboardData.statistics.completedConsultations / dashboardData.statistics.assignedConsultations) * 100)
              : 0}%
          </p>
          <p className="text-sm text-gray-600">
            {language === 'pt' ? 'taxa de conclusão' : 'completion rate'}
          </p>
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{contentData.recentConsultations}</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/lawyer/consultations')}
            >
              {contentData.viewAll}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          {(dashboardData.recentConsultations?.length || 0) > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentConsultations.map((consultation) => (
                <div key={consultation._id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {consultation.customerId.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{consultation.subject}</p>
                    <p className="text-sm text-gray-500">{consultation.customerId.name}</p>
                    <p className="text-xs text-gray-400">{formatDate(consultation.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(consultation.priority)}`}>
                      {consultation.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/lawyer/consultations/${consultation._id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {contentData.view}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{contentData.noConsultations}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{contentData.quickActions}</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              onClick={() => navigate('/lawyer/consultations')}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm font-medium">{contentData.newConsultation}</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              onClick={() => navigate('/lawyer/drafts')}
            >
              <FileCheck className="h-6 w-6" />
              <span className="text-sm font-medium">{contentData.createDraft}</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              onClick={() => navigate('/lawyer/projects')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">{contentData.viewProjects}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;

