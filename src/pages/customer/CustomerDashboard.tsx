import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Bell,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';

const CustomerDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProjects: 0,
      activeConsultations: 0,
      completedCourses: 0,
      unreadMessages: 0
    },
    recentActivity: [],
    quickStats: {
      thisWeek: 0,
      thisMonth: 0,
      completionRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    pt: {
      title: "Painel do Cliente",
      welcome: "Bem-vindo de volta",
      overview: "Visão Geral",
      recentActivity: "Atividade Recente",
      quickActions: "Ações Rápidas",
      statistics: "Estatísticas",
      projects: "Projetos",
      consultations: "Consultas",
      messages: "Mensagens",
      courses: "Cursos",
      viewAll: "Ver Todos",
      newProject: "Novo Projeto",
      scheduleConsultation: "Agendar Consulta",
      viewMessages: "Ver Mensagens",
      totalProjects: "Total de Projetos",
      activeConsultations: "Consultas Ativas",
      completedCourses: "Cursos Concluídos",
      unreadMessages: "Mensagens Não Lidas",
      thisWeek: "Esta Semana",
      thisMonth: "Este Mês",
      completionRate: "Taxa de Conclusão",
      noActivity: "Nenhuma atividade recente",
      loading: "Carregando...",
      error: "Erro ao carregar dados"
    },
    en: {
      title: "Customer Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      statistics: "Statistics",
      projects: "Projects",
      consultations: "Consultations",
      messages: "Messages",
      courses: "Courses",
      viewAll: "View All",
      newProject: "New Project",
      scheduleConsultation: "Schedule Consultation",
      viewMessages: "View Messages",
      totalProjects: "Total Projects",
      activeConsultations: "Active Consultations",
      completedCourses: "Completed Courses",
      unreadMessages: "Unread Messages",
      thisWeek: "This Week",
      thisMonth: "This Month",
      completionRate: "Completion Rate",
      noActivity: "No recent activity",
      loading: "Loading...",
      error: "Error loading data"
    }
  };

  const contentData = content[language];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/customer/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Set mock data for development
      setDashboardData({
        stats: {
          totalProjects: 5,
          activeConsultations: 2,
          completedCourses: 3,
          unreadMessages: 1
        },
        recentActivity: [
          { id: 1, type: 'project', title: 'Website Redesign', date: '2024-01-15', status: 'in_progress' },
          { id: 2, type: 'consultation', title: 'Legal Consultation', date: '2024-01-14', status: 'completed' },
          { id: 3, type: 'course', title: 'Business Law Basics', date: '2024-01-13', status: 'completed' }
        ],
        quickStats: {
          thisWeek: 3,
          thisMonth: 12,
          completionRate: 85
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: contentData.totalProjects,
      value: dashboardData.stats?.totalProjects || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: contentData.activeConsultations,
      value: dashboardData.stats?.activeConsultations || 0,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: contentData.completedCourses,
      value: dashboardData.stats?.completedCourses || 0,
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: contentData.unreadMessages,
      value: dashboardData.stats?.unreadMessages || 0,
      icon: Bell,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

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
                ? 'Aqui está um resumo da sua atividade recente'
                : 'Here\'s a summary of your recent activity'
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
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
          <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.quickStats?.thisWeek || 0}</p>
          <p className="text-sm text-gray-600">
            {language === 'pt' ? 'atividades esta semana' : 'activities this week'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{contentData.thisMonth}</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.quickStats?.thisMonth || 0}</p>
          <p className="text-sm text-gray-600">
            {language === 'pt' ? 'atividades este mês' : 'activities this month'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{contentData.completionRate}</h3>
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.quickStats?.completionRate || 0}%</p>
          <p className="text-sm text-gray-600">
            {language === 'pt' ? 'taxa de conclusão' : 'completion rate'}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{contentData.recentActivity}</h2>
            <Button variant="outline" size="sm">
              {contentData.viewAll}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          {(dashboardData.recentActivity?.length || 0) > 0 ? (
            <div className="space-y-4">
              {(dashboardData.recentActivity || []).map((activity: any) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    {activity.type === 'project' && <FileText className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'consultation' && <MessageSquare className="h-5 w-5 text-green-600" />}
                    {activity.type === 'course' && <BarChart3 className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status === 'completed' ? (language === 'pt' ? 'Concluído' : 'Completed') :
                       activity.status === 'in_progress' ? (language === 'pt' ? 'Em Andamento' : 'In Progress') :
                       activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{contentData.noActivity}</p>
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
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <Plus className="h-6 w-6" />
              <span className="text-sm font-medium">{contentData.newProject}</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm font-medium">{contentData.scheduleConsultation}</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
              <Bell className="h-6 w-6" />
              <span className="text-sm font-medium">{contentData.viewMessages}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;