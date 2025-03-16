
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Bookmark, 
  MoreHorizontal 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Dummy data for reels
const reelsData = [
  {
    id: "1",
    username: "john_doe",
    avatar: "https://i.pravatar.cc/150?img=2",
    videoSrc: "https://example.com/reel1.mp4", // Would be a real video in production
    caption: "Check out this amazing sunset! 🌅 #sunset #vibes",
    song: "Summer Vibes - DJ Mix",
    likes: 1245,
  },
  {
    id: "2",
    username: "travel_lover",
    avatar: "https://i.pravatar.cc/150?img=4",
    videoSrc: "https://example.com/reel2.mp4",
    caption: "Travel memories from last summer ✈️ #travel #adventure",
    song: "Memories - Maroon 5",
    likes: 892,
  },
  {
    id: "3",
    username: "dance_queen",
    avatar: "https://i.pravatar.cc/150?img=5",
    videoSrc: "https://example.com/reel3.mp4",
    caption: "New dance trend! Try it out 💃 #dance #trending",
    song: "Dance Monkey - Tones and I",
    likes: 3421,
  },
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReel = reelsData[currentIndex];
  const [liked, setLiked] = useState(false);

  const handleNext = () => {
    setLiked(false);
    setCurrentIndex((prev) => (prev + 1) % reelsData.length);
  };

  const handlePrevious = () => {
    setLiked(false);
    setCurrentIndex((prev) => (prev - 1 + reelsData.length) % reelsData.length);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      toast({
        title: "Reel liked",
        description: "Thanks for your feedback!",
      });
    }
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comments section would open here",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share reel",
      description: "Share options would appear here",
    });
  };

  const handleSave = () => {
    toast({
      title: "Reel saved",
      description: "Reel has been saved to your collection",
    });
  };

  const handleFollow = () => {
    toast({
      title: `Following ${currentReel.username}`,
      description: "You'll see their content in your feed",
    });
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-132px)] md:h-[calc(100vh-72px)] items-center justify-center bg-black">
        <div className="relative h-full w-full max-w-md">
          {/* This would be a real video in production */}
          <div 
            className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            onClick={handleNext}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">Reel #{currentReel.id}</div>
              <div className="mt-2">{currentReel.caption}</div>
            </div>
          </div>
          
          {/* Navigation for previous/next reels */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button 
              variant="ghost" 
              className="h-full w-12 rounded-none text-white opacity-0 hover:opacity-100 hover:bg-black/20"
              onClick={handlePrevious}
            >
              ←
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button 
              variant="ghost" 
              className="h-full w-12 rounded-none text-white opacity-0 hover:opacity-100 hover:bg-black/20"
              onClick={handleNext}
            >
              →
            </Button>
          </div>
          
          {/* Interaction sidebar */}
          <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white" 
                onClick={handleLike}
              >
                <Heart className={`h-7 w-7 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <span className="text-xs text-white">{liked ? currentReel.likes + 1 : currentReel.likes}</span>
            </div>
            
            <Button variant="ghost" size="icon" className="text-white" onClick={handleComment}>
              <MessageCircle className="h-7 w-7" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white" onClick={handleShare}>
              <Share2 className="h-7 w-7" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white" onClick={handleSave}>
              <Bookmark className="h-7 w-7" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <MoreHorizontal className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Not interested
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Copy link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* User info and caption */}
          <div className="absolute bottom-8 left-4 right-20">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={currentReel.avatar} alt={currentReel.username} />
                <AvatarFallback>{currentReel.username[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-white">{currentReel.username}</span>
              <Button 
                onClick={handleFollow} 
                variant="outline" 
                size="sm" 
                className="ml-2 text-white border-white hover:bg-white/20"
              >
                Follow
              </Button>
            </div>
            
            <div className="mt-2 text-sm text-white">{currentReel.caption}</div>
            
            <div className="mt-2 flex items-center gap-2">
              <Music className="h-4 w-4 text-white" />
              <span className="text-xs text-white">{currentReel.song}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
