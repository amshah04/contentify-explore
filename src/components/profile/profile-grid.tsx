
import { Card } from "@/components/ui/card";

interface GridItem {
  id: string;
  image: string;
  type: "image" | "video" | "carousel";
  likes: number;
  comments: number;
}

interface ProfileGridProps {
  items: GridItem[];
}

export function ProfileGrid({ items }: ProfileGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 mt-6">
      {items.map((item) => (
        <Card key={item.id} className="group relative aspect-square overflow-hidden rounded-none">
          <img
            src={item.image}
            alt="Post"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex gap-4 text-white">
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{item.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💬</span>
                <span>{item.comments}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
