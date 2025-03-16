
import { Layout } from "@/components/layout/layout";
import { ProfileHeader } from "@/components/profile/profile-header";
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

// Dummy grid items
const gridItems = [
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

export default function Profile() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          username={profileData.username}
          name={profileData.name}
          bio={profileData.bio}
          avatar={profileData.avatar}
          postsCount={profileData.postsCount}
          followersCount={profileData.followersCount}
          followingCount={profileData.followingCount}
          isCurrentUser={profileData.isCurrentUser}
        />
        <ProfileGrid items={gridItems} />
      </div>
    </Layout>
  );
}
