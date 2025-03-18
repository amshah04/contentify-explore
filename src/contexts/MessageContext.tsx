
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  content?: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  read_at: string | null;
  media_url?: string | null;
  profiles?: Profile | null;
}

export interface Conversation {
  id: string;
  created_at: string;
  participants: {
    id: string;
    user_id: string;
    username?: string;
    avatar_url?: string;
  }[];
  last_message?: Message | null;
}

interface MessageContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  startConversation: (userId: string) => Promise<string | null>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, mediaUrl?: string) => Promise<void>;
  fetchMoreMessages: () => Promise<void>;
  resetState: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messagesPage, setMessagesPage] = useState(1);
  const messagesPerPage = 20;

  // Fetch conversations
  useEffect(() => {
    if (user) {
      fetchConversations();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            handleNewMessage(payload.new as Message);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          conversation_id,
          conversations:conversation_id (
            id,
            created_at
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform data to match the Conversation interface
      const transformedData: Conversation[] = [];
      
      for (const item of data || []) {
        const conversation = item.conversations as Omit<Conversation, 'participants' | 'last_message'>;
        
        // Fetch participants for this conversation using our new view
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants_with_profiles')
          .select('*')
          .eq('conversation_id', conversation.id);
          
        if (participantsError) {
          console.error('Error fetching participants:', participantsError);
          continue;
        }
        
        const conversationWithParticipants: Conversation = {
          ...conversation,
          participants: participantsData || [],
          last_message: null
        };
        
        // Fetch last message for this conversation using the new view
        const { data: messageData, error: messageError } = await supabase
          .from('messages_with_profiles')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!messageError && messageData) {
          // Transform the message data to match our Message interface
          const lastMessage: Message = {
            id: messageData.id,
            content: messageData.content,
            sender_id: messageData.sender_id,
            conversation_id: messageData.conversation_id,
            created_at: messageData.created_at,
            read_at: messageData.read_at,
            media_url: messageData.media_url,
            profiles: {
              id: messageData.profile_id,
              username: messageData.username,
              avatar_url: messageData.avatar_url
            }
          };
          
          conversationWithParticipants.last_message = lastMessage;
        }
        
        transformedData.push(conversationWithParticipants);
      }
      
      setConversations(transformedData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };
  
  const handleNewMessage = (newMessage: Message) => {
    // Check if message belongs to current conversation
    if (currentConversation && newMessage.conversation_id === currentConversation.id) {
      setMessages(prev => [...prev, newMessage]);
    }
    
    // Update the last_message in conversations list
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === newMessage.conversation_id) {
          return { ...conv, last_message: newMessage };
        }
        return conv;
      })
    );
    
    // Mark message as read if it's in the current conversation
    if (currentConversation && 
        newMessage.conversation_id === currentConversation.id && 
        newMessage.sender_id !== user?.id) {
      markMessageAsRead(newMessage.id);
    }
  };
  
  const markMessageAsRead = async (messageId: string) => {
    if (!user) return;
    
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('sender_id', user.id);
  };

  const fetchMessages = async (conversationId: string, page = 1) => {
    if (!user) return;
    
    setLoadingMessages(true);
    try {
      // Use the new view to fetch messages with profiles
      const { data, error } = await supabase
        .from('messages_with_profiles')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range((page - 1) * messagesPerPage, page * messagesPerPage - 1);
      
      if (error) throw error;
      
      // Transform the data to match our Message interface
      const messages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        conversation_id: msg.conversation_id,
        created_at: msg.created_at,
        read_at: msg.read_at,
        media_url: msg.media_url,
        profiles: {
          id: msg.profile_id,
          username: msg.username,
          avatar_url: msg.avatar_url
        }
      }));
      
      if (page === 1) {
        setMessages(messages.reverse());
      } else {
        setMessages(prev => [...messages.reverse(), ...prev]);
      }
      
      // Mark unread messages as read
      const unreadMessages = messages.filter(msg => 
        msg.sender_id !== user.id && !msg.read_at
      );
      
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };
  
  const fetchMoreMessages = async () => {
    if (!currentConversation) return;
    
    const nextPage = messagesPage + 1;
    await fetchMessages(currentConversation.id, nextPage);
    setMessagesPage(nextPage);
  };
  
  const selectConversation = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessagesPage(1);
      await fetchMessages(conversationId);
    }
  };
  
  const startConversation = async (userId: string): Promise<string | null> => {
    if (!user || userId === user.id) return null;
    
    try {
      // Check if conversation already exists
      const { data: existingParticipants } = await supabase
        .from('participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      
      const userConversationIds = existingParticipants?.map(p => p.conversation_id) || [];
      
      if (userConversationIds.length > 0) {
        const { data: otherParticipants } = await supabase
          .from('participants')
          .select('conversation_id')
          .eq('user_id', userId)
          .in('conversation_id', userConversationIds);
        
        if (otherParticipants && otherParticipants.length > 0) {
          // Conversation exists, select it
          const conversationId = otherParticipants[0].conversation_id;
          await selectConversation(conversationId);
          return conversationId;
        }
      }
      
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();
      
      if (conversationError) throw conversationError;
      
      // Add participants
      const participants = [
        { conversation_id: newConversation.id, user_id: user.id },
        { conversation_id: newConversation.id, user_id: userId }
      ];
      
      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participants);
      
      if (participantsError) throw participantsError;
      
      // Fetch user profiles
      const { data: participantsWithProfiles } = await supabase
        .from('participants_with_profiles')
        .select('*')
        .eq('conversation_id', newConversation.id);
      
      // Create conversation object
      const conversation: Conversation = {
        id: newConversation.id,
        created_at: newConversation.created_at,
        participants: participantsWithProfiles || [],
        last_message: null
      };
      
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation);
      setMessages([]);
      
      return conversation.id;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };
  
  const sendMessage = async (content: string, mediaUrl?: string) => {
    if (!user || !currentConversation) return;
    
    try {
      const newMessage = {
        conversation_id: currentConversation.id,
        sender_id: user.id,
        content,
        media_url: mediaUrl || null
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const resetState = () => {
    setConversations([]);
    setCurrentConversation(null);
    setMessages([]);
    setSelectedUserId(null);
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        loadingConversations,
        loadingMessages,
        selectedUserId,
        setSelectedUserId,
        startConversation,
        selectConversation,
        sendMessage,
        fetchMoreMessages,
        resetState
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageItem = ({ message, isOwnMessage }: { message: Message, isOwnMessage: boolean }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
        {!isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.profiles?.avatar_url || ''} />
            <AvatarFallback>{message.profiles?.username?.[0] || '?'}</AvatarFallback>
          </Avatar>
        )}
        
        <div>
          <div className={`p-3 rounded-lg ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground rounded-br-none' 
              : 'bg-muted rounded-bl-none'
          }`}>
            {message.content && <p>{message.content}</p>}
            {message.media_url && (
              <img 
                src={message.media_url} 
                alt="Media" 
                className="mt-2 rounded max-w-xs max-h-48 object-contain"
              />
            )}
          </div>
          <p className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};
