
import { PostCard } from "./post-card";

// Dummy data for posts
const posts = [
  {
    id: "1",
    username: "jane_smith",
    avatar: "https://i.pravatar.cc/150?img=3",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    caption: "Beautiful sunset at the beach! 🌅 #sunset #beach #summer",
    likes: 1245,
    timeAgo: "2 hours ago",
    comments: 42,
  },
  {
    id: "2",
    username: "travel_addict",
    avatar: "https://i.pravatar.cc/150?img=4",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    caption: "Exploring new places is always an adventure! 🧳✈️ #travel #explore #adventure",
    likes: 892,
    timeAgo: "5 hours ago",
    comments: 23,
  },
  {
    id: "3",
    username: "food_lover",
    avatar: "https://i.pravatar.cc/150?img=5",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    caption: "Homemade pasta for dinner tonight! 🍝 #food #homemade #dinner",
    likes: 563,
    timeAgo: "7 hours ago",
    comments: 15,
  },
];

export function PostsContainer() {
  return (
    <div className="max-w-2xl mx-auto">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          username={post.username}
          avatar={post.avatar}
          image={post.image}
          caption={post.caption}
          likes={post.likes}
          timeAgo={post.timeAgo}
          comments={post.comments}
        />
      ))}
    </div>
  );
}
