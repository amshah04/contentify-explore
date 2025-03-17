
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from './use-toast';

export type ContentType = 'post' | 'video' | 'reel';

interface UseInteractionsProps {
  contentId: string;
  contentType: ContentType;
}

export const useInteractions = ({ contentId, contentType }: UseInteractionsProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && contentId) {
      fetchInteractionStatus();
      fetchLikeCount();
    }
  }, [user, contentId, contentType]);

  const fetchInteractionStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if user has liked the content
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .maybeSingle();
      
      setIsLiked(!!likeData);
      
      // Check if user has saved the content
      const { data: savedData } = await supabase
        .from('saved_content')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .maybeSingle();
      
      setIsSaved(!!savedData);
    } catch (error) {
      console.error('Error fetching interaction status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchLikeCount = async () => {
    try {
      let table = '';
      switch (contentType) {
        case 'post':
          table = 'posts';
          break;
        case 'video':
          table = 'videos';
          break;
        case 'reel':
          table = 'reels';
          break;
      }
      
      const { data } = await supabase
        .from(table)
        .select('likes_count')
        .eq('id', contentId)
        .single();
      
      if (data) {
        setLikeCount(data.likes_count);
      }
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like this content',
      });
      return;
    }
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId)
          .eq('content_type', contentType);
        
        setIsLiked(false);
        setLikeCount(prev => Math.max(prev - 1, 0));
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            content_id: contentId,
            content_type: contentType,
          });
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };
  
  const toggleSave = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save this content',
      });
      return;
    }
    
    try {
      if (isSaved) {
        // Unsave
        await supabase
          .from('saved_content')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId)
          .eq('content_type', contentType);
        
        setIsSaved(false);
        toast({
          title: 'Removed from saved',
        });
      } else {
        // Save
        await supabase
          .from('saved_content')
          .insert({
            user_id: user.id,
            content_id: contentId,
            content_type: contentType,
          });
        
        setIsSaved(true);
        toast({
          title: 'Saved successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return {
    isLiked,
    isSaved,
    likeCount,
    isLoading,
    toggleLike,
    toggleSave,
  };
};
