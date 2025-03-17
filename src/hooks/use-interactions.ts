
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useInteractions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLike = async (userId: string, contentId: string, contentType: string) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to like content',
        variant: 'destructive',
      });
      return null;
    }

    setIsSubmitting(true);
    try {
      // Check if user already liked this content
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        
        return { liked: false };
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: contentType,
          });
        
        // Create notification for the content owner
        // First, get the content owner id
        const contentTable = getContentTableName(contentType);
        const { data: contentData } = await supabase
          .from(contentTable)
          .select('user_id')
          .eq('id', contentId)
          .single();
        
        if (contentData && contentData.user_id !== userId) {
          // Create notification
          await supabase
            .from('notifications')
            .insert({
              user_id: contentData.user_id,
              actor_id: userId,
              type: 'like',
              content: `liked your ${contentType.slice(0, -1)}`,
              reference_id: contentId,
              reference_type: contentType,
            });
        }
        
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your action',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTableName = (contentType: string): string => {
    switch (contentType) {
      case 'posts': return 'posts';
      case 'videos': return 'videos';
      case 'reels': return 'reels';
      case 'stories': return 'stories';
      default: return 'posts';
    }
  };

  const checkIfLiked = async (userId: string, contentId: string, contentType: string) => {
    if (!userId) return false;
    
    try {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();
      
      return !!data;
    } catch (error) {
      return false;
    }
  };

  const saveContent = async (userId: string, contentId: string, contentType: string) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save content',
        variant: 'destructive',
      });
      return null;
    }

    setIsSubmitting(true);
    try {
      // Check if user already saved this content
      const { data: existingSave } = await supabase
        .from('saved_content')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      if (existingSave) {
        // Unsave
        await supabase
          .from('saved_content')
          .delete()
          .eq('id', existingSave.id);
        
        toast({
          title: 'Removed from saved',
          description: `The ${contentType.slice(0, -1)} has been removed from your saved items`,
        });
        
        return { saved: false };
      } else {
        // Save
        await supabase
          .from('saved_content')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: contentType,
          });
        
        toast({
          title: 'Saved',
          description: `The ${contentType.slice(0, -1)} has been saved to your collection`,
        });
        
        return { saved: true };
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your action',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkIfSaved = async (userId: string, contentId: string, contentType: string) => {
    if (!userId) return false;
    
    try {
      const { data } = await supabase
        .from('saved_content')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();
      
      return !!data;
    } catch (error) {
      return false;
    }
  };

  return {
    toggleLike,
    checkIfLiked,
    saveContent,
    checkIfSaved,
    isSubmitting,
  };
};
