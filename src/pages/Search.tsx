
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Dummy data for search results
const exploreItems = [
  {
    id: "1",
    type: "photo",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    username: "nature_lover",
  },
  {
    id: "2",
    type: "reel",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    username: "travel_addict",
  },
  {
    id: "3",
    type: "photo",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    username: "food_lover",
  },
  {
    id: "4",
    type: "photo",
    image: "https://images.unsplash.com/photo-1543363950-2a8a60fe7a68",
    username: "photographer",
  },
  {
    id: "5",
    type: "reel",
    image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc",
    username: "adventure_time",
  },
  {
    id: "6",
    type: "photo",
    image: "https://images.unsplash.com/photo-1560859251-d563a49c5e41",
    username: "city_explorer",
  },
  {
    id: "7",
    type: "reel",
    image: "https://images.unsplash.com/photo-1618605588556-c887188781cc",
    username: "digital_art",
  },
  {
    id: "8",
    type: "photo",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    username: "tech_talks",
  },
  {
    id: "9",
    type: "photo",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    username: "photo_master",
  },
];

// Dummy data for search accounts
const searchAccounts = [
  {
    id: "1",
    username: "nature_lover",
    name: "Nature Photography",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "2",
    username: "travel_addict",
    name: "Around The World",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "3",
    username: "food_lover",
    name: "Tasty Recipes",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            className="pl-10 pr-10 py-2 h-12"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 flex items-center"
              onClick={clearSearch}
            >
              ✕
            </Button>
          )}
        </div>
        
        {isSearching ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Accounts</h2>
            <div className="space-y-3">
              {searchAccounts
                .filter(account => 
                  account.username.includes(searchQuery.toLowerCase()) || 
                  account.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((account) => (
                  <Link key={account.id} to={`/profile/${account.username}`} className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={account.avatar} alt={account.username} />
                      <AvatarFallback>{account.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{account.username}</div>
                      <div className="text-sm text-muted-foreground">{account.name}</div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Explore</h2>
            <div className="grid grid-cols-3 gap-1">
              {exploreItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.type === "reel" ? `/reels` : `/photo/${item.id}`}
                  className="relative aspect-square overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {item.type === "reel" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/50 p-2">
                        <div className="h-8 w-8 text-white">▶</div>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
