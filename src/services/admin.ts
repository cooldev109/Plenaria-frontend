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

// Dashboard API
export const adminDashboardService = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// User Management APIs
export const adminUserService = {
  // Get all users with pagination and filters
  getUsers: async (params: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    lawyerStatus?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.role) queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);
    if (params.lawyerStatus) queryParams.append('lawyerStatus', params.lawyerStatus);

    const response = await fetch(
      `${API_BASE_URL}/admin/users?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user
  updateUser: async (id: string, userData: {
    name?: string;
    email?: string;
    role?: string;
    planId?: string;
    isActive?: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Approve lawyer application
  approveLawyer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/approve-lawyer`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Reject lawyer application
  rejectLawyer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/reject-lawyer`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user plan
  updateUserPlan: async (id: string, planId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/plan`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId }),
    });
    return handleResponse(response);
  },
};

// Plan Management APIs
export const adminPlanService = {
  // Get all plans
  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/plans`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create new plan
  createPlan: async (planData: {
    name: string;
    description: string;
    features: string[];
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    maxConsultations: number | null;
    hasProjectDatabase: boolean;
    hasCourses: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/plans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleResponse(response);
  },

  // Update plan
  updatePlan: async (id: string, planData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/plans/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleResponse(response);
  },

  // Delete plan
  deletePlan: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/plans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Project Management APIs
export const adminProjectService = {
  // Get all projects
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
      `${API_BASE_URL}/admin/projects?${queryParams}`,
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
    fileUrl: string;
    fileType: string;
    fileSize: number;
    isPublic: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return handleResponse(response);
  },

  // Update project
  updateProject: async (id: string, projectData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return handleResponse(response);
  },

  // Delete project
  deleteProject: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Course Management APIs
export const adminCourseService = {
  // Get all courses
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
      `${API_BASE_URL}/admin/courses?${queryParams}`,
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
    tags: string[];
    videoUrl: string;
    thumbnailUrl?: string;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    learningObjectives: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    return handleResponse(response);
  },

  // Update course
  updateCourse: async (id: string, courseData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    return handleResponse(response);
  },

  // Delete course
  deleteCourse: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};


// Consultation Management APIs
export const adminConsultationService = {
  // Get all consultations
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
      `${API_BASE_URL}/admin/consultations?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Assign consultation to lawyer
  assignConsultation: async (id: string, lawyerId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/consultations/${id}/assign`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ lawyerId }),
    });
    return handleResponse(response);
  },
};

// Unified Content API
export const adminContentService = {
  // Get all content (projects and courses)
  getContent: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/content`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

