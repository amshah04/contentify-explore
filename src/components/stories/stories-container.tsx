
import { StoryRing } from "./story-ring";
import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpload } from "@/hooks/use-upload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StoryData {
  id: string;
  username: string;
  imageUrl: string;
  viewed: boolean;
  isCurrentUser?: boolean;
  story?: any;
}

export function StoriesContainer() {
  const { user, profile } = useAuth();
  const { uploadFile, isUploading, progress } = useUpload();
  const [stories, setStories] = useState<any[]>([]);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchStories();
  }, []);
  
  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          media_url,
          media_type,
          created_at,
          expires_at,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .lt('expires_at', new Date().toISOString())
        .limit(15);
      
      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }
      
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };
  
  const handleUploadStory = () => {
    setShowUploadOption(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image or video file",
        variant: "destructive",
      });
      return;
    }
    
    setStoryFile(file);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setStoryPreview(objectUrl);
    
    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  const cancelStoryUpload = () => {
    setShowUploadOption(false);
    setStoryFile(null);
    setStoryPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const submitStoryUpload = async () => {
    if (!storyFile || !user) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    const result = await uploadFile({
      userId: user.id,
      contentType: "stories",
      file: storyFile,
    });
    
    if (result) {
      setShowUploadOption(false);
      setStoryFile(null);
      setStoryPreview(null);
      fetchStories(); // Refresh stories after upload
    }
  };
  
  // Prepare stories data
  const storyData: StoryData[] = [
    // Current user story (for adding)
    ...(user ? [{
      id: "current-user",
      username: profile?.username || "You",
      imageUrl: profile?.avatar_url || "https://i.pravatar.cc/150?img=1",
      viewed: false,
      isCurrentUser: true
    }] : []),
    // Fetched stories
    ...(stories.map((story: any) => ({
      id: story.id,
      username: story.profiles?.username || "user",
      imageUrl: story.profiles?.avatar_url || "https://i.pravatar.cc/150?img=2",
      viewed: false,
      story: story,
      isCurrentUser: false
    })))
  ];
  
  // If there are no stories other than current user, add some empty placeholders
  if (storyData.length <= 1) {
    for (let i = 0; i < 5; i++) {
      storyData.push({
        id: `placeholder-${i}`,
        username: `user_${i}`,
        imageUrl: `https://i.pravatar.cc/150?img=${i + 2}`,
        viewed: Math.random() > 0.5,
        isCurrentUser: false
      });
    }
  }

  return (
    <div className="relative mb-6 mt-4">
      {showUploadOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create a Story</h3>
              <Button variant="ghost" size="icon" onClick={cancelStoryUpload}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {!storyFile ? (
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <p className="text-center text-muted-foreground">
                  Share a photo or video that will be visible for 24 hours.
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-md">
                  {storyFile.type.startsWith("image/") ? (
                    <img 
                      src={storyPreview!}
                      alt="Story preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <video 
                      src={storyPreview!} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {isUploading && (
                  <div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center mt-1">{progress}% uploaded</p>
                  </div>
                )}
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={cancelStoryUpload}>
                    Cancel
                  </Button>
                  <Button onClick={submitStoryUpload} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Share Story"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
      >
        {storyData.map((story) => (
          <StoryRing
            key={story.id}
            username={story.username}
            imageUrl={story.imageUrl}
            viewed={story.viewed}
            className={story.isCurrentUser ? "relative" : ""}
            onClick={story.isCurrentUser ? handleUploadStory : undefined}
          >
            {story.isCurrentUser && (
              <div className="absolute bottom-5 right-0 rounded-full bg-primary text-white p-1">
                <Plus className="h-3 w-3" />
              </div>
            )}
          </StoryRing>
        ))}
      </div>
    </div>
  );
}
