
import { VideoCard } from "./video-card";

// Dummy data for videos
const videos = [
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
  {
    id: "4",
    title: "Easy Dinner Recipes Under 30 Minutes",
    channelName: "CookingWithJoy",
    channelAvatar: "https://i.pravatar.cc/150?img=15",
    thumbnail: "https://images.unsplash.com/photo-1493770348161-369560ae357d",
    views: "412K",
    timeAgo: "3 days ago",
    duration: "12:38",
  },
];

export function VideosContainer() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {videos.map((video) => (
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
  );
}
