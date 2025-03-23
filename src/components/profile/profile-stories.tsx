
import { useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Story {
  id: string;
  thumbnail: string;
  date: string;
  isSaved?: boolean;
}

interface ProfileStoriesProps {
  stories: Story[];
  isCurrentUser?: boolean;
}

export function ProfileStories({ stories, isCurrentUser = true }: ProfileStoriesProps) {
  const navigate = useNavigate();
  const [savedStories, setSavedStories] = useState<Record<string, boolean>>({});

  const handleAddStory = () => {
    navigate("/upload");
    toast({
      title: "Add to Your Story",
      description: "Create and upload a story"
    });
  };

  const toggleSaveStory = (id: string) => {
    setSavedStories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    toast({
      title: savedStories[id] ? "Story Unsaved" : "Story Saved",
      description: savedStories[id] ? "Story removed from saved items" : "Story added to saved items"
    });
  };

  if (stories.length === 0 && !isCurrentUser) {
    return null;
  }

  return (
    <div className="mt-8 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Stories</h3>
        {isCurrentUser && (
          <Button variant="ghost" size="sm" onClick={handleAddStory}>
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        )}
      </div>
      
      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-md">
          <p className="text-muted-foreground mb-3">No stories yet</p>
          {isCurrentUser && (
            <Button onClick={handleAddStory}>
              <Plus className="h-4 w-4 mr-1" />
              Create Story
            </Button>
          )}
        </div>
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {stories.map((story) => (
              <CarouselItem key={story.id} className="basis-1/4 min-w-[120px]">
                <Card className="relative overflow-hidden rounded-md aspect-square">
                  <div className="absolute inset-0">
                    <img 
                      src={story.thumbnail} 
                      alt="Story thumbnail" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 bg-black/40 text-white hover:bg-black/60 hover:text-white"
                      onClick={() => toggleSaveStory(story.id)}
                    >
                      <Bookmark 
                        className="h-4 w-4" 
                        fill={savedStories[story.id] ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <p className="text-xs text-white font-medium bg-black/40 px-2 py-1 rounded">
                      {story.date}
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-black/20 hover:bg-black/40 text-white" />
          <CarouselNext className="right-0 bg-black/20 hover:bg-black/40 text-white" />
        </Carousel>
      )}
    </div>
  );
}
