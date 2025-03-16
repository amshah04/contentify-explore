
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { 
  Image, 
  Film, 
  PlaySquare, 
  Clock, 
  Video, 
  Upload as UploadIcon 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type UploadType = "post" | "story" | "video" | "reels" | "live";

export default function Upload() {
  const [selectedType, setSelectedType] = useState<UploadType | null>(null);
  
  const handleSelectType = (type: UploadType) => {
    setSelectedType(type);
  };
  
  const handleUpload = () => {
    if (!selectedType) return;
    
    toast({
      title: `Upload ${selectedType}`,
      description: `Your ${selectedType} is being uploaded`,
    });
    
    // Reset selection after mock upload
    setTimeout(() => {
      setSelectedType(null);
      toast({
        title: "Upload complete",
        description: "Your content has been uploaded successfully!",
      });
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Upload Content</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UploadCard
            type="post"
            title="Photo Post"
            description="Share a photo with your followers"
            icon={Image}
            isSelected={selectedType === "post"}
            onSelect={handleSelectType}
          />
          
          <UploadCard
            type="story"
            title="Story"
            description="Share a photo or video that disappears in 24 hours"
            icon={Clock}
            isSelected={selectedType === "story"}
            onSelect={handleSelectType}
          />
          
          <UploadCard
            type="video"
            title="Video"
            description="Share a long-form video (up to several hours)"
            icon={PlaySquare}
            isSelected={selectedType === "video"}
            onSelect={handleSelectType}
          />
          
          <UploadCard
            type="reels"
            title="Reels"
            description="Create a short video (up to 60 seconds)"
            icon={Film}
            isSelected={selectedType === "reels"}
            onSelect={handleSelectType}
          />
          
          <UploadCard
            type="live"
            title="Go Live"
            description="Start a live video stream"
            icon={Video}
            isSelected={selectedType === "live"}
            onSelect={handleSelectType}
          />
        </div>
        
        {selectedType && (
          <div className="mt-8 p-6 border rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <UploadIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                {selectedType === "post" && "Upload Photo"}
                {selectedType === "story" && "Create Story"}
                {selectedType === "video" && "Upload Video"}
                {selectedType === "reels" && "Create Reel"}
                {selectedType === "live" && "Go Live"}
              </h2>
              <p className="text-center text-muted-foreground mb-4">
                {selectedType === "post" && "Share a photo with your followers. Add a caption, location, and tags."}
                {selectedType === "story" && "Share a photo or video that disappears in 24 hours. Add stickers, text, and effects."}
                {selectedType === "video" && "Share a long-form video with your followers. Add a title, description, and thumbnail."}
                {selectedType === "reels" && "Create a short video with music, effects, and text. Perfect for sharing creative content."}
                {selectedType === "live" && "Start a live video stream and interact with your followers in real-time."}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setSelectedType(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  {selectedType === "live" ? "Start Streaming" : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

interface UploadCardProps {
  type: UploadType;
  title: string;
  description: string;
  icon: React.ElementType;
  isSelected: boolean;
  onSelect: (type: UploadType) => void;
}

function UploadCard({ type, title, description, icon: Icon, isSelected, onSelect }: UploadCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(type)}
    >
      <CardHeader>
        <Icon className="h-8 w-8 mb-2" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant={isSelected ? "default" : "outline"} className="w-full">
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
