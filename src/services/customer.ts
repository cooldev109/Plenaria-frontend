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
export const customerDashboardService = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Plan Management APIs
export const customerPlanService = {
  // Get current plan details
  getPlan: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/plan`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get available plans for upgrade
  getAvailablePlans: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/plans`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Project Management APIs
export const customerProjectService = {
  // Get available projects
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
      `${API_BASE_URL}/customer/projects?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get project by ID
  getProject: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/customer/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Consultation Management APIs
export const customerConsultationService = {
  // Get customer's consultations
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
      `${API_BASE_URL}/customer/consultations?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get consultation by ID
  getConsultation: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/customer/consultations/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create new consultation request
  createConsultation: async (consultationData: {
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/customer/consultations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(consultationData),
    });
    return handleResponse(response);
  },

  // Get consultation statistics
  getConsultationStats: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/consultations/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Course Management APIs
export const customerCourseService = {
  // Get available courses
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
      `${API_BASE_URL}/customer/courses?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Get course by ID
  getCourse: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/customer/courses/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Lawyer Management APIs
export const customerLawyerService = {
  // Get available lawyers
  getLawyers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_BASE_URL}/customer/lawyers?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },
};

// Convenience function for getting consultations
export const getConsultations = async (params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) => {
  return customerConsultationService.getConsultations(params);
};

