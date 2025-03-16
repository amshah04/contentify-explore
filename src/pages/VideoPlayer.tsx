
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";

export default function VideoPlayer() {
  const { id } = useParams();
  
  // In a real app, this would fetch the video data based on the ID
  const videoData = {
    title: "How to Create Amazing Digital Art",
    channelName: "CreativeArtists",
    channelAvatar: "https://i.pravatar.cc/150?img=8",
    views: "125K",
    timeAgo: "3 days ago",
    description: "In this tutorial, I show you step by step how to create stunning digital art using various techniques and tools. Perfect for beginners and intermediate artists looking to improve their skills.",
    likes: "15K",
    comments: 342,
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-black mb-4 rounded-lg overflow-hidden">
          {/* This would be a real video player in production */}
          <div className="flex h-full items-center justify-center text-white">
            Video Player: ID {id}
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-xl font-bold md:text-2xl">{videoData.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={videoData.channelAvatar} alt={videoData.channelName} />
                <AvatarFallback>{videoData.channelName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{videoData.channelName}</div>
                <div className="text-sm text-muted-foreground">
                  {videoData.views} views • {videoData.timeAgo}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {videoData.likes}
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                {videoData.comments}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-muted p-4">
            <p>{videoData.description}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
