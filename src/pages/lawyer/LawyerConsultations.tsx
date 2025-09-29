import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageSquare, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import MessageBubble from '../../components/chat/MessageBubble';
import MessageInput from '../../components/chat/MessageInput';
import ConsultationCard from '../../components/chat/ConsultationCard';
import { Consultation, Message } from '../../types/chat';
import { lawyerConsultationService } from '../../services/lawyer';
import { getMessages, sendMessage, markMessagesAsRead, acceptConsultation, declineConsultation, completeConsultation } from '../../services/chat';

const LawyerConsultations: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  // State management
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [availableConsultations, setAvailableConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  
  // Chat state
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    pt: {
      title: "Consultas Jurídicas",
      subtitle: "Gerencie suas consultas com clientes",
      searchPlaceholder: "Buscar consultas...",
      allStatus: "Todos os Status",
      allPriority: "Todas as Prioridades",
      noConsultations: "Nenhuma consulta encontrada",
      noConsultationSelected: "Selecione uma consulta para ver os detalhes",
      loading: "Carregando...",
      error: "Erro ao carregar consultas",
      accept: "Aceitar",
      decline: "Recusar",
      complete: "Concluir",
      accepting: "Aceitando...",
      declining: "Recusando...",
      completing: "Concluindo...",
      acceptConsultation: "Aceitar Consulta",
      declineConsultation: "Recusar Consulta",
      completeConsultation: "Concluir Consulta",
      reasonForDecline: "Motivo da recusa (opcional)",
      reasonPlaceholder: "Digite o motivo da recusa...",
      confirmAccept: "Tem certeza que deseja aceitar esta consulta?",
      confirmDecline: "Tem certeza que deseja recusar esta consulta?",
      confirmComplete: "Tem certeza que deseja concluir esta consulta?",
      confirm: "Confirmar",
      cancel: "Cancelar",
      chatNotActive: "Chat não está ativo ainda. Aceite a consulta para iniciar o chat.",
      sendMessage: "Enviar mensagem",
      typeMessage: "Digite sua mensagem...",
      online: "Online",
      offline: "Offline",
      lastSeen: "Visto por último",
      pendingRequests: "Solicitações Pendentes",
      activeConsultations: "Consultas Ativas",
      completedConsultations: "Consultas Concluídas"
    },
    en: {
      title: "Legal Consultations",
      subtitle: "Manage your client consultations",
      searchPlaceholder: "Search consultations...",
      allStatus: "All Status",
      allPriority: "All Priority",
      noConsultations: "No consultations found",
      noConsultationSelected: "Select a consultation to view details",
      loading: "Loading...",
      error: "Error loading consultations",
      accept: "Accept",
      decline: "Decline",
      complete: "Complete",
      accepting: "Accepting...",
      declining: "Declining...",
      completing: "Completing...",
      acceptConsultation: "Accept Consultation",
      declineConsultation: "Decline Consultation",
      completeConsultation: "Complete Consultation",
      reasonForDecline: "Reason for decline (optional)",
      reasonPlaceholder: "Enter reason for decline...",
      confirmAccept: "Are you sure you want to accept this consultation?",
      confirmDecline: "Are you sure you want to decline this consultation?",
      confirmComplete: "Are you sure you want to complete this consultation?",
      confirm: "Confirm",
      cancel: "Cancel",
      chatNotActive: "Chat is not active yet. Accept the consultation to start chatting.",
      sendMessage: "Send message",
      typeMessage: "Type your message...",
      online: "Online",
      offline: "Offline",
      lastSeen: "Last seen",
      pendingRequests: "Pending Requests",
      activeConsultations: "Active Consultations",
      completedConsultations: "Completed Consultations"
    }
  };

  const contentData = content[language];

  // Fetch consultations
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await lawyerConsultationService.getConsultations();
      setConsultations(data.consultations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available consultations (not assigned to any lawyer)
  const fetchAvailableConsultations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/lawyer/consultations/available', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available consultations');
      }

      const data = await response.json();
      return data.data.consultations || [];
    } catch (err) {
      console.error('Error fetching available consultations:', err);
      return [];
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
    if (consultation.chatStatus === 'active') {
      fetchMessages(consultation._id);
    }
  };

  // Handle accepting consultation
  const handleAcceptConsultation = async (consultationId: string) => {
    try {
      setActionLoading(consultationId);
      const updatedConsultation = await acceptConsultation(consultationId);
      
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === consultationId
            ? { ...consultation, ...updatedConsultation }
            : consultation
        )
      );
      
      if (selectedConsultation?._id === consultationId) {
        setSelectedConsultation(prev => prev ? { ...prev, ...updatedConsultation } : null);
        fetchMessages(consultationId);
      }
    } catch (err) {
      console.error('Error accepting consultation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle declining consultation
  const handleDeclineConsultation = async (consultationId: string) => {
    try {
      setActionLoading(consultationId);
      const updatedConsultation = await declineConsultation(consultationId, declineReason);
      
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === consultationId
            ? { ...consultation, ...updatedConsultation }
            : consultation
        )
      );
      
      setShowDeclineDialog(false);
      setDeclineReason('');
    } catch (err) {
      console.error('Error declining consultation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle completing consultation
  const handleCompleteConsultation = async (consultationId: string) => {
    try {
      setActionLoading(consultationId);
      const updatedConsultation = await completeConsultation(consultationId);
      
      setConsultations(prev => 
        prev.map(consultation => 
          consultation._id === consultationId
            ? { ...consultation, ...updatedConsultation }
            : consultation
        )
      );
      
      if (selectedConsultation?._id === consultationId) {
        setSelectedConsultation(prev => prev ? { ...prev, ...updatedConsultation } : null);
      }
    } catch (err) {
      console.error('Error completing consultation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle claiming consultation
  const handleClaimConsultation = async (consultationId: string) => {
    try {
      setActionLoading(consultationId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/lawyer/consultations/${consultationId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim consultation');
      }

      const data = await response.json();
      const claimedConsultation = data.data.consultation;
      
      // Remove from available consultations
      setAvailableConsultations(prev => 
        prev.filter(consultation => consultation._id !== consultationId)
      );
      
      // Add to assigned consultations
      setConsultations(prev => [claimedConsultation, ...prev]);
      
      // If this consultation is selected, update it
      if (selectedConsultation?._id === consultationId) {
        setSelectedConsultation(claimedConsultation);
      }
    } catch (err) {
      console.error('Error claiming consultation:', err);
    } finally {
      setActionLoading(null);
    }
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

  // Filter consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || consultation.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group consultations by status
  const pendingConsultations = filteredConsultations.filter(c => c.status === 'pending');
  const activeConsultations = filteredConsultations.filter(c => c.status === 'assigned' || c.status === 'in_progress');
  const completedConsultations = filteredConsultations.filter(c => c.status === 'completed' || c.status === 'cancelled');

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchConsultations();
      const available = await fetchAvailableConsultations();
      setAvailableConsultations(available);
    };
    loadData();
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contentData.title}</h1>
            <p className="text-gray-600">{contentData.subtitle}</p>
          </div>
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
            {filteredConsultations.length === 0 && availableConsultations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{contentData.noConsultations}</p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {/* Available Consultations */}
                {availableConsultations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {language === 'pt' ? 'Consultas Disponíveis' : 'Available Consultations'} ({availableConsultations.length})
                    </h3>
                    {availableConsultations.map((consultation) => (
                      <div key={consultation._id} className="border border-gray-200 rounded-lg p-3 mb-3 bg-yellow-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{consultation.subject}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{consultation.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {consultation.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {language === 'pt' ? 'Cliente:' : 'Client:'} {consultation.customerId.name}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleClaimConsultation(consultation._id)}
                            disabled={actionLoading === consultation._id}
                            className="ml-2 bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === consultation._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              language === 'pt' ? 'Reivindicar' : 'Claim'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending Requests */}
                {pendingConsultations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {contentData.pendingRequests} ({pendingConsultations.length})
                    </h3>
                    {pendingConsultations.map((consultation) => (
                      <ConsultationCard
                        key={consultation._id}
                        consultation={consultation}
                        isSelected={selectedConsultation?._id === consultation._id}
                        onClick={() => handleConsultationSelect(consultation)}
                      />
                    ))}
                  </div>
                )}

                {/* Active Consultations */}
                {activeConsultations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {contentData.activeConsultations} ({activeConsultations.length})
                    </h3>
                    {activeConsultations.map((consultation) => (
                      <ConsultationCard
                        key={consultation._id}
                        consultation={consultation}
                        isSelected={selectedConsultation?._id === consultation._id}
                        onClick={() => handleConsultationSelect(consultation)}
                      />
                    ))}
                  </div>
                )}

                {/* Completed Consultations */}
                {completedConsultations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {contentData.completedConsultations} ({completedConsultations.length})
                    </h3>
                    {completedConsultations.map((consultation) => (
                      <ConsultationCard
                        key={consultation._id}
                        consultation={consultation}
                        isSelected={selectedConsultation?._id === consultation._id}
                        onClick={() => handleConsultationSelect(consultation)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Consultation Details */}
        <div className="flex-1 flex flex-col">
          {selectedConsultation ? (
            <>
              {/* Consultation Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedConsultation.subject}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedConsultation.customerId.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {selectedConsultation.priority}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    variant={selectedConsultation.status === 'completed' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {selectedConsultation.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {selectedConsultation.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleAcceptConsultation(selectedConsultation._id)}
                        disabled={actionLoading === selectedConsultation._id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading === selectedConsultation._id ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        {actionLoading === selectedConsultation._id ? contentData.accepting : contentData.accept}
                      </Button>
                      <Button
                        onClick={() => setShowDeclineDialog(true)}
                        disabled={actionLoading === selectedConsultation._id}
                        variant="destructive"
                      >
                        {actionLoading === selectedConsultation._id ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        {actionLoading === selectedConsultation._id ? contentData.declining : contentData.decline}
                      </Button>
                    </>
                  )}
                  
                  {(selectedConsultation.status === 'assigned' || selectedConsultation.status === 'in_progress') && (
                    <Button
                      onClick={() => handleCompleteConsultation(selectedConsultation._id)}
                      disabled={actionLoading === selectedConsultation._id}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {actionLoading === selectedConsultation._id ? (
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {actionLoading === selectedConsultation._id ? contentData.completing : contentData.complete}
                    </Button>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="flex-1 overflow-y-auto p-4">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Description</Label>
                        <p className="text-sm text-gray-900">{selectedConsultation.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500">Priority</Label>
                          <p className="text-sm text-gray-900 capitalize">{selectedConsultation.priority}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Requested</Label>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedConsultation.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages Area */}
                {selectedConsultation.chatStatus === 'active' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 overflow-y-auto space-y-4">
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
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Message Input */}
              {selectedConsultation.chatStatus === 'active' ? (
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onTyping={setTyping}
                  disabled={messagesLoading}
                  placeholder={contentData.typeMessage}
                />
              ) : selectedConsultation.status === 'pending' ? (
                <div className="bg-yellow-50 border-t border-yellow-200 p-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {contentData.chatNotActive}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex items-center justify-center text-gray-500">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Consultation completed</span>
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
                  Select a consultation from the list to view details and manage it
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{contentData.declineConsultation}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">{contentData.reasonForDecline}</Label>
              <Textarea
                id="reason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder={contentData.reasonPlaceholder}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeclineDialog(false);
                  setDeclineReason('');
                }}
              >
                {contentData.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedConsultation && handleDeclineConsultation(selectedConsultation._id)}
                disabled={actionLoading === selectedConsultation?._id}
              >
                {actionLoading === selectedConsultation?._id ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                {contentData.decline}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawyerConsultations;
