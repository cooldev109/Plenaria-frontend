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
  Download,
  Upload,
  X,
  Save
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { lawyerProjectService } from '../../services/lawyer';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  fileUrl: string;
  fileType: string;
  fileSize: number;
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

const LawyerProjects: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    isPublic: false
  });
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const content = {
    pt: {
      title: "Meus Projetos",
      addProject: "Adicionar Projeto",
      searchPlaceholder: "Buscar projetos...",
      filter: "Filtrar",
      category: "Categoria",
      createdBy: "Criado por",
      createdAt: "Data de Criação",
      actions: "Ações",
      view: "Ver",
      edit: "Editar",
      delete: "Excluir",
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
      results: "resultados",
      createProject: "Criar Projeto",
      editProject: "Editar Projeto",
      projectTitle: "Título do Projeto",
      projectDescription: "Descrição",
      projectCategory: "Categoria",
      projectTags: "Tags",
      isPublic: "Público",
      uploadFile: "Upload de Arquivo",
      selectFile: "Selecionar Arquivo",
      save: "Salvar",
      cancel: "Cancelar",
      uploading: "Enviando...",
      success: "Projeto salvo com sucesso!",
      deleteConfirm: "Tem certeza que deseja excluir este projeto?",
      deleteSuccess: "Projeto excluído com sucesso!",
      fileRequired: "Arquivo é obrigatório",
      titleRequired: "Título é obrigatório",
      descriptionRequired: "Descrição é obrigatória",
      categoryRequired: "Categoria é obrigatória"
    },
    en: {
      title: "My Projects",
      addProject: "Add Project",
      searchPlaceholder: "Search projects...",
      filter: "Filter",
      category: "Category",
      createdBy: "Created by",
      createdAt: "Created Date",
      actions: "Actions",
      view: "View",
      edit: "Edit",
      delete: "Delete",
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
      results: "results",
      createProject: "Create Project",
      editProject: "Edit Project",
      projectTitle: "Project Title",
      projectDescription: "Description",
      projectCategory: "Category",
      projectTags: "Tags",
      isPublic: "Public",
      uploadFile: "File Upload",
      selectFile: "Select File",
      save: "Save",
      cancel: "Cancel",
      uploading: "Uploading...",
      success: "Project saved successfully!",
      deleteConfirm: "Are you sure you want to delete this project?",
      deleteSuccess: "Project deleted successfully!",
      fileRequired: "File is required",
      titleRequired: "Title is required",
      descriptionRequired: "Description is required",
      categoryRequired: "Category is required"
    }
  };

  const contentData = content[language];

  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      const data: ProjectsResponse = await lawyerProjectService.getProjects({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        category: selectedCategory || undefined
      });
      
      if (data.success && data.data) {
        setProjects(data.data.projects);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const handleCreateProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: [],
      isPublic: false
    });
    setFileUpload(null);
    setShowCreateModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      isPublic: project.isPublic
    });
    setFileUpload(null);
    setShowCreateModal(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm(contentData.deleteConfirm)) {
      try {
        await lawyerProjectService.deleteProject(projectId);
        fetchProjects();
        // Show success message
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert(contentData.titleRequired);
      return;
    }
    if (!formData.description.trim()) {
      alert(contentData.descriptionRequired);
      return;
    }
    if (!formData.category.trim()) {
      alert(contentData.categoryRequired);
      return;
    }
    if (!editingProject && !fileUpload) {
      alert(contentData.fileRequired);
      return;
    }

    try {
      setUploading(true);
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        isPublic: formData.isPublic,
        fileUrl: editingProject?.fileUrl || '', // Will be updated with actual file URL
        fileType: fileUpload?.type || editingProject?.fileType || '',
        fileSize: fileUpload?.size || editingProject?.fileSize || 0
      };

      if (editingProject) {
        await lawyerProjectService.updateProject(editingProject._id, projectData);
      } else {
        await lawyerProjectService.createProject(projectData);
      }

      setShowCreateModal(false);
      fetchProjects();
      // Show success message
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (project: Project) => {
    try {
      // Implement download functionality
      const link = document.createElement('a');
      link.href = project.fileUrl;
      link.download = `${project.title}.${project.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{contentData.title}</h1>
          <p className="text-gray-600 mt-1">
            {language === 'pt' 
              ? 'Gerencie seus projetos e documentos jurídicos'
              : 'Manage your legal projects and documents'
            }
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={handleCreateProject}
        >
          <Plus className="h-4 w-4 mr-2" />
          {contentData.addProject}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={contentData.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{contentData.category}: {contentData.all}</option>
                <option value="Direito Civil">Direito Civil</option>
                <option value="Direito Penal">Direito Penal</option>
                <option value="Direito Trabalhista">Direito Trabalhista</option>
                <option value="Direito Empresarial">Direito Empresarial</option>
                <option value="Direito Tributário">Direito Tributário</option>
                <option value="Direito de Família">Direito de Família</option>
                <option value="Outro">Outro</option>
              </select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {language === 'pt' ? 'Buscar' : 'Search'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="text-sm text-gray-600">
          {pagination.total} {contentData.results} {contentData.of} {pagination.pages} {contentData.page}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <FileText className="h-16 w-16 text-white" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.isPublic ? (language === 'pt' ? 'Público' : 'Public') : (language === 'pt' ? 'Privado' : 'Private')}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                      <div className="space-y-2 mb-4">
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
                          onClick={() => handleDownload(project)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {contentData.download}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {contentData.page} {pagination.current} {contentData.of} {pagination.pages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current <= 1}
                    >
                      {contentData.previous}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current >= pagination.pages}
                    >
                      {contentData.next}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{contentData.noProjects}</h3>
              <p className="text-gray-600 mb-6">
                {language === 'pt' 
                  ? 'Comece criando seu primeiro projeto'
                  : 'Start by creating your first project'
                }
              </p>
              <Button 
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {contentData.addProject}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProject ? contentData.editProject : contentData.createProject}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.projectTitle}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.projectDescription}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.projectCategory}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">{language === 'pt' ? 'Selecione uma categoria' : 'Select a category'}</option>
                    <option value="Direito Civil">Direito Civil</option>
                    <option value="Direito Penal">Direito Penal</option>
                    <option value="Direito Trabalhista">Direito Trabalhista</option>
                    <option value="Direito Empresarial">Direito Empresarial</option>
                    <option value="Direito Tributário">Direito Tributário</option>
                    <option value="Direito de Família">Direito de Família</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.projectTags}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Digite as tags separadas por vírgula' : 'Enter tags separated by commas'}
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {!editingProject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {contentData.uploadFile}
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!editingProject}
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    {contentData.isPublic}
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    {contentData.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {contentData.uploading}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {contentData.save}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerProjects;

