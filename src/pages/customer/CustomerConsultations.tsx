import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  Search,
  Filter,
  Send,
  Paperclip,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import MessageBubble from '../../components/chat/MessageBubble';
import MessageInput from '../../components/chat/MessageInput';
import ConsultationCard from '../../components/chat/ConsultationCard';
import { Consultation, Message, ConsultationRequest } from '../../types/chat';
import { customerConsultationService, customerLawyerService } from '../../services/customer';
import { getMessages, sendMessage, markMessagesAsRead } from '../../services/chat';
import LawyerSelector from '../../components/consultation/LawyerSelector';

const CustomerConsultations: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // New consultation request
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestData, setRequestData] = useState<ConsultationRequest>({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);
  const [showLawyerSelector, setShowLawyerSelector] = useState(false);
  
  // Chat state
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    pt: {
      title: "Minhas Consultas",
      newConsultation: "Nova Consulta",
      searchPlaceholder: "Buscar consultas...",
      allStatus: "Todos os Status",
      allPriority: "Todas as Prioridades",
      noConsultations: "Nenhuma consulta encontrada",
      noConsultationSelected: "Selecione uma consulta para ver as mensagens",
      loading: "Carregando...",
      error: "Erro ao carregar consultas",
      requestConsultation: "Solicitar Consulta",
      subject: "Assunto",
      subjectPlaceholder: "Digite o assunto da consulta",
      description: "Descrição",
      descriptionPlaceholder: "Descreva sua consulta em detalhes",
      priority: "Prioridade",
      submit: "Enviar Solicitação",
      submitting: "Enviando...",
      chatNotActive: "Chat não está ativo ainda. Aguarde o advogado aceitar a consulta.",
      sendMessage: "Enviar mensagem",
      typeMessage: "Digite sua mensagem...",
      online: "Online",
      offline: "Offline",
      lastSeen: "Visto por último"
    },
    en: {
      title: "My Consultations",
      newConsultation: "New Consultation",
      searchPlaceholder: "Search consultations...",
      allStatus: "All Status",
      allPriority: "All Priority",
      noConsultations: "No consultations found",
      noConsultationSelected: "Select a consultation to view messages",
      loading: "Loading...",
      error: "Error loading consultations",
      requestConsultation: "Request Consultation",
      subject: "Subject",
      subjectPlaceholder: "Enter consultation subject",
      description: "Description",
      descriptionPlaceholder: "Describe your consultation in detail",
      priority: "Priority",
      submit: "Submit Request",
      submitting: "Submitting...",
      chatNotActive: "Chat is not active yet. Wait for lawyer to accept the consultation.",
      sendMessage: "Send message",
      typeMessage: "Type your message...",
      online: "Online",
      offline: "Offline",
      lastSeen: "Last seen"
    }
  };

  const contentData = content[language];

  // Fetch consultations
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await customerConsultationService.getConsultations();
      setConsultations(data.consultations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected consultation
  const fetchMessages = async (consultationId: string) => {
    try {
      setMessagesLoading(true);
      const data = await getMessages(consultationId);
      setMessages(data.messages);
      
      // Mark messages as read
      await markMessagesAsRead(consultationId);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Handle consultation selection
  const handleConsultationSelect = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    fetchMessages(consultation._id);
  };

  // Handle sending message
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedConsultation || !content.trim()) return;

    try {
      const attachmentUrls: string[] = [];
      // TODO: Handle file uploads
      
      const newMessage = await sendMessage(
        selectedConsultation._id,
        content,
        'text',
        attachmentUrls
      );
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update consultation's last message time
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === selectedConsultation._id
            ? { ...consultation, lastMessageAt: newMessage.createdAt }
            : consultation
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle new consultation request
  const handleSubmitRequest = async () => {
    if (!requestData.subject.trim() || !requestData.description.trim()) return;

    try {
      setSubmittingRequest(true);
      
      const consultationData = {
        ...requestData,
        lawyerId: selectedLawyerId
      };
      
      await customerConsultationService.createConsultation(consultationData);
      
      // Reset form and close dialog
      setRequestData({ subject: '', description: '', priority: 'medium' });
      setSelectedLawyerId(null);
      setIsRequestDialogOpen(false);
      
      // Refresh consultations
      await fetchConsultations();
    } catch (err) {
      console.error('Error submitting request:', err);
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || consultation.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
  return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{contentData.loading}</p>
        </div>
    </div>
  );
}

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{contentData.title}</h1>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {contentData.newConsultation}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{contentData.requestConsultation}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">{contentData.subject}</Label>
                  <Input
                    id="subject"
                    value={requestData.subject}
                    onChange={(e) => setRequestData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder={contentData.subjectPlaceholder}
                  />
                </div>
                <div>
                  <Label htmlFor="description">{contentData.description}</Label>
                  <Textarea
                    id="description"
                    value={requestData.description}
                    onChange={(e) => setRequestData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={contentData.descriptionPlaceholder}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">{contentData.priority}</Label>
                  <Select
                    value={requestData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                      setRequestData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Lawyer Selection */}
                <div>
                  <Label>Choose Lawyer</Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLawyerSelector(true)}
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {selectedLawyerId 
                        ? `Selected Lawyer` 
                        : language === 'pt' 
                          ? 'Escolher Advogado (Opcional)'
                          : 'Choose Lawyer (Optional)'
                      }
                    </Button>
                    {selectedLawyerId && (
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'pt' 
                          ? 'Advogado específico selecionado'
                          : 'Specific lawyer selected'
                        }
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={submittingRequest || !requestData.subject.trim() || !requestData.description.trim()}
                  className="w-full"
                >
                  {submittingRequest ? contentData.submitting : contentData.submit}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={contentData.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{contentData.allStatus}</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{contentData.allPriority}</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Consultations List */}
        <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {filteredConsultations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{contentData.noConsultations}</p>
              </div>
            ) : (
              filteredConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation._id}
                  consultation={consultation}
                  isSelected={selectedConsultation?._id === consultation._id}
                  onClick={() => handleConsultationSelect(consultation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConsultation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedConsultation.subject}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      {selectedConsultation.lawyerId ? (
                        <>
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {selectedConsultation.lawyerId.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {selectedConsultation.chatStatus === 'active' ? contentData.online : contentData.offline}
                          </Badge>
                        </>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          Waiting for lawyer assignment
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={selectedConsultation.status === 'completed' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {selectedConsultation.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      onDownload={(url, filename) => {
                        // TODO: Implement file download
                        console.log('Download:', url, filename);
                      }}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedConsultation.chatStatus === 'active' ? (
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onTyping={setTyping}
                  disabled={messagesLoading}
                  placeholder={contentData.typeMessage}
                />
              ) : (
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex items-center justify-center text-gray-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{contentData.chatNotActive}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {contentData.noConsultationSelected}
                </h3>
                <p className="text-sm">
                  Select a consultation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lawyer Selector Dialog */}
      <Dialog open={showLawyerSelector} onOpenChange={setShowLawyerSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {language === 'pt' ? 'Escolher Advogado' : 'Choose Lawyer'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <LawyerSelector
              selectedLawyerId={selectedLawyerId}
              onLawyerSelect={setSelectedLawyerId}
              onClose={() => setShowLawyerSelector(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerConsultations;