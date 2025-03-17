
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from './use-toast';

type ContentType = 'posts' | 'videos' | 'reels' | 'stories' | 'avatars';

interface UploadOptions {
  userId: string;
  contentType: ContentType;
  file: File;
  additionalData?: Record<string, any>;
}

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async ({ userId, contentType, file, additionalData }: UploadOptions) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload content',
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(contentType)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(contentType)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Create a record in the database based on content type
      let dbData = null;
      let dbError = null;

      switch (contentType) {
        case 'posts':
          const { data: postData, error: postError } = await supabase
            .from('posts')
            .insert({
              user_id: userId,
              image_url: publicUrl,
              caption: additionalData?.caption || '',
            })
            .select()
            .single();
          dbData = postData;
          dbError = postError;
          break;

        case 'videos':
          const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .insert({
              user_id: userId,
              title: additionalData?.title || 'New Video',
              description: additionalData?.description || '',
              video_url: publicUrl,
              thumbnail_url: additionalData?.thumbnailUrl || '',
              duration: additionalData?.duration || 0,
            })
            .select()
            .single();
          dbData = videoData;
          dbError = videoError;
          break;

        case 'reels':
          const { data: reelData, error: reelError } = await supabase
            .from('reels')
            .insert({
              user_id: userId,
              video_url: publicUrl,
              caption: additionalData?.caption || '',
              music: additionalData?.music || '',
            })
            .select()
            .single();
          dbData = reelData;
          dbError = reelError;
          break;

        case 'stories':
          const { data: storyData, error: storyError } = await supabase
            .from('stories')
            .insert({
              user_id: userId,
              media_url: publicUrl,
              media_type: file.type.startsWith('image/') ? 'image' : 'video',
            })
            .select()
            .single();
          dbData = storyData;
          dbError = storyError;
          break;

        case 'avatars':
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .update({
              avatar_url: publicUrl,
            })
            .eq('id', userId)
            .select()
            .single();
          dbData = profileData;
          dbError = profileError;
          break;
      }

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Upload successful',
        description: `Your ${contentType.slice(0, -1)} has been uploaded`,
      });

      return { fileData: uploadData, dbData, publicUrl };
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    progress,
  };
};
