import { Message, Consultation } from '../types/chat';

const API_BASE_URL = 'http://localhost:5000/api/chat';

// Get messages for a consultation
export const getMessages = async (consultationId: string, page: number = 1, limit: number = 50): Promise<{
  messages: Message[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/messages?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const data = await response.json();
  return data.data;
};

// Send a new message
export const sendMessage = async (consultationId: string, content: string, messageType: 'text' | 'file' = 'text', attachments: string[] = [], replyTo?: string): Promise<Message> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      messageType,
      attachments,
      replyTo
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send message');
  }

  const data = await response.json();
  return data.data.message;
};

// Mark messages as read
export const markMessagesAsRead = async (consultationId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/messages/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to mark messages as read');
  }
};

// Accept consultation (lawyer only)
export const acceptConsultation = async (consultationId: string): Promise<Consultation> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to accept consultation');
  }

  const data = await response.json();
  return data.data.consultation;
};

// Decline consultation (lawyer only)
export const declineConsultation = async (consultationId: string, reason?: string): Promise<Consultation> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/decline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to decline consultation');
  }

  const data = await response.json();
  return data.data.consultation;
};

// Complete consultation (lawyer only)
export const completeConsultation = async (consultationId: string): Promise<Consultation> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to complete consultation');
  }

  const data = await response.json();
  return data.data.consultation;
};
