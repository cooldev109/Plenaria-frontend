export interface Message {
  _id: string;
  consultationId: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  senderRole: 'customer' | 'lawyer';
  content: string;
  messageType: 'text' | 'file' | 'system';
  attachments?: string[];
  isRead: boolean;
  readAt?: string;
  replyTo?: {
    _id: string;
    content: string;
    senderId: string;
  };
  editedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  _id: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  lawyerId?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  response?: string;
  attachments?: string[];
  requestedAt: string;
  answeredAt?: string;
  scheduledAt?: string;
  completedAt?: string;
  // Chat-related fields
  chatStartedAt?: string;
  lastMessageAt?: string;
  customerUnreadCount: number;
  lawyerUnreadCount: number;
  chatStatus: 'waiting_acceptance' | 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRequest {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
}

export interface ChatState {
  consultations: Consultation[];
  selectedConsultation: Consultation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  typing: boolean;
  onlineUsers: string[];
}

export interface MessageInput {
  content: string;
  messageType: 'text' | 'file';
  attachments?: File[];
  replyTo?: string;
}
