
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  ListPlus, 
  Clock, 
  BookmarkPlus, 
  Download, 
  Share2 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

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
  const handleAddToQueue = () => {
    toast({
      title: "Added to queue",
      description: "Video will play next",
    });
  };

  const handleWatchLater = () => {
    toast({
      title: "Saved to watch later",
      description: "Video added to your watch later playlist",
    });
  };

  const handleSaveToPlaylist = () => {
    toast({
      title: "Saved to playlist",
      description: "Video added to your playlist",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your video is being downloaded",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Video link copied to clipboard",
    });
  };

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
          <div className="flex justify-between">
            <h3 className="line-clamp-2 font-medium leading-tight text-foreground pr-2">
              {title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddToQueue}>
                  <ListPlus className="mr-2 h-4 w-4" />
                  <span>Play next in Queue</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWatchLater}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Save to watch later</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveToPlaylist}>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  <span>Save to playlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download video</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col text-sm text-muted-foreground">
            <div className="flex items-center">
              <span>{channelName}</span>
              <Button variant="ghost" size="sm" className="h-6 ml-2 px-2 py-1 text-xs">
                Follow
              </Button>
            </div>
            <span>
              {views} views • {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
