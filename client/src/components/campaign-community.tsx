import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User, Shield, Wifi, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  conversationId: string;
  senderType: 'user' | 'admin';
  senderId: string;
  messageType: 'text';
  content: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentSize?: number | null;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  unreadCount: number;
  adminUnreadCount: number;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export default function CampaignCommunity() {
  const [messageContent, setMessageContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get or create conversation
  const { data: conversation, isLoading: conversationLoading, error: conversationError } = useQuery<Conversation>({
    queryKey: ['/api/user/conversation'],
    retry: 2,
  });

  // Get messages
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery<Message[]>({
    queryKey: ['/api/user/messages'],
    refetchInterval: 5000,
    enabled: !!conversation && !conversationError,
    retry: 2,
  });

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await apiRequest('POST', '/api/user/messages/upload', formData);
      const data = await response.json();
      
      toast({
        title: "File Shared",
        description: `Successfully shared ${file.name}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/user/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/conversation'] });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to open file",
        variant: "destructive"
      });
    }
  };

  // Check if user is near bottom of scroll area
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const nearBottom = isNearBottom();
    setShouldAutoScroll(nearBottom);
    
    if (!isUserScrolling) {
      setIsUserScrolling(true);
      setTimeout(() => setIsUserScrolling(false), 1000);
    }
  }, [isNearBottom, isUserScrolling]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && !isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll, isUserScrolling]);

  // Mark admin messages as read when viewing
  useEffect(() => {
    const unreadAdminMessages = messages.filter(
      msg => msg.senderType === 'admin' && !msg.isRead
    );

    if (unreadAdminMessages.length > 0) {
      apiRequest('PATCH', '/api/user/messages/mark-read', {})
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/user/messages'] });
          queryClient.invalidateQueries({ queryKey: ['/api/user/conversation'] });
        })
        .catch(err => console.error('Failed to mark messages as read:', err));
    }
  }, [messages, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/user/messages', { content });
      return response.json();
    },
    onSuccess: () => {
      setMessageContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/user/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/conversation'] });
    },
    onError: (error) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (conversationError) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to support chat. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }
    
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message before sending",
        variant: "destructive"
      });
      return;
    }
    sendMessageMutation.mutate(messageContent);
  };

  const isLoading = conversationLoading || messagesLoading;
  const hasError = Boolean(conversationError || messagesError);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
             ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-lg border">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <MessageSquare className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900">Campaign Community</h3>
            <p className="text-sm text-slate-600">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Chat with support team
                  {conversation && conversation.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {conversation.unreadCount} new
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs">
            <Wifi className="h-3 w-3 text-green-500" />
            <span className="text-green-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {hasError && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-800">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm">Connection Error</p>
              <p className="text-xs">Failed to connect to support chat. Please refresh the page and try again.</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">
              {hasError ? 'Unable to Load Chat' : 'Start a conversation'}
            </h3>
            <p className="text-slate-500 text-sm max-w-md">
              {hasError 
                ? 'There was an error loading the chat. Please refresh the page to try again.'
                : 'Send a message to connect with our support team. We\'re here to help with your campaigns!'
              }
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end space-x-2 ${
                message.senderType === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="h-8 w-8 mb-1">
                <AvatarFallback className={
                  message.senderType === 'admin'
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }>
                  {message.senderType === 'admin' ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col max-w-[70%] ${
                  message.senderType === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.senderType === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  {message.attachmentUrl ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-white/20 rounded">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.attachmentName}</p>
                          <p className="text-xs opacity-70">
                            {message.attachmentSize ? (message.attachmentSize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs h-7"
                        onClick={() => handleDownload(message.attachmentUrl!, message.attachmentName!)}
                      >
                        Download
                      </Button>
                      {message.content && <p className="text-sm mt-2">{message.content}</p>}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 px-1">
                  {formatTime(message.createdAt)}
                  {message.senderType === 'admin' && message.isRead && (
                    <span className="ml-1 text-blue-500">• Read</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-white rounded-b-lg">
        <div className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-10 w-10 p-0 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={hasError || !conversation || isUploading}
          >
            {isUploading ? (
              <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1 relative">
            <Textarea
              placeholder={hasError ? "Chat unavailable" : !conversation ? "Connecting..." : "Type your message..."}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              disabled={hasError || !conversation || sendMessageMutation.isPending}
              className="resize-none pr-12 min-h-[60px] max-h-32 border-slate-300 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && conversation && !hasError) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!conversation || !messageContent.trim() || sendMessageMutation.isPending || hasError}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
