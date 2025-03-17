
import { useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Notifications() {
  const { user } = useAuth();
  const { 
    notifications, 
    isLoading, 
    fetchNotifications, 
    markAsRead,
  } = useNotifications();
  
  useEffect(() => {
    if (user) {
      // Mark all notifications as read when the page loads
      markAsRead();
    }
  }, [user]);
  
  const getFilteredNotifications = (type?: string) => {
    if (!type || type === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.type === type);
  };
  
  const handleFollow = async (userId: string) => {
    // This would be implemented with a hook to follow users
    console.log(`Following user ${userId}`);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
          <p>Please sign in to view your notifications</p>
          <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold my-4">Notifications</h1>
        
        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="like">Likes</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
            <TabsTrigger value="follow">Follows</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <NotificationsList 
              notifications={getFilteredNotifications()} 
              isLoading={isLoading}
              onFollow={handleFollow}
            />
          </TabsContent>
          
          <TabsContent value="like" className="mt-4">
            <NotificationsList 
              notifications={getFilteredNotifications('like')} 
              isLoading={isLoading}
              onFollow={handleFollow}
            />
          </TabsContent>
          
          <TabsContent value="comment" className="mt-4">
            <NotificationsList 
              notifications={getFilteredNotifications('comment')} 
              isLoading={isLoading}
              onFollow={handleFollow}
            />
          </TabsContent>
          
          <TabsContent value="follow" className="mt-4">
            <NotificationsList 
              notifications={getFilteredNotifications('follow')} 
              isLoading={isLoading}
              onFollow={handleFollow}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

interface NotificationsListProps {
  notifications: any[];
  isLoading: boolean;
  onFollow: (userId: string) => void;
}

function NotificationsList({ notifications, isLoading, onFollow }: NotificationsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No notifications to show</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.actor?.avatar_url} alt={notification.actor?.username} />
            <AvatarFallback>{notification.actor?.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-wrap gap-1">
              <span className="font-semibold">{notification.actor?.username || 'Someone'}</span>
              <span>{notification.content}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </p>
          </div>
          
          {notification.type === "follow" && notification.actor?.id && (
            <Button size="sm" onClick={() => onFollow(notification.actor.id)}>
              Follow
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
