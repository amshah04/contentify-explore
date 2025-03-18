
import { useNavigate } from "react-router-dom";
import { StoryRing } from "./story-ring";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock user data for my story
const myStory = {
  id: "my-story",
  username: "You",
  avatar: "https://i.pravatar.cc/150?img=12",
  hasUnseenStory: false,
};

// Mock data for stories
const stories = [
  {
    id: "1",
    username: "johndoe",
    avatar: "https://i.pravatar.cc/150?img=1",
    hasUnseenStory: true,
  },
  {
    id: "2",
    username: "janedoe",
    avatar: "https://i.pravatar.cc/150?img=5",
    hasUnseenStory: true,
  },
  {
    id: "3",
    username: "willsmith",
    avatar: "https://i.pravatar.cc/150?img=3",
    hasUnseenStory: true,
  },
  {
    id: "4",
    username: "sarahlee",
    avatar: "https://i.pravatar.cc/150?img=4",
    hasUnseenStory: false,
  },
  {
    id: "5",
    username: "mikebrown",
    avatar: "https://i.pravatar.cc/150?img=7",
    hasUnseenStory: true,
  },
  {
    id: "6",
    username: "jessicap",
    avatar: "https://i.pravatar.cc/150?img=10",
    hasUnseenStory: false,
  },
  {
    id: "7",
    username: "davidw",
    avatar: "https://i.pravatar.cc/150?img=11",
    hasUnseenStory: true,
  },
];

export function StoriesContainer() {
  const navigate = useNavigate();

  const handleAddStory = () => {
    navigate("/upload");
    toast({
      title: "Add to Your Story",
      description: "Create and upload a story"
    });
  };

  return (
    <div className="relative overflow-x-auto py-2 no-scrollbar">
      <div className="flex gap-4 px-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <StoryRing
              avatar={myStory.avatar}
              username={myStory.username}
              hasUnseenStory={myStory.hasUnseenStory}
              isMyStory
            />
            <Button 
              size="icon" 
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground"
              onClick={handleAddStory}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="mt-1 text-xs">Your Story</span>
        </div>

        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center">
            <StoryRing
              avatar={story.avatar}
              username={story.username}
              hasUnseenStory={story.hasUnseenStory}
            />
            <span className="mt-1 text-xs truncate max-w-[64px]">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
