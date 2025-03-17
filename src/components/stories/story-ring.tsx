
import { cn } from "@/lib/utils";
import React from "react";

interface StoryRingProps {
  imageUrl: string;
  username: string;
  viewed?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function StoryRing({ 
  imageUrl, 
  username, 
  viewed = false, 
  className,
  onClick,
  children 
}: StoryRingProps) {
  return (
    <div 
      className={cn("flex flex-col items-center gap-1", className)}
      onClick={onClick}
    >
      <div 
        className={cn(
          "rounded-full p-[2px] relative cursor-pointer", 
          viewed ? "bg-gray-300 dark:bg-gray-700" : "social-gradient"
        )}
      >
        <div className="rounded-full bg-background p-[2px]">
          <img
            src={imageUrl}
            alt={username}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        {children}
      </div>
      <span className="text-xs">{username}</span>
    </div>
  );
}
