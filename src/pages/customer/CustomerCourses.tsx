import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Star, 
  Users, 
  Eye,
  CheckCircle,
  Lock
} from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Course {
  _id: string;
  title: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  price?: number;
  rating?: number;
  enrolledStudents?: number;
  lessons?: number;
  certificate?: boolean;
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

const CustomerCourses: React.FC = () => {
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

  const content = {
    pt: {
      title: "Cursos Disponíveis",
      instructor: "Instrutor",
      duration: "Duração",
      rating: "Avaliação",
      view: "Ver",
      noCourses: "Nenhum curso encontrado",
      hours: "horas",
      minutes: "minutos",
      loading: "Carregando...",
      error: "Erro ao carregar cursos",
      lessons: "lições",
      students: "estudantes",
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
      enroll: "Inscrever-se",
      search: "Buscar cursos...",
      category: "Categoria",
      level: "Nível",
      allCategories: "Todas as categorias",
      allLevels: "Todos os níveis",
      previous: "Anterior",
      next: "Próximo",
      page: "Página",
      of: "de",
      results: "resultados",
      createdBy: "Criado por",
      createdAt: "Criado em"
    },
    en: {
      title: "Available Courses",
      instructor: "Instructor",
      duration: "Duration",
      rating: "Rating",
      view: "View",
      noCourses: "No courses found",
      hours: "hours",
      minutes: "minutes",
      loading: "Loading...",
      error: "Error loading courses",
      lessons: "lessons",
      students: "students",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      enroll: "Enroll",
      search: "Search courses...",
      category: "Category",
      level: "Level",
      allCategories: "All categories",
      allLevels: "All levels",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      results: "results",
      createdBy: "Created by",
      createdAt: "Created at"
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
      
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);

      const response = await fetch(`http://localhost:5000/api/customer/courses?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch courses');
      }

      const data: CoursesResponse = await response.json();
      
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ${contentData.hours}${mins > 0 ? ` ${mins} ${contentData.minutes}` : ''}`;
    }
    return `${mins} ${contentData.minutes}`;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{contentData.title}</h1>
        <p className="text-gray-600 mt-1">
          {language === 'pt' 
            ? 'Aprenda com os melhores especialistas em direito'
            : 'Learn from the best legal experts'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={contentData.search}
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
                <option value="">{contentData.allCategories}</option>
                <option value="Direito Civil">Direito Civil</option>
                <option value="Direito Penal">Direito Penal</option>
                <option value="Direito Trabalhista">Direito Trabalhista</option>
                <option value="Direito Empresarial">Direito Empresarial</option>
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{contentData.allLevels}</option>
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
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {course.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {contentData[course.level]}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{contentData.createdBy}: {course.createdBy.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatDuration(course.duration)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          <span>{contentData.createdAt}: {formatDate(course.createdAt)}</span>
                        </div>
                      </div>

                      {course.rating && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(course.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {course.rating.toFixed(1)} ({course.enrolledStudents || 0} {contentData.students})
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          onClick={() => navigate(`/customer/courses/${course._id}`)}
                        >
                          {contentData.view}
                        </Button>
                        {course.price && (
                          <div className="flex items-center text-sm font-semibold text-gray-900">
                            ${course.price}
                          </div>
                        )}
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
              <p className="text-gray-600">
                {language === 'pt' 
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Try adjusting your search filters'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCourses;