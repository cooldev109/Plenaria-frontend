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
  BookOpen,
  Play,
  Upload,
  X,
  Save,
  Star,
  Users,
  Award
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { lawyerCourseService } from '../../services/lawyer';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningObjectives: string[];
  isPublic: boolean;
  enrolledStudents: number;
  rating: number;
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}

interface CoursesResponse {
  success: boolean;
  data: {
    courses: Course[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

const LawyerCourses: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
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
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    duration: 0,
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    prerequisites: [] as string[],
    learningObjectives: [] as string[],
    isPublic: false
  });
  const [videoUpload, setVideoUpload] = useState<File | null>(null);
  const [thumbnailUpload, setThumbnailUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const content = {
    pt: {
      title: "Meus Cursos",
      addCourse: "Adicionar Curso",
      searchPlaceholder: "Buscar cursos...",
      filter: "Filtrar",
      category: "Categoria",
      level: "Nível",
      createdBy: "Criado por",
      createdAt: "Data de Criação",
      actions: "Ações",
      view: "Ver",
      edit: "Editar",
      delete: "Excluir",
      play: "Reproduzir",
      noCourses: "Nenhum curso encontrado",
      all: "Todos",
      loading: "Carregando...",
      error: "Erro ao carregar cursos",
      students: "Estudantes",
      rating: "Avaliação",
      tags: "Tags",
      duration: "Duração",
      level: "Nível",
      previous: "Anterior",
      next: "Próximo",
      page: "Página",
      of: "de",
      showing: "Mostrando",
      results: "resultados",
      createCourse: "Criar Curso",
      editCourse: "Editar Curso",
      courseTitle: "Título do Curso",
      courseDescription: "Descrição",
      courseCategory: "Categoria",
      courseTags: "Tags",
      courseDuration: "Duração (minutos)",
      courseLevel: "Nível",
      prerequisites: "Pré-requisitos",
      learningObjectives: "Objetivos de Aprendizagem",
      isPublic: "Público",
      uploadVideo: "Upload de Vídeo",
      uploadThumbnail: "Upload de Thumbnail",
      selectVideo: "Selecionar Vídeo",
      selectThumbnail: "Selecionar Thumbnail",
      save: "Salvar",
      cancel: "Cancelar",
      uploading: "Enviando...",
      success: "Curso salvo com sucesso!",
      deleteConfirm: "Tem certeza que deseja excluir este curso?",
      deleteSuccess: "Curso excluído com sucesso!",
      videoRequired: "Vídeo é obrigatório",
      titleRequired: "Título é obrigatório",
      descriptionRequired: "Descrição é obrigatória",
      categoryRequired: "Categoria é obrigatória",
      durationRequired: "Duração é obrigatória",
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
      hours: "horas",
      minutes: "minutos"
    },
    en: {
      title: "My Courses",
      addCourse: "Add Course",
      searchPlaceholder: "Search courses...",
      filter: "Filter",
      category: "Category",
      level: "Level",
      createdBy: "Created by",
      createdAt: "Created Date",
      actions: "Actions",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      play: "Play",
      noCourses: "No courses found",
      all: "All",
      loading: "Loading...",
      error: "Error loading courses",
      students: "Students",
      rating: "Rating",
      tags: "Tags",
      duration: "Duration",
      level: "Level",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      showing: "Showing",
      results: "results",
      createCourse: "Create Course",
      editCourse: "Edit Course",
      courseTitle: "Course Title",
      courseDescription: "Description",
      courseCategory: "Category",
      courseTags: "Tags",
      courseDuration: "Duration (minutes)",
      courseLevel: "Level",
      prerequisites: "Prerequisites",
      learningObjectives: "Learning Objectives",
      isPublic: "Public",
      uploadVideo: "Video Upload",
      uploadThumbnail: "Thumbnail Upload",
      selectVideo: "Select Video",
      selectThumbnail: "Select Thumbnail",
      save: "Save",
      cancel: "Cancel",
      uploading: "Uploading...",
      success: "Course saved successfully!",
      deleteConfirm: "Are you sure you want to delete this course?",
      deleteSuccess: "Course deleted successfully!",
      videoRequired: "Video is required",
      titleRequired: "Title is required",
      descriptionRequired: "Description is required",
      categoryRequired: "Category is required",
      durationRequired: "Duration is required",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      hours: "hours",
      minutes: "minutes"
    }
  };

  const contentData = content[language];

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data: CoursesResponse = await lawyerCourseService.getCourses({
        page: currentPage,
        limit: 12
      });
      
      if (data.success && data.data) {
        setCourses(data.data.courses);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ${contentData.hours}${mins > 0 ? ` ${mins} ${contentData.minutes}` : ''}`;
    }
    return `${mins} ${contentData.minutes}`;
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: [],
      duration: 0,
      level: 'beginner',
      prerequisites: [],
      learningObjectives: [],
      isPublic: false
    });
    setVideoUpload(null);
    setThumbnailUpload(null);
    setShowCreateModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      tags: course.tags,
      duration: course.duration,
      level: course.level,
      prerequisites: course.prerequisites,
      learningObjectives: course.learningObjectives,
      isPublic: course.isPublic
    });
    setVideoUpload(null);
    setThumbnailUpload(null);
    setShowCreateModal(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm(contentData.deleteConfirm)) {
      try {
        await lawyerCourseService.deleteCourse(courseId);
        fetchCourses();
        // Show success message
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoUpload(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailUpload(file);
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
    if (!formData.duration || formData.duration <= 0) {
      alert(contentData.durationRequired);
      return;
    }
    if (!editingCourse && !videoUpload) {
      alert(contentData.videoRequired);
      return;
    }

    try {
      setUploading(true);
      
      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        duration: formData.duration,
        level: formData.level,
        prerequisites: formData.prerequisites,
        learningObjectives: formData.learningObjectives,
        videoUrl: editingCourse?.videoUrl || '', // Will be updated with actual video URL
        thumbnailUrl: editingCourse?.thumbnailUrl || '' // Will be updated with actual thumbnail URL
      };

      if (editingCourse) {
        await lawyerCourseService.updateCourse(editingCourse._id, courseData);
      } else {
        await lawyerCourseService.createCourse(courseData);
      }

      setShowCreateModal(false);
      fetchCourses();
      // Show success message
    } catch (err) {
      console.error('Error saving course:', err);
    } finally {
      setUploading(false);
    }
  };

  const handlePlay = (course: Course) => {
    // Implement video playback functionality
    window.open(course.videoUrl, '_blank');
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
              ? 'Gerencie seus cursos e conteúdo educacional'
              : 'Manage your courses and educational content'
            }
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={handleCreateCourse}
        >
          <Plus className="h-4 w-4 mr-2" />
          {contentData.addCourse}
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
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{contentData.level}: {contentData.all}</option>
                <option value="beginner">{contentData.beginner}</option>
                <option value="intermediate">{contentData.intermediate}</option>
                <option value="advanced">{contentData.advanced}</option>
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

      {/* Courses Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center relative">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <BookOpen className="h-16 w-16 text-white" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-lg flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlay(course)}
                          className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
                        >
                          <Play className="h-8 w-8" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {course.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                          {contentData[course.level]}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatDuration(course.duration)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{course.enrolledStudents} {contentData.students}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{contentData.createdAt}: {formatDate(course.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {renderStars(course.rating)}
                          <span className="ml-1 text-sm text-gray-600">({course.rating})</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.isPublic ? (language === 'pt' ? 'Público' : 'Public') : (language === 'pt' ? 'Privado' : 'Private')}
                        </span>
                      </div>

                      {/* Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {course.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {course.tags.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{course.tags.length - 3}
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
                          onClick={() => handlePlay(course)}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {contentData.play}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCourse(course._id)}
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
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{contentData.noCourses}</h3>
              <p className="text-gray-600 mb-6">
                {language === 'pt' 
                  ? 'Comece criando seu primeiro curso'
                  : 'Start by creating your first course'
                }
              </p>
              <Button 
                onClick={handleCreateCourse}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {contentData.addCourse}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCourse ? contentData.editCourse : contentData.createCourse}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {contentData.courseTitle}
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
                      {contentData.courseCategory}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.courseDescription}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {contentData.courseDuration}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {contentData.courseLevel}
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="beginner">{contentData.beginner}</option>
                      <option value="intermediate">{contentData.intermediate}</option>
                      <option value="advanced">{contentData.advanced}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.courseTags}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.prerequisites}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Digite os pré-requisitos separados por vírgula' : 'Enter prerequisites separated by commas'}
                    value={formData.prerequisites.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      prerequisites: e.target.value.split(',').map(prereq => prereq.trim()).filter(prereq => prereq)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {contentData.learningObjectives}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'pt' ? 'Digite os objetivos separados por vírgula' : 'Enter objectives separated by commas'}
                    value={formData.learningObjectives.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      learningObjectives: e.target.value.split(',').map(obj => obj.trim()).filter(obj => obj)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {!editingCourse && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {contentData.uploadVideo}
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={!editingCourse}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {contentData.uploadThumbnail}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
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

export default LawyerCourses;

