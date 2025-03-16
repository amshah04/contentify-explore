
import { cn } from "@/lib/utils";

interface StoryRingProps {
  imageUrl: string;
  username: string;
  viewed?: boolean;
  className?: string;
}

export function StoryRing({ imageUrl, username, viewed = false, className }: StoryRingProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className={cn("rounded-full p-[2px]", viewed ? "bg-gray-300 dark:bg-gray-700" : "social-gradient")}>
        <div className="rounded-full bg-background p-[2px]">
          <img
            src={imageUrl}
            alt={username}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
      </div>
      <span className="text-xs">{username}</span>
    </div>
  );
}
