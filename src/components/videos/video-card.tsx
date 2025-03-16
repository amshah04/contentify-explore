
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoCardProps {
  title: string;
  channelName: string;
  channelAvatar: string;
  thumbnail: string;
  views: string;
  timeAgo: string;
  duration: string;
}

export function VideoCard({
  title,
  channelName,
  channelAvatar,
  thumbnail,
  views,
  timeAgo,
  duration,
}: VideoCardProps) {
  return (
    <div className="group rounded-lg overflow-hidden">
      <Link to={`/video/123`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/75 px-1 py-0.5 text-xs text-white">
            {duration}
          </div>
        </div>
      </Link>
      <div className="flex gap-3 pt-3">
        <Avatar className="h-9 w-9 rounded-full">
          <AvatarImage src={channelAvatar} alt={channelName} />
          <AvatarFallback>{channelName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h3 className="line-clamp-2 font-medium leading-tight text-foreground">
            {title}
          </h3>
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>{channelName}</span>
            <span>
              {views} views • {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
