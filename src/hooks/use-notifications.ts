
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationActor {
  username: string;
  avatar_url: string;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  created_at: string;
  read_at: string | null;
  actor: NotificationActor | null;
  actor_id?: string;
  reference_id?: string;
  reference_type?: string;
  user_id?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to realtime notifications
      const channel = supabase
        .channel('notifications-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            // Add new notification
            fetchNotifications();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:actor_id (
            username,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        throw error;
      }
      
      // Transform data to match the Notification interface
      const transformedData = data?.map(item => {
        // Handle case where actor relation doesn't exist
        const actor = typeof item.actor === 'object' && item.actor !== null 
          ? item.actor 
          : null;
        
        return {
          id: item.id,
          type: item.type,
          content: item.content,
          created_at: item.created_at,
          read_at: item.read_at,
          actor,
          actor_id: item.actor_id,
          reference_id: item.reference_id,
          reference_type: item.reference_type,
          user_id: item.user_id
        } as Notification;
      }) || [];
      
      setNotifications(transformedData);
      
      // Count unread notifications
      const unread = transformedData?.filter(n => !n.read_at).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const markAsRead = async (notificationId?: string) => {
    if (!user) return;
    
    try {
      if (notificationId) {
        // Mark a single notification as read
        await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('id', notificationId)
          .eq('user_id', user.id);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
          )
        );
      } else {
        // Mark all notifications as read
        await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .is('read_at', null);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      }
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
  };
};
