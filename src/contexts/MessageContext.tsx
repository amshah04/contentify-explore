
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  media_url: string | null;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  read_at: string | null;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    user_id: string;
    user?: {
      username: string;
      avatar_url: string;
    };
  }[];
  last_message?: Message;
  unread_count?: number;
}

interface MessageContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  setActiveConversation: (conversation: Conversation | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, mediaUrl?: string) => Promise<boolean>;
  createConversation: (participantIds: string[]) => Promise<Conversation | null>;
  markAsRead: (conversationId: string) => Promise<void>;
  unreadCount: number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
            const newMessage = payload.new as Message;
            
            // If the message is for the active conversation, add it to the messages list
            if (activeConversation && newMessage.conversation_id === activeConversation.id) {
              setMessages(prevMessages => [...prevMessages, newMessage]);
              
              // If the message is not from the current user, mark it as read
              if (newMessage.sender_id !== user.id) {
                markAsRead(newMessage.conversation_id);
              }
            }
            
            // Update conversations list to show latest message
            fetchConversations();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, activeConversation]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoadingConversations(true);
    try {
      // Get conversations where the user is a participant
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select(`
          conversation_id,
          conversations:conversation_id (
            id,
            created_at
          )
        `)
        .eq('user_id', user.id);
      
      if (participantsError) throw participantsError;
      
      if (!participantsData || participantsData.length === 0) {
        setConversations([]);
        setLoadingConversations(false);
        return;
      }
      
      // Get the conversation IDs
      const conversationIds = participantsData.map(p => p.conversation_id);
      
      // For each conversation, get the participants
      const conversationsWithParticipants = await Promise.all(
        conversationIds.map(async (conversationId) => {
          // Get participants
          const { data: participants, error: participantsError } = await supabase
            .from('participants')
            .select(`
              id,
              user_id,
              user:user_id (
                username,
                avatar_url
              )
            `)
            .eq('conversation_id', conversationId);
          
          if (participantsError) throw participantsError;
          
          // Get the last message
          const { data: lastMessages, error: lastMessageError } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              media_url,
              sender_id,
              created_at,
              read_at,
              sender:sender_id (
                username,
                avatar_url
              )
            `)
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (lastMessageError) throw lastMessageError;
          
          // Count unread messages
          const { count, error: countError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conversationId)
            .eq('sender_id', user.id, { negate: true })
            .is('read_at', null);
          
          if (countError) throw countError;
          
          return {
            id: conversationId,
            participants: participants || [],
            last_message: lastMessages && lastMessages.length > 0 ? lastMessages[0] : undefined,
            unread_count: count || 0,
          };
        })
      );
      
      setConversations(conversationsWithParticipants);
      
      // Calculate total unread messages
      const totalUnread = conversationsWithParticipants.reduce(
        (sum, conv) => sum + (conv.unread_count || 0), 
        0
      );
      setUnreadCount(totalUnread);
      
      // Update active conversation if needed
      if (activeConversation) {
        const updatedActiveConversation = conversationsWithParticipants.find(
          c => c.id === activeConversation.id
        );
        if (updatedActiveConversation) {
          setActiveConversation(updatedActiveConversation);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!user || !conversationId) return;
    
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          media_url,
          sender_id,
          conversation_id,
          created_at,
          read_at,
          sender:sender_id (
            username,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      await markAsRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };
  
  const sendMessage = async (conversationId: string, content: string, mediaUrl?: string) => {
    if (!user || !conversationId || (!content && !mediaUrl)) return false;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          media_url: mediaUrl,
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };
  
  const createConversation = async (participantIds: string[]) => {
    if (!user) return null;
    
    // Make sure the current user is included
    if (!participantIds.includes(user.id)) {
      participantIds.push(user.id);
    }
    
    try {
      // Create a new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();
      
      if (conversationError) throw conversationError;
      
      // Add participants
      const participantsToInsert = participantIds.map(userId => ({
        conversation_id: conversationData.id,
        user_id: userId,
      }));
      
      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantsToInsert);
      
      if (participantsError) throw participantsError;
      
      // Fetch the conversation with participants
      await fetchConversations();
      
      // Find and return the newly created conversation
      const newConversation = conversations.find(c => c.id === conversationData.id);
      return newConversation || null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };
  
  const markAsRead = async (conversationId: string) => {
    if (!user || !conversationId) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_id', user.id, { negate: true })
        .is('read_at', null);
      
      // Update unread count locally
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 } 
            : conv
        )
      );
      
      // Recalculate total unread
      const totalUnread = conversations.reduce(
        (sum, conv) => conv.id !== conversationId 
          ? sum + (conv.unread_count || 0)
          : sum, 
        0
      );
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    setActiveConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead,
    unreadCount,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
