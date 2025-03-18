import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VideosContainer } from "@/components/videos/videos-container";
import { ProfileGrid } from "@/components/profile/profile-grid";

// Dummy profile data
const profileData = {
  username: "john_doe",
  name: "John Doe",
  bio: "Photographer & Travel Enthusiast 📸 | Exploring the world one photo at a time ✈️",
  avatar: "https://i.pravatar.cc/150?img=1",
  postsCount: 42,
  followersCount: 1254,
  followingCount: 567,
  isCurrentUser: true,
};

// Dummy grid items for different tabs
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
  const [activeTab, setActiveTab] = useState<string>("posts");
  
  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile edit form would open here",
    });
  };
  
  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Share Profile",
      description: "Profile link copied to clipboard",
    });
  };
  
  const handleSettingsOption = (option: string) => {
    toast({
      title: option,
      description: `${option} page would open here`,
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "Account deletion confirmation would appear here",
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{profileData.username}</h1>
          {profileData.isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSettingsOption("Account Settings")}>
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsOption("Account Center")}>
                  Account Center
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsOption("Saved")}>
                  Saved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsOption("Watch Later")}>
                  Watch Later
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsOption("Downloaded Videos")}>
                  Downloaded Videos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsOption("Account Privacy")}>
                  Account Privacy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-500">
                  Delete Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full overflow-hidden">
              <img 
                src={profileData.avatar} 
                alt={profileData.username} 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <p className="font-bold">{profileData.postsCount}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center cursor-pointer" onClick={handleFollowersClick}>
                <p className="font-bold">{profileData.followersCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center cursor-pointer" onClick={handleFollowingClick}>
                <p className="font-bold">{profileData.followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="font-medium">{profileData.name}</p>
              <p className="text-sm whitespace-pre-line">{profileData.bio}</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleEditProfile} className="flex-1">Edit Profile</Button>
              <Button onClick={handleShareProfile} variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reels">Reels</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <ProfileGrid items={postItems} />
          </TabsContent>
          
          <TabsContent value="reels" className="mt-6">
            <ProfileGrid items={reelsItems} />
          </TabsContent>
          
          <TabsContent value="videos" className="mt-6">
            <ProfileGrid items={videoItems} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
