import React from 'react';
import { Message } from '../../types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Check, 
  CheckCheck, 
  Clock, 
  FileText, 
  Image, 
  Video, 
  Download,
  Reply
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  onReply?: (message: Message) => void;
  onDownload?: (url: string, filename: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  showAvatar = true, 
  onReply,
  onDownload 
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isOwnMessage = message.senderId._id === user?._id;
  const isSystemMessage = message.messageType === 'system';

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: language === 'pt' ? ptBR : enUS 
    });
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension || '')) {
      return <Video className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  const getMessageStatus = () => {
    if (isOwnMessage && !isSystemMessage) {
      if (message.isRead) {
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      } else {
        return <Check className="h-3 w-3 text-gray-400" />;
      }
    }
    return null;
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && (
          <div className="flex-shrink-0 mr-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {message.senderId.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          {!isOwnMessage && (
            <div className="text-xs text-gray-500 mb-1 px-2">
              {message.senderId.name}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {/* Reply Reference */}
            {message.replyTo && (
              <div className={`text-xs mb-2 p-2 rounded ${
                isOwnMessage ? 'bg-blue-400' : 'bg-gray-200'
              }`}>
                <div className="flex items-center mb-1">
                  <Reply className="h-3 w-3 mr-1" />
                  <span className="font-medium">
                    {message.replyTo.senderId === user?._id ? 'You' : message.senderId.name}
                  </span>
                </div>
                <div className="truncate">{message.replyTo.content}</div>
              </div>
            )}

            {/* Message Content */}
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded ${
                      isOwnMessage ? 'bg-blue-400' : 'bg-gray-200'
                    }`}
                  >
                    {getFileIcon(attachment)}
                    <span className="ml-2 text-sm truncate flex-1">
                      {attachment.split('/').pop()}
                    </span>
                    {onDownload && (
                      <button
                        onClick={() => onDownload(attachment, attachment.split('/').pop() || 'file')}
                        className="ml-2 p-1 hover:bg-gray-300 rounded"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Footer */}
          <div className={`flex items-center mt-1 px-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
            {getMessageStatus() && (
              <span className={`ml-1 ${isOwnMessage ? 'mr-1' : 'ml-1'}`}>
                {getMessageStatus()}
              </span>
            )}
            {onReply && !isSystemMessage && (
              <button
                onClick={() => onReply(message)}
                className="ml-2 text-xs text-gray-500 hover:text-gray-700"
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Own Avatar */}
        {showAvatar && isOwnMessage && (
          <div className="flex-shrink-0 ml-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

