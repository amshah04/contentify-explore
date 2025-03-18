
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export interface StoryRingProps {
  avatarUrl: string;
  username: string;
  hasUnseenStory: boolean;
  isMyStory?: boolean;
}

export function StoryRing({ avatarUrl, username, hasUnseenStory, isMyStory = false }: StoryRingProps) {
  const handleClick = () => {
    if (isMyStory) {
      toast({
        title: "Your Story",
        description: "You can view or add to your story",
      });
    } else {
      toast({
        title: `${username}'s Story`,
        description: hasUnseenStory ? "New story available" : "No new stories",
      });
    }
  };

  return (
    <div
      className={`cursor-pointer flex items-center justify-center rounded-full p-[2px] ${
        hasUnseenStory ? "bg-gradient-to-tr from-yellow-400 to-fuchsia-600" : "bg-muted"
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-16 w-16 border-2 border-background">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}
