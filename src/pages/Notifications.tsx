
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

// Dummy data for notifications
const allNotifications = [
  {
    id: "1",
    type: "like",
    username: "sarah_designs",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "liked your photo",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isFollowing: true,
  },
  {
    id: "2",
    type: "comment",
    username: "travel_addict",
    avatar: "https://i.pravatar.cc/150?img=4",
    content: "commented on your post: \"This is amazing! Where was this taken?\"",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isFollowing: true,
  },
  {
    id: "3",
    type: "follow",
    username: "photo_master",
    avatar: "https://i.pravatar.cc/150?img=13",
    content: "started following you",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isFollowing: false,
  },
  {
    id: "4",
    type: "mention",
    username: "city_explorer",
    avatar: "https://i.pravatar.cc/150?img=21",
    content: "mentioned you in a comment: \"@john_doe check this out!\"",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    isFollowing: true,
  },
  {
    id: "5",
    type: "like",
    username: "nature_lover",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "liked your video",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    isFollowing: false,
  }
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const handleFollow = (username: string) => {
    // In a real app, this would make an API call to follow the user
    console.log(`Following ${username}`);
  };
  
  const getNotifications = () => {
    if (activeTab === "all") {
      return allNotifications;
    } else {
      return allNotifications.filter(notification => notification.type === activeTab);
    }
  };
  
  const displayedNotifications = getNotifications();
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold my-4">Notifications</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full mb-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="follow">Follows</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.avatar} alt={notification.username} />
                  <AvatarFallback>{notification.username[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1">
                    <span className="font-semibold">{notification.username}</span>
                    <span>{notification.content}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </p>
                </div>
                
                {notification.type === "follow" && !notification.isFollowing && (
                  <Button size="sm" onClick={() => handleFollow(notification.username)}>
                    Follow
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notifications to show</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
