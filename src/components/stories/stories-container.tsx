
import { StoryRing } from "./story-ring";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useRef } from "react";

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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mb-6 mt-4">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
        onScroll={handleScroll}
      >
        {storyData.map((story) => (
          <StoryRing
            key={story.id}
            username={story.username}
            imageUrl={story.imageUrl}
            viewed={story.viewed}
            className={story.isCurrentUser ? "relative" : ""}
          />
        ))}
      </div>

      {showLeftArrow && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute left-0 top-8 z-10 h-8 w-8 -translate-y-1/2 rounded-full opacity-80"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {showRightArrow && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-0 top-8 z-10 h-8 w-8 -translate-y-1/2 rounded-full opacity-80"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
