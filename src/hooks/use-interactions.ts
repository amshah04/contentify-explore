
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from './use-toast';

type ContentType = 'post' | 'video' | 'reel' | 'comment';

interface InteractionOptions {
  contentId: string;
  contentType: ContentType;
  userId: string;
}

export const useInteractions = () => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const checkInteractionStatus = async ({ contentId, contentType, userId }: InteractionOptions) => {
    setIsLoading(true);
    try {
      // Check if content is liked
      const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .eq('user_id', userId)
        .single();
      
      if (likeError && likeError.code !== 'PGRST116') {
        console.error('Error checking like status:', likeError);
      }
      
      setIsLiked(!!likeData);
      
      // Check if content is saved
      const { data: savedData, error: savedError } = await supabase
        .from('saved_content')
        .select('id')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .eq('user_id', userId)
        .single();
      
      if (savedError && savedError.code !== 'PGRST116') {
        console.error('Error checking saved status:', savedError);
      }
      
      setIsSaved(!!savedData);
      
      // Get likes count based on content type
      // Map the content type to the appropriate table name
      let tableName: string;
      switch (contentType) {
        case 'post':
          tableName = 'posts';
          break;
        case 'video':
          tableName = 'videos';
          break;
        case 'reel':
          tableName = 'reels';
          break;
        default:
          console.error('Unsupported content type for likes count');
          return;
      }
      
      // Use the table name as a string literal for type safety
      const { data, error } = await supabase
        .from(tableName as 'posts' | 'videos' | 'reels')
        .select('likes_count')
        .eq('id', contentId)
        .single();
      
      if (error) {
        console.error(`Error fetching likes count for ${contentType}:`, error);
      } else if (data) {
        setLikesCount(data.likes_count || 0);
      }
    } catch (error) {
      console.error('Error checking interaction status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async ({ contentId, contentType, userId }: InteractionOptions) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like content',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isLiked) {
        // Unlike content
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('content_id', contentId)
          .eq('content_type', contentType)
          .eq('user_id', userId);
        
        if (error) throw error;
        
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like content
        const { error } = await supabase
          .from('likes')
          .insert({
            content_id: contentId,
            content_type: contentType,
            user_id: userId,
          });
        
        if (error) throw error;
        
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Could not complete the action',
        variant: 'destructive',
      });
    }
  };

  const toggleSave = async ({ contentId, contentType, userId }: InteractionOptions) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save content',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isSaved) {
        // Unsave content
        const { error } = await supabase
          .from('saved_content')
          .delete()
          .eq('content_id', contentId)
          .eq('content_type', contentType)
          .eq('user_id', userId);
        
        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: 'Removed from saved',
          description: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} removed from your saved items`,
        });
      } else {
        // Save content
        const { error } = await supabase
          .from('saved_content')
          .insert({
            content_id: contentId,
            content_type: contentType,
            user_id: userId,
          });
        
        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: 'Saved',
          description: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} saved to your collection`,
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: 'Error',
        description: 'Could not complete the action',
        variant: 'destructive',
      });
    }
  };

  return {
    isLiked,
    isSaved,
    likesCount,
    isLoading,
    checkInteractionStatus,
    toggleLike,
    toggleSave,
  };
};
