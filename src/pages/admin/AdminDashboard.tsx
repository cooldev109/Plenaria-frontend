import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Users, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Shield, 
  Briefcase, 
  Settings, 
  TrendingUp, 
  Eye, 
  ArrowRight,
  Crown,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    lawyerStatus?: string;
    plan?: {
      id: string;
      name: string;
      price: number;
    };
    createdAt: string;
  }[];
  totalUsers: number;
  totalAdmins: number;
  totalLawyers: number;
  totalCustomers: number;
  totalProjects: number;
  totalCourses: number;
  recentProjects: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
  recentCourses: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping dashboard fetch');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDashboardData(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user, authLoading]);

  const getEnhancedRoleBadge = (role: string, lawyerStatus?: string) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md px-3 py-1">
          <Shield className="w-3 h-3 mr-1" />
          ⭐ {t('role.admin')}
        </Badge>
      );
    }
    if (role === 'lawyer') {
      if (lawyerStatus === 'pending') {
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-md px-3 py-1">
            <Briefcase className="w-3 h-3 mr-1" />
            {t('status.pending')} {t('role.lawyer')}
          </Badge>
        );
      }
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-md px-3 py-1">
          <Briefcase className="w-3 h-3 mr-1" />
          {t('role.lawyer')}
        </Badge>
      );
    }
    return (
      <Badge className="bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0 shadow-md px-3 py-1">
        <Users className="w-3 h-3 mr-1" />
        {t('role.customer')}
      </Badge>
    );
  };

  const getPlanBadge = (planName: string) => {
    const planColors = {
      'Basic': 'from-blue-500 to-blue-600',
      'Plus': 'from-purple-500 to-purple-600',
      'Complete': 'from-teal-500 to-teal-600'
    };
    
    const colors = planColors[planName as keyof typeof planColors] || 'from-gray-500 to-gray-600';
    
    return (
      <Badge className={`bg-gradient-to-r ${colors} text-white border-0 shadow-md px-2 py-1 text-xs`}>
        {planName}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.noDataAvailable')}</h2>
          <p className="text-gray-600">{t('dashboard.unableToLoad')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                📊 {t('dashboard')}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {language === 'pt' 
                  ? 'Painel de controle administrativo - Gerencie usuários, planos e consultorias do sistema'
                  : 'Administrative control panel - Manage users, plans and consultations'
                }
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {language === 'pt' ? 'Sistema Online' : 'System Online'}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {language === 'pt' ? 'Total de Usuários' : 'Total Users'}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboardData.totalUsers}</div>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'pt' 
                  ? `${dashboardData.totalCustomers} clientes, ${dashboardData.totalLawyers} advogados`
                  : `${dashboardData.totalCustomers} customers, ${dashboardData.totalLawyers} lawyers`
                }
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                {language === 'pt' ? 'Usuários ativos' : 'Active users'}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {language === 'pt' ? 'Administradores' : 'Administrators'}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboardData.totalAdmins}</div>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'pt' ? 'Administradores do sistema' : 'System administrators'}
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <Crown className="w-3 h-3 mr-1" />
                {language === 'pt' ? 'Acesso total' : 'Full access'}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {language === 'pt' ? 'Projetos de Lei' : 'Legal Projects'}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboardData.totalProjects}</div>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'pt' ? 'Modelos disponíveis' : 'Available templates'}
              </p>
              <div className="mt-2 flex items-center text-xs text-purple-600">
                <FileText className="w-3 h-3 mr-1" />
                {language === 'pt' ? 'Banco de dados' : 'Database'}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {language === 'pt' ? 'Cursos de Capacitação' : 'Training Courses'}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{dashboardData.totalCourses}</div>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'pt' ? 'Materiais de treinamento' : 'Training materials'}
              </p>
              <div className="mt-2 flex items-center text-xs text-teal-600">
                <BookOpen className="w-3 h-3 mr-1" />
                {language === 'pt' ? 'Educação continuada' : 'Continuing education'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users Panel */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
                  {language === 'pt' ? 'Usuários Recentes' : 'Recent Users'}
                </div>
                <Link to="/admin/users">
                  <Button variant="outline" size="sm" className="text-xs">
                    {language === 'pt' ? 'Ver Todos' : 'View All'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'pt' 
                  ? 'Últimos usuários registrados no sistema'
                  : 'Latest users registered in the system'
                }
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {dashboardData.recentUsers.length > 0 ? (
                  dashboardData.recentUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className={`
                        p-4 border-b border-gray-100 transition-all duration-200 hover:shadow-md
                        ${user.role === 'admin' 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 flex items-center">
                            {user.name}
                            {user.role === 'admin' && (
                              <span className="ml-2 text-yellow-500">⭐</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate">{user.email}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            {getEnhancedRoleBadge(user.role, user.lawyerStatus)}
                            {user.role === 'customer' && user.plan && getPlanBadge(user.plan.name)}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {language === 'pt' ? 'Registrado em' : 'Registered on'} {formatDate(user.createdAt)}
                            </div>
                            {user.role === 'lawyer' && user.lawyerStatus === 'pending' && (
                              <div className="flex items-center text-xs text-amber-600">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {language === 'pt' ? 'Pendente' : 'Pending'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>{t('dashboard.noRecentUsers')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Content Panel */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-purple-600" />
                  {language === 'pt' ? 'Consultorias Recentes' : 'Recent Consultations'}
                </div>
                <Link to="/admin/content">
                  <Button variant="outline" size="sm" className="text-xs">
                    {language === 'pt' ? 'Gerenciar' : 'Manage'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'pt' 
                  ? 'Últimos projetos e cursos adicionados ao sistema'
                  : 'Latest projects and courses added to the system'
                }
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Recent Projects */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-purple-600" />
                      {language === 'pt' ? 'Últimos Projetos' : 'Latest Projects'}
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {dashboardData.recentProjects.length}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {dashboardData.recentProjects.length > 0 ? (
                      dashboardData.recentProjects.map((project) => (
                        <div key={project._id} className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                          <h5 className="font-medium text-gray-900 text-sm">{project.title}</h5>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {language === 'pt' ? 'Criado em' : 'Created on'} {formatDate(project.createdAt)}
                            </div>
                            <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                              {language === 'pt' ? 'Projeto' : 'Project'}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        {language === 'pt' ? 'Nenhum projeto recente' : 'No recent projects'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Courses */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-teal-600" />
                      {language === 'pt' ? 'Últimos Cursos' : 'Latest Courses'}
                    </div>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                      {dashboardData.recentCourses.length}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {dashboardData.recentCourses.length > 0 ? (
                      dashboardData.recentCourses.map((course) => (
                        <div key={course._id} className="p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200 hover:shadow-md transition-shadow">
                          <h5 className="font-medium text-gray-900 text-sm">{course.title}</h5>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {language === 'pt' ? 'Criado em' : 'Created on'} {formatDate(course.createdAt)}
                            </div>
                            <div className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded-full">
                              {language === 'pt' ? 'Curso' : 'Course'}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        {language === 'pt' ? 'Nenhum curso recente' : 'No recent courses'}
                      </div>
                    )}
                  </div>
                </div>

                <Link to="/admin/content">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md">
                    <Eye className="w-4 h-4 mr-2" />
                    {t('dashboard.viewAllContent')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-green-600" />
                {language === 'pt' ? 'Ações Rápidas' : 'Quick Actions'}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'pt' 
                  ? 'Acesso rápido às principais funcionalidades administrativas'
                  : 'Quick access to main administrative features'
                }
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Link to="/admin/users">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md h-12 flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {language === 'pt' ? 'Gerenciar Usuários' : 'Manage Users'}
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link to="/admin/plans">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md h-12 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {language === 'pt' ? 'Gerenciar Planos' : 'Manage Plans'}
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link to="/admin/content">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md h-12 flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {language === 'pt' ? 'Gerenciar Consultorias' : 'Manage Consultations'}
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-md h-12 flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {language === 'pt' ? 'Ver Consultorias' : 'View Consultations'}
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {language === 'pt' ? 'Sistema Funcionando' : 'System Operational'}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {language === 'pt' 
                        ? 'Todos os serviços estão funcionando normalmente'
                        : 'All services are running normally'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

