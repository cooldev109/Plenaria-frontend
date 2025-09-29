import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { 
  Send, 
  Paperclip, 
  Smile, 
  X,
  FileText,
  Image,
  Video
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder,
  maxLength = 5000
}) => {
  const { language } = useLanguage();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const content = {
    pt: {
      placeholder: 'Digite sua mensagem...',
      send: 'Enviar',
      attachFile: 'Anexar arquivo',
      removeFile: 'Remover arquivo',
      typing: 'Digitando...',
      maxLength: 'Máximo de caracteres atingido'
    },
    en: {
      placeholder: 'Type your message...',
      send: 'Send',
      attachFile: 'Attach file',
      removeFile: 'Remove file',
      typing: 'Typing...',
      maxLength: 'Maximum characters reached'
    }
  };

  const contentData = content[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      
      // Typing indicator
      if (onTyping) {
        setIsTyping(true);
        onTyping(true);
        
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          onTyping(false);
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      if (onTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'application/zip', 'application/x-rar-compressed',
        'video/mp4', 'video/avi', 'video/quicktime'
      ];
      
      return file.size <= maxSize && allowedTypes.includes(file.type);
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        {/* File Upload Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder || contentData.placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-32 resize-none pr-12"
            rows={1}
          />
          
          {/* Character Count */}
          {message.length > maxLength * 0.8 && (
            <div className="absolute bottom-1 right-12 text-xs text-gray-500">
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          size="sm"
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="mt-2 text-xs text-gray-500">
          {contentData.typing}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
