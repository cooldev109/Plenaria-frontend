const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Dashboard APIs
export const lawyerDashboardService = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/lawyer/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Consultation Management APIs
export const lawyerConsultationService = {
  // Get assigned consultations
  getConsultations: async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(
      `${API_BASE_URL}/lawyer/consultations?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get consultation by ID
  getConsultation: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lawyer/consultations/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update consultation status and response
  updateConsultation: async (id: string, updateData: {
    status?: string;
    response?: string;
    notes?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/lawyer/consultations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  // Get consultation statistics
  getConsultationStats: async () => {
    const response = await fetch(`${API_BASE_URL}/lawyer/consultations/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Project Management APIs
export const lawyerProjectService = {
  // Get lawyer's projects
  getProjects: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_BASE_URL}/lawyer/projects?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Create new project
  createProject: async (projectData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    file?: File;
  }) => {
    const formData = new FormData();
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);
    formData.append('category', projectData.category);
    formData.append('tags', JSON.stringify(projectData.tags));
    if (projectData.file) {
      formData.append('file', projectData.file);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/lawyer/projects`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update project
  updateProject: async (id: string, projectData: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    file?: File;
  }) => {
    const formData = new FormData();
    if (projectData.title) formData.append('title', projectData.title);
    if (projectData.description) formData.append('description', projectData.description);
    if (projectData.category) formData.append('category', projectData.category);
    if (projectData.tags) formData.append('tags', JSON.stringify(projectData.tags));
    if (projectData.file) formData.append('file', projectData.file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/lawyer/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete project
  deleteProject: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lawyer/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Course Management APIs
export const lawyerCourseService = {
  // Get lawyer's courses
  getCourses: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.level) queryParams.append('level', params.level);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_BASE_URL}/lawyer/courses?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Create new course
  createCourse: async (courseData: {
    title: string;
    description: string;
    category: string;
    level: string;
    duration: number;
    tags: string[];
    prerequisites: string[];
    learningObjectives: string[];
    video?: File;
    thumbnail?: File;
  }) => {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('category', courseData.category);
    formData.append('level', courseData.level);
    formData.append('duration', courseData.duration.toString());
    formData.append('tags', JSON.stringify(courseData.tags));
    formData.append('prerequisites', JSON.stringify(courseData.prerequisites));
    formData.append('learningObjectives', JSON.stringify(courseData.learningObjectives));
    if (courseData.video) formData.append('video', courseData.video);
    if (courseData.thumbnail) formData.append('thumbnail', courseData.thumbnail);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/lawyer/courses`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update course
  updateCourse: async (id: string, courseData: {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    duration?: number;
    tags?: string[];
    prerequisites?: string[];
    learningObjectives?: string[];
    video?: File;
    thumbnail?: File;
  }) => {
    const formData = new FormData();
    if (courseData.title) formData.append('title', courseData.title);
    if (courseData.description) formData.append('description', courseData.description);
    if (courseData.category) formData.append('category', courseData.category);
    if (courseData.level) formData.append('level', courseData.level);
    if (courseData.duration) formData.append('duration', courseData.duration.toString());
    if (courseData.tags) formData.append('tags', JSON.stringify(courseData.tags));
    if (courseData.prerequisites) formData.append('prerequisites', JSON.stringify(courseData.prerequisites));
    if (courseData.learningObjectives) formData.append('learningObjectives', JSON.stringify(courseData.learningObjectives));
    if (courseData.video) formData.append('video', courseData.video);
    if (courseData.thumbnail) formData.append('thumbnail', courseData.thumbnail);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/lawyer/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete course
  deleteCourse: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lawyer/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Convenience function for getting consultations
export const getConsultations = async (params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) => {
  return lawyerConsultationService.getConsultations(params);
};