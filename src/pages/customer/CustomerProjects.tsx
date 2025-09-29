import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdBy: {
    _id: string;
    name: string;
  };
  isPublic: boolean;
  downloadCount: number;
  rating: number;
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

const CustomerProjects: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [currentPage, setCurrentPage] = useState(1);

  const content = {
    pt: {
      title: "Projetos Disponíveis",
      addProject: "Adicionar Projeto",
      searchPlaceholder: "Buscar projetos...",
      filter: "Filtrar",
      category: "Categoria",
      createdBy: "Criado por",
      createdAt: "Data de Criação",
      actions: "Ações",
      view: "Ver",
      download: "Baixar",
      noProjects: "Nenhum projeto encontrado",
      all: "Todos",
      loading: "Carregando...",
      error: "Erro ao carregar projetos",
      downloads: "Downloads",
      rating: "Avaliação",
      tags: "Tags",
      fileSize: "Tamanho do Arquivo",
      fileType: "Tipo de Arquivo",
      previous: "Anterior",
      next: "Próximo",
      page: "Página",
      of: "de",
      showing: "Mostrando",
      results: "resultados"
    },
    en: {
      title: "Available Projects",
      addProject: "Add Project",
      searchPlaceholder: "Search projects...",
      filter: "Filter",
      category: "Category",
      createdBy: "Created by",
      createdAt: "Created Date",
      actions: "Actions",
      view: "View",
      download: "Download",
      noProjects: "No projects found",
      all: "All",
      loading: "Loading...",
      error: "Error loading projects",
      downloads: "Downloads",
      rating: "Rating",
      tags: "Tags",
      fileSize: "File Size",
      fileType: "File Type",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      showing: "Showing",
      results: "results"
    }
  };

  const contentData = content[language];

  useEffect(() => {
    fetchProjects();
  }, [currentPage, selectedCategory, searchTerm]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`http://localhost:5000/api/customer/projects?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data: ProjectsResponse = await response.json();
      
      if (data.success && data.data) {
        setProjects(data.data.projects);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Search filter (client-side for additional filtering)
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter (client-side for additional filtering)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    setFilteredProjects(filtered);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const handleDownload = async (project: Project) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/customer/projects/${project._id}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Create a temporary link to download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title}.${project.fileType}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Refresh projects to update download count
        fetchProjects();
      }
    } catch (err) {
      console.error('Error downloading project:', err);
    }
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
            <AlertCircle className="h-6 w-6" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{contentData.title}</h1>
          <p className="text-gray-600 mt-1">
            {language === 'pt' 
              ? 'Gerencie seus projetos e acompanhe o progresso'
              : 'Manage your projects and track progress'
            }
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={() => navigate('/customer/projects/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          {contentData.addProject}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={contentData.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{contentData.category}: {contentData.all}</option>
            <option value="Desenvolvimento Web">Desenvolvimento Web</option>
            <option value="Aplicativo Mobile">Aplicativo Mobile</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Consultoria Jurídica">Consultoria Jurídica</option>
            <option value="Outro">Outro</option>
          </select>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            className="flex items-center justify-center"
            onClick={() => fetchProjects()}
          >
            <Search className="h-4 w-4 mr-2" />
            {contentData.filter}
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{project.description}</p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {project.category}
                  </span>
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{contentData.createdBy}: {project.createdBy.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{contentData.createdAt}: {formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{contentData.fileType}: {project.fileType.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>{contentData.fileSize}: {formatFileSize(project.fileSize)}</span>
                  </div>
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {renderStars(project.rating)}
                    <span className="ml-1 text-sm text-gray-600">({project.rating})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {project.downloadCount} {contentData.downloads}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/customer/projects/${project._id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {contentData.view}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(project)}
                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{contentData.noProjects}</h3>
          <p className="text-gray-600 mb-6">
            {language === 'pt' 
              ? 'Comece criando seu primeiro projeto'
              : 'Start by creating your first project'
            }
          </p>
          <Button 
            onClick={() => navigate('/customer/projects/new')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {contentData.addProject}
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {contentData.showing} {((pagination.current - 1) * 12) + 1} - {Math.min(pagination.current * 12, pagination.total)} {contentData.of} {pagination.total} {contentData.results}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={pagination.current === 1}
              >
                {contentData.previous}
              </Button>
              <span className="text-sm text-gray-600">
                {contentData.page} {pagination.current} {contentData.of} {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={pagination.current === pagination.pages}
              >
                {contentData.next}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProjects;