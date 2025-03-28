
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Settings, Share2 } from "lucide-react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStories } from "@/components/profile/profile-stories";
import { ProfileGrid } from "@/components/profile/profile-grid";
import { VideosContainer } from "@/components/videos/videos-container";

const fallbackProfileData = {
  username: "user",
  name: "User",
  bio: "No bio yet",
  avatar: "https://i.pravatar.cc/150?img=1",
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
  isCurrentUser: true,
};

const userStories = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    date: "Today",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    date: "Yesterday",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1618605588556-c887188781cc",
    date: "2d ago",
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc",
    date: "5d ago",
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1543363950-2a8a60fe7a68",
    date: "1w ago",
  },
];

const postItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    type: "image" as const,
    likes: 245,
    comments: 42,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    type: "video" as const,
    likes: 192,
    comments: 23,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    type: "image" as const,
    likes: 163,
    comments: 15,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1560859251-d563a49c5e41",
    type: "carousel" as const,
    likes: 345,
    comments: 58,
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1543363950-2a8a60fe7a68",
    type: "image" as const,
    likes: 129,
    comments: 12,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc",
    type: "video" as const,
    likes: 276,
    comments: 34,
  },
];

const reelsItems = [
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1618605588556-c887188781cc",
    type: "video" as const,
    likes: 345,
    comments: 67,
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc",
    type: "video" as const,
    likes: 276,
    comments: 34,
  },
];

const videoItems = [
  {
    id: "11",
    image: "https://images.unsplash.com/photo-1618605588556-c887188781cc",
    type: "video" as const,
    likes: 176,
    comments: 28,
  },
  {
    id: "12",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    type: "video" as const,
    likes: 134,
    comments: 19,
  },
];

export default function Profile() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  
  const profileData = {
    username: profile?.username || fallbackProfileData.username,
    name: profile?.display_name || profile?.username || fallbackProfileData.name,
    bio: profile?.bio || fallbackProfileData.bio,
    avatar: profile?.avatar_url || fallbackProfileData.avatar,
    postsCount: profile?.posts_count || fallbackProfileData.postsCount,
    followersCount: profile?.followers_count || fallbackProfileData.followersCount,
    followingCount: profile?.following_count || fallbackProfileData.followingCount,
    isCurrentUser: true,
  };
  
  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Share Profile",
      description: "Profile link copied to clipboard",
    });
  };
  
  const handleFollowersClick = () => {
    toast({
      title: "Followers",
      description: "Followers list would open here",
    });
  };

  const handleFollowingClick = () => {
    toast({
      title: "Following",
      description: "Following list would open here",
    });
  };

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Settings panel would open here",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <ProfileHeader 
          username={profileData.username}
          name={profileData.name}
          bio={profileData.bio}
          avatar={profileData.avatar}
          postsCount={profileData.postsCount}
          followersCount={profileData.followersCount}
          followingCount={profileData.followingCount}
          isCurrentUser={profileData.isCurrentUser}
          onEditProfile={() => setEditProfileOpen(true)}
          onSettingsClick={handleSettingsClick}
          editProfileOpen={editProfileOpen}
          setEditProfileOpen={setEditProfileOpen}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
        />
        
        <ProfileStories 
          stories={userStories} 
          isCurrentUser={profileData.isCurrentUser} 
        />
        
        <div className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-200/80 p-1.5 rounded-lg">
              <TabsTrigger 
                value="posts" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-social-purple data-[state=active]:to-social-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="reels" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-social-blue data-[state=active]:to-social-pink data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Reels
              </TabsTrigger>
              <TabsTrigger 
                value="videos" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-social-pink data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6">
              <ProfileGrid items={postItems} />
            </TabsContent>
            
            <TabsContent value="reels" className="mt-6">
              <ProfileGrid items={reelsItems} />
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
              <VideosContainer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
