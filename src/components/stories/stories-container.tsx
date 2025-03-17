
import { StoryRing } from "./story-ring";
import { useState, useRef } from "react";
import { Plus } from "lucide-react";

// Dummy data for stories
const storyData = [
  { id: "1", username: "You", imageUrl: "https://i.pravatar.cc/150?img=1", viewed: false, isCurrentUser: true },
  { id: "2", username: "john_doe", imageUrl: "https://i.pravatar.cc/150?img=2", viewed: false },
  { id: "3", username: "jane_smith", imageUrl: "https://i.pravatar.cc/150?img=3", viewed: false },
  { id: "4", username: "alex_jones", imageUrl: "https://i.pravatar.cc/150?img=4", viewed: true },
  { id: "5", username: "sam_wilson", imageUrl: "https://i.pravatar.cc/150?img=5", viewed: false },
  { id: "6", username: "taylor_swift", imageUrl: "https://i.pravatar.cc/150?img=6", viewed: false },
  { id: "7", username: "chris_evans", imageUrl: "https://i.pravatar.cc/150?img=7", viewed: true },
  { id: "8", username: "robert_downey", imageUrl: "https://i.pravatar.cc/150?img=8", viewed: false },
];

export function StoriesContainer() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showUploadOption, setShowUploadOption] = useState(false);
  
  const handleUploadStory = () => {
    // In a real app, this would trigger a story upload flow
    console.log("Upload story clicked");
    
    // Mock notification
    const event = new CustomEvent("showToast", { 
      detail: { title: "Upload Story", description: "Story upload functionality would open here" } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative mb-6 mt-4">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-2"
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
