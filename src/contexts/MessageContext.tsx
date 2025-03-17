
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface MessageUser {
  username: string;
  avatar_url: string;
}

export interface Message {
  id: string;
  content: string;
  media_url: string | null;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  read_at: string | null;
  sender: MessageUser | null;
}

export interface Participant {
  id: string;
  user_id: string;
  user?: MessageUser;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

interface MessageContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoadingMessages: boolean;
  isLoadingConversations: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, mediaUrl?: string) => Promise<void>;
  createConversation: (userIds: string[]) => Promise<string | null>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  markConversationAsRead: (conversationId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

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
            const newMessage = payload.new as any;
            
            // Check if this message belongs to the current conversation
            if (currentConversation && newMessage.conversation_id === currentConversation.id) {
              fetchMessages(currentConversation.id);
              
              // Mark as read if it's not from the current user
              if (newMessage.sender_id !== user.id) {
                markMessageAsRead(newMessage.id);
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
  }, [user, currentConversation]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoadingConversations(true);
    try {
      // Get conversations where the user is a participant
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select(`
          conversation_id
        `)
        .eq('user_id', user.id);
      
      if (participantsError) {
        throw participantsError;
      }
      
      if (!participantsData || participantsData.length === 0) {
        setConversations([]);
        setIsLoadingConversations(false);
        return;
      }
      
      const conversationIds = participantsData.map(p => p.conversation_id);
      
      // Get conversation details with participants and last message
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          participants (
            id,
            user_id,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
        .in('id', conversationIds);
      
      if (conversationsError) {
        throw conversationsError;
      }
      
      // Format conversations and add last messages
      const formattedConversations: Conversation[] = [];
      
      for (const conv of (conversationsData || [])) {
        // Get last message
        const { data: lastMessageData } = await supabase
          .from('messages')
          .select('id, content, created_at, sender_id')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        // Get unread count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('sender_id', user.id, true) // Not from current user
          .is('read_at', null);
        
        // Format participants with proper typing
        const participants = conv.participants.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          user: p.profiles ? {
            username: p.profiles.username,
            avatar_url: p.profiles.avatar_url
          } : undefined
        }));
        
        formattedConversations.push({
          id: conv.id,
          participants: participants,
          last_message: lastMessageData,
          unread_count: unreadCount || 0
        });
      }
      
      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!user) return;
    
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            username,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match the Message interface
      const transformedMessages = data?.map(msg => {
        // Handle case where sender relation might not exist
        const sender = msg.profiles && typeof msg.profiles === 'object' 
          ? {
              username: msg.profiles.username,
              avatar_url: msg.profiles.avatar_url
            }
          : null;
        
        return {
          id: msg.id,
          content: msg.content,
          media_url: msg.media_url,
          sender_id: msg.sender_id,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at,
          read_at: msg.read_at,
          sender
        } as Message;
      }) || [];
      
      setMessages(transformedMessages);
      
      // Mark unread messages as read if they're not from the current user
      const unreadMessages = transformedMessages.filter(
        msg => !msg.read_at && msg.sender_id !== user.id
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map(msg => markMessageAsRead(msg.id))
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);
  };

  const markConversationAsRead = async (conversationId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_id', user.id, true) // Not from current user
        .is('read_at', null);
      
      // Update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const sendMessage = async (conversationId: string, content: string, mediaUrl?: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          media_url: mediaUrl || null
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      return;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const createConversation = async (userIds: string[]): Promise<string | null> => {
    if (!user) return null;
    
    // Make sure current user is included and each user appears only once
    const participantIds = [...new Set([user.id, ...userIds])];
    
    try {
      // First check if the conversation already exists with exactly these participants
      // This is a simplification and won't work for group chats with the same participants
      if (participantIds.length === 2) {
        // For 1:1 conversations
        const { data: existingParticipants } = await supabase
          .from('participants')
          .select('conversation_id')
          .in('user_id', participantIds);
        
        if (existingParticipants && existingParticipants.length >= 2) {
          const conversationCounts = existingParticipants.reduce((acc, p) => {
            acc[p.conversation_id] = (acc[p.conversation_id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          // Find conversation that has exactly these participants
          for (const [convId, count] of Object.entries(conversationCounts)) {
            if (count === 2) {
              // Verify this conversation has exactly 2 participants
              const { count: actualCount } = await supabase
                .from('participants')
                .select('id', { count: 'exact', head: true })
                .eq('conversation_id', convId);
              
              if (actualCount === 2) {
                // This is a match, return the existing conversation
                return convId;
              }
            }
          }
        }
      }
      
      // Create new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();
      
      if (conversationError) {
        throw conversationError;
      }
      
      // Add participants
      const participantsToInsert = participantIds.map(userId => ({
        conversation_id: conversationData.id,
        user_id: userId
      }));
      
      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantsToInsert);
      
      if (participantsError) {
        throw participantsError;
      }
      
      return conversationData.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
      return null;
    }
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        isLoadingMessages,
        isLoadingConversations,
        fetchConversations,
        fetchMessages,
        sendMessage,
        createConversation,
        setCurrentConversation,
        markConversationAsRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
