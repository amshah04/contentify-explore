
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Music } from "lucide-react";

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

  return (
    <Layout>
      <div className="flex h-[calc(100vh-132px)] md:h-[calc(100vh-72px)] items-center justify-center bg-black">
        <div className="relative h-full w-full max-w-md">
          {/* This would be a real video in production */}
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">Reel #{currentReel.id}</div>
              <div className="mt-2">{currentReel.caption}</div>
            </div>
          </div>
          
          {/* Interaction sidebar */}
          <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white">
                <Heart className="h-7 w-7" />
              </Button>
              <span className="text-xs text-white">{currentReel.likes}</span>
            </div>
            
            <Button variant="ghost" size="icon" className="text-white">
              <MessageCircle className="h-7 w-7" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white">
              <Share2 className="h-7 w-7" />
            </Button>
          </div>
          
          {/* User info and caption */}
          <div className="absolute bottom-8 left-4 right-20">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={currentReel.avatar} alt={currentReel.username} />
                <AvatarFallback>{currentReel.username[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-white">{currentReel.username}</span>
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
