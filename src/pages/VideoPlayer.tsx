
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Download, 
  Bookmark, 
  MoreHorizontal,
  MoreVertical
} from "lucide-react";
import { VideoCard } from "@/components/videos/video-card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Dummy data for related videos
const relatedVideos = [
  {
    id: "1",
    title: "How to Create Amazing Digital Art",
    channelName: "CreativeArtists",
    channelAvatar: "https://i.pravatar.cc/150?img=8",
    thumbnail: "https://images.unsplash.com/photo-1618605588556-c887188781cc",
    views: "125K",
    timeAgo: "3 days ago",
    duration: "15:42",
  },
  {
    id: "2",
    title: "Top 10 Programming Languages in 2023",
    channelName: "TechTalks",
    channelAvatar: "https://i.pravatar.cc/150?img=11",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    views: "89K",
    timeAgo: "1 week ago",
    duration: "22:17",
  },
  {
    id: "3",
    title: "Beginner's Guide to Photography",
    channelName: "PhotoMasters",
    channelAvatar: "https://i.pravatar.cc/150?img=13",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    views: "246K",
    timeAgo: "2 weeks ago",
    duration: "18:05",
  },
];

// Dummy data for comments
const comments = [
  {
    id: "1",
    username: "artlover42",
    avatar: "https://i.pravatar.cc/150?img=20",
    comment: "This was so helpful! I've been trying to improve my digital art skills for months.",
    timeAgo: "2 days ago",
    likes: 24,
  },
  {
    id: "2",
    username: "techguy",
    avatar: "https://i.pravatar.cc/150?img=21",
    comment: "Great tutorial! Could you make one about 3D modeling next?",
    timeAgo: "1 day ago",
    likes: 16,
  },
];

export default function VideoPlayer() {
  const { id } = useParams();
  
  const handleLike = () => {
    toast({
      title: "Video liked",
      description: "Thanks for your feedback!",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your video is being downloaded",
    });
  };

  const handleSave = () => {
    toast({
      title: "Video saved",
      description: "Video added to your saved videos",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Video link copied to clipboard",
    });
  };

  const handleFollow = () => {
    toast({
      title: "Following CreativeArtists",
      description: "You'll see their content in your feed",
    });
  };
  
  // In a real app, this would fetch the video data based on the ID
  const videoData = {
    title: "How to Create Amazing Digital Art",
    channelName: "CreativeArtists",
    channelAvatar: "https://i.pravatar.cc/150?img=8",
    views: "125K",
    timeAgo: "3 days ago",
    description: "In this tutorial, I show you step by step how to create stunning digital art using various techniques and tools. Perfect for beginners and intermediate artists looking to improve their skills.\n\nTimestamps:\n00:00 Introduction\n01:25 Setting up your workspace\n03:45 Basic techniques\n08:30 Color theory\n12:15 Advanced effects\n\nTools used in this tutorial:\n- Adobe Photoshop\n- Wacom tablet\n- Custom brushes (link in description)\n\nFollow me for more tutorials and tips on digital art creation!",
    likes: "15K",
    comments: 342,
  };

  return (
    <Layout>
      <div className="max-w-full mx-auto md:flex md:gap-6">
        <div className="md:flex-1 md:max-w-4xl">
          <div className="aspect-video bg-black mb-4 overflow-hidden">
            {/* This would be a real video player in production */}
            <div className="flex h-full items-center justify-center text-white">
              Video Player: ID {id}
            </div>
          </div>
          
          <div className="px-4 md:px-0 space-y-4">
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
                <Button onClick={handleFollow} variant="outline" size="sm">
                  Follow
                </Button>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Button variant="outline" size="sm" onClick={handleLike}>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {videoData.likes}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      Report video
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Add to playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Not interested
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="rounded-lg bg-muted p-4 whitespace-pre-line">
              <p>{videoData.description}</p>
            </div>
            
            {/* Comments section */}
            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold">{videoData.comments} Comments</h2>
              
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar} alt={comment.username} />
                    <AvatarFallback>{comment.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.username}</span>
                      <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                    </div>
                    <p className="mt-1">{comment.comment}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-xs">{comment.likes}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Related videos */}
        <div className="mt-6 md:mt-0 md:w-96 px-4 md:px-0">
          <h2 className="text-lg font-semibold mb-4">Related Videos</h2>
          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                channelName={video.channelName}
                channelAvatar={video.channelAvatar}
                thumbnail={video.thumbnail}
                views={video.views}
                timeAgo={video.timeAgo}
                duration={video.duration}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
