
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { VideoCard } from "@/components/videos/video-card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useInteractions } from "@/hooks/use-interactions";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Sample video data
const sampleVideos = [
  {
    id: "1",
    title: "How to Create Amazing Digital Art",
    channelName: "CreativeArtists",
    channelAvatar: "https://i.pravatar.cc/150?img=8",
    thumbnail: "https://images.unsplash.com/photo-1618605588556-c887188781cc",
    views: "125K",
    timeAgo: "3 days ago",
    duration: "15:42",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
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
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
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
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: "4",
    title: "Easy Dinner Recipes Under 30 Minutes",
    channelName: "CookingWithJoy",
    channelAvatar: "https://i.pravatar.cc/150?img=15",
    thumbnail: "https://images.unsplash.com/photo-1493770348161-369560ae357d",
    views: "412K",
    timeAgo: "3 days ago",
    duration: "12:38",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: "5",
    title: "Mountain Biking Techniques for Beginners",
    channelName: "OutdoorAdventures",
    channelAvatar: "https://i.pravatar.cc/150?img=22",
    thumbnail: "https://images.unsplash.com/photo-1541625602330-2277a4c46182",
    views: "78K",
    timeAgo: "5 days ago",
    duration: "14:22",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    id: "6",
    title: "Introduction to Machine Learning",
    channelName: "DataScience101",
    channelAvatar: "https://i.pravatar.cc/150?img=33",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    views: "156K",
    timeAgo: "1 month ago",
    duration: "25:18",
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  }
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLiked, isSaved, likesCount, checkInteractionStatus, toggleLike, toggleSave } = useInteractions();
  
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  
  // Find current video and related videos
  useEffect(() => {
    // Find current video by ID
    const video = sampleVideos.find(video => video.id === id) || sampleVideos[0];
    setCurrentVideo(video);
    
    // Get related videos (all videos except current one)
    const related = sampleVideos.filter(v => v.id !== video.id);
    // Shuffle array to show random related videos
    const shuffled = [...related].sort(() => 0.5 - Math.random());
    setRelatedVideos(shuffled);
    
    // Check interaction status if user is logged in
    if (user && video) {
      checkInteractionStatus({
        contentId: video.id,
        contentType: 'video',
        userId: user.id
      });
    }
  }, [id, user]);

  const handleLike = () => {
    if (user && currentVideo) {
      toggleLike({
        contentId: currentVideo.id,
        contentType: 'video',
        userId: user.id
      });
    } else {
      toast({
        title: "Authentication required",
        description: "Please sign in to like videos",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (user && currentVideo) {
      toggleSave({
        contentId: currentVideo.id,
        contentType: 'video',
        userId: user.id
      });
    } else {
      toast({
        title: "Authentication required",
        description: "Please sign in to save videos",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Share link copied",
      description: "Video link copied to clipboard",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your video is being downloaded",
    });
  };

  const handleFollow = () => {
    toast({
      title: `Following ${currentVideo?.channelName}`,
      description: "You'll see their content in your feed",
    });
  };
  
  if (!currentVideo) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p>Loading video...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-full mx-auto md:flex md:gap-6">
        <div className="md:flex-1 md:max-w-4xl">
          <div className="aspect-video bg-black mb-4 overflow-hidden">
            {/* Actual Video Player */}
            <video
              className="w-full h-full"
              src={currentVideo.videoUrl}
              poster={currentVideo.thumbnail}
              controls
              autoPlay
            />
          </div>
          
          <div className="px-4 md:px-0 space-y-4">
            <div className="space-y-3">
              <h1 className="text-xl font-bold md:text-2xl">{currentVideo.title}</h1>
              
              {/* Description (moved above channel info) */}
              <div className="rounded-lg bg-muted p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => setShowDescription(!showDescription)}
                >
                  <div className="flex items-center gap-2">
                    <span>{currentVideo.views} views • {currentVideo.timeAgo}</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    {showDescription ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                
                {showDescription && (
                  <p className="mt-2 whitespace-pre-line">
                    {currentVideo.description || "In this tutorial, I show you step by step how to create stunning digital art using various techniques and tools. Perfect for beginners and intermediate artists looking to improve their skills.\n\nTimestamps:\n00:00 Introduction\n01:25 Setting up your workspace\n03:45 Basic techniques\n08:30 Color theory\n12:15 Advanced effects\n\nTools used in this tutorial:\n- Adobe Photoshop\n- Wacom tablet\n- Custom brushes (link in description)\n\nFollow me for more tutorials and tips on digital art creation!"}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentVideo.channelAvatar} alt={currentVideo.channelName} />
                  <AvatarFallback>{currentVideo.channelName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentVideo.channelName}</div>
                  <div className="text-sm text-muted-foreground">
                    {currentVideo.views} views • {currentVideo.timeAgo}
                  </div>
                </div>
                <Button onClick={handleFollow} variant="outline" size="sm">
                  Follow
                </Button>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Button 
                  variant={isLiked ? "default" : "outline"} 
                  size="icon" 
                  onClick={handleLike}
                  className={isLiked ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant={isSaved ? "default" : "outline"} 
                  size="icon" 
                  onClick={handleSave}
                  className={isSaved ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Bookmark className="h-4 w-4" />
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
            
            {/* Comments section with collapsible */}
            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
              
              {/* Always show the first comment */}
              {comments.length > 0 && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comments[0].avatar} alt={comments[0].username} />
                    <AvatarFallback>{comments[0].username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comments[0].username}</span>
                      <span className="text-xs text-muted-foreground">{comments[0].timeAgo}</span>
                    </div>
                    <p className="mt-1">{comments[0].comment}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-xs">{comments[0].likes}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Collapsible section for remaining comments */}
              {comments.length > 1 && (
                <Collapsible open={showAllComments} onOpenChange={setShowAllComments}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <MoreHorizontal className="h-4 w-4" />
                      <span>{showAllComments ? "Hide comments" : "View more comments"}</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-4 pt-2">
                      {comments.slice(1).map((comment) => (
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
                  </CollapsibleContent>
                </Collapsible>
              )}
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
                id={video.id}
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
