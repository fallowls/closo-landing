import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  CheckCheck, 
  Check,
  User,
  Shield,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./AdminLayout";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  conversationId: string;
  senderType: 'admin' | 'user';
  senderId: string;
  messageType: string;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  unreadCount: number;
  adminUnreadCount: number;
  lastMessageAt: string;
}

export default function UserChat() {
  const params = useParams();
  const userId = params.userId as string;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messageContent, setMessageContent] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Get or create conversation
  const { data: conversation, isLoading: conversationLoading } = useQuery<Conversation>({
    queryKey: ['admin-conversation', userId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/conversations/${userId}`);
      return response.json();
    },
    enabled: !!userId,
  });

  // Get messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['admin-messages', conversation?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/conversations/${conversation?.id}/messages`);
      return response.json();
    },
    enabled: !!conversation?.id,
    refetchInterval: 3000, // Poll every 3 seconds for now
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversation?.id && conversation.adminUnreadCount > 0) {
      apiRequest('PATCH', `/api/admin/conversations/${conversation.id}/mark-read`)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          queryClient.invalidateQueries({ queryKey: ['admin-conversation', userId] });
        })
        .catch(console.error);
    }
  }, [conversation?.id, conversation?.adminUnreadCount, queryClient, userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  const handleScroll = useCallback(() => {
    const nearBottom = isNearBottom();
    setShouldAutoScroll(nearBottom);
  }, [isNearBottom]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/admin/conversations/${conversation?.id}/messages`, {
        content,
        messageType: 'text',
      });
      return response.json();
    },
    onSuccess: () => {
      setMessageContent("");
      queryClient.invalidateQueries({ queryKey: ['admin-messages', conversation?.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-conversation', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!messageContent.trim() || !conversation?.id) return;
    sendMessageMutation.mutate(messageContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!userId) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">Invalid user ID</p>
        </div>
      </AdminLayout>
    );
  }

  if (conversationLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading conversation...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Chat Header */}
        <Card className="border-b border-slate-200 shadow-sm rounded-none">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/admin/users')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {conversation?.title || "Loading..."}
                  </h2>
                  <p className="text-sm text-slate-500">Chat Conversation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {messages.length} messages
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
          onScroll={handleScroll}
        >
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-600">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">No messages yet</h3>
              <p className="text-slate-500 text-sm max-w-md">
                Start the conversation by sending the first message to this user
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isAdmin = message.senderType === 'admin';
                const showTimestamp = index === 0 || 
                  new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 5 * 60 * 1000;

                return (
                  <div key={message.id}>
                    {showTimestamp && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    <div className={`flex items-start gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className={isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                          {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          isAdmin 
                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="text-xs text-slate-500">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAdmin && (
                            <span className="text-slate-400">
                              {message.isRead ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <Card className="border-t border-slate-200 shadow-lg rounded-none">
          <CardContent className="p-4">
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-full"
                disabled
              >
                <Paperclip className="h-5 w-5 text-slate-400" />
              </Button>
              
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type a message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="resize-none pr-12 min-h-[60px] max-h-32"
                  disabled={!conversation?.id}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || sendMessageMutation.isPending || !conversation?.id}
                  size="sm"
                  className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
