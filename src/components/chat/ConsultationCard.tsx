import React from 'react';
import { Consultation } from '../../types/chat';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';

interface ConsultationCardProps {
  consultation: Consultation;
  isSelected: boolean;
  onClick: () => void;
  showUnreadCount?: boolean;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  isSelected,
  onClick,
  showUnreadCount = true
}) => {
  const { language } = useLanguage();

  const content = {
    pt: {
      pending: 'Pendente',
      assigned: 'Atribuído',
      inProgress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
      waitingAcceptance: 'Aguardando Aceitação',
      active: 'Ativo',
      closed: 'Fechado',
      noLawyer: 'Sem Advogado',
      lastMessage: 'Última mensagem',
      requested: 'Solicitado'
    },
    en: {
      pending: 'Pending',
      assigned: 'Assigned',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
      waitingAcceptance: 'Waiting Acceptance',
      active: 'Active',
      closed: 'Closed',
      noLawyer: 'No Lawyer',
      lastMessage: 'Last message',
      requested: 'Requested'
    }
  };

  const contentData = content[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'assigned':
      case 'in_progress':
        return <MessageSquare className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return contentData.pending;
      case 'assigned':
        return contentData.assigned;
      case 'in_progress':
        return contentData.inProgress;
      case 'completed':
        return contentData.completed;
      case 'cancelled':
        return contentData.cancelled;
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return contentData.low;
      case 'medium':
        return contentData.medium;
      case 'high':
        return contentData.high;
      case 'urgent':
        return contentData.urgent;
      default:
        return priority;
    }
  };

  const getChatStatusText = (chatStatus: string) => {
    switch (chatStatus) {
      case 'waiting_acceptance':
        return contentData.waitingAcceptance;
      case 'active':
        return contentData.active;
      case 'closed':
        return contentData.closed;
      default:
        return chatStatus;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: language === 'pt' ? ptBR : enUS 
    });
  };

  const getUnreadCount = () => {
    // This would be determined by the current user's role
    // For now, we'll show the total unread count
    return consultation.customerUnreadCount + consultation.lawyerUnreadCount;
  };

  return (
    <div
      className={`p-4 border-b cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {consultation.subject}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {consultation.description}
          </p>
        </div>
        
        {/* Unread Count */}
        {showUnreadCount && getUnreadCount() > 0 && (
          <div className="ml-2 flex-shrink-0">
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {getUnreadCount()}
            </span>
          </div>
        )}
      </div>

      {/* Status and Priority */}
      <div className="flex items-center space-x-2 mb-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
          {getStatusIcon(consultation.status)}
          <span className="ml-1">{getStatusText(consultation.status)}</span>
        </span>
        
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(consultation.priority)}`}>
          {getPriorityText(consultation.priority)}
        </span>
      </div>

      {/* Chat Status */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <MessageSquare className="h-3 w-3" />
          <span>{getChatStatusText(consultation.chatStatus)}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>
            {consultation.lastMessageAt 
              ? `${contentData.lastMessage}: ${formatTime(consultation.lastMessageAt)}`
              : `${contentData.requested}: ${formatTime(consultation.requestedAt)}`
            }
          </span>
        </div>
      </div>

      {/* Lawyer Info */}
      {consultation.lawyerId ? (
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <User className="h-3 w-3 mr-1" />
          <span>{consultation.lawyerId.name}</span>
        </div>
      ) : (
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <User className="h-3 w-3 mr-1" />
          <span>{contentData.noLawyer}</span>
        </div>
      )}
    </div>
  );
};

export default ConsultationCard;
