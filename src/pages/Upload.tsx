
import { useState, useRef } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image, 
  Film, 
  PlaySquare, 
  Clock, 
  Video, 
  Upload as UploadIcon,
  X
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
import { useUpload } from "@/hooks/use-upload";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

type UploadType = "post" | "story" | "video" | "reels" | "live";

export default function Upload() {
  const { user } = useAuth();
  const { uploadFile, isUploading, progress } = useUpload();
  const [selectedType, setSelectedType] = useState<UploadType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [music, setMusic] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSelectType = (type: UploadType) => {
    setSelectedType(type);
    // Reset form fields when changing type
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setTitle("");
    setDescription("");
    setMusic("");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (selectedType === "post" || selectedType === "story") {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image or video file",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedType === "video" || selectedType === "reels") {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }
    }
    
    setSelectedFile(file);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleUpload = async () => {
    if (!selectedType || !selectedFile || !user) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    let contentType: "posts" | "videos" | "reels" | "stories";
    let additionalData: Record<string, any> = {};
    
    switch (selectedType) {
      case "post":
        contentType = "posts";
        additionalData = { caption };
        break;
      case "story":
        contentType = "stories";
        break;
      case "video":
        contentType = "videos";
        additionalData = { title, description };
        break;
      case "reels":
        contentType = "reels";
        additionalData = { caption, music };
        break;
      case "live":
        // For live, we would handle differently
        toast({
          title: "Live streaming",
          description: "Going live functionality is coming soon!",
        });
        return;
      default:
        toast({
          title: "Error",
          description: "Invalid content type",
          variant: "destructive",
        });
        return;
    }
    
    const result = await uploadFile({
      userId: user.id,
      contentType,
      file: selectedFile,
      additionalData,
    });
    
    if (result) {
      // Reset form after successful upload
      setSelectedType(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      setTitle("");
      setDescription("");
      setMusic("");
    }
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
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept={
                      selectedType === "post" || selectedType === "story"
                        ? "image/*,video/*"
                        : "video/*"
                    }
                  />
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
                  <Button onClick={handleSelectFile}>
                    Select {selectedType === "post" ? "Photo" : "File"}
                  </Button>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {selectedType === "post" && "Upload Photo"}
                      {selectedType === "story" && "Create Story"}
                      {selectedType === "video" && "Upload Video"}
                      {selectedType === "reels" && "Create Reel"}
                      {selectedType === "live" && "Go Live"}
                    </h2>
                    <Button variant="outline" size="icon" onClick={handleRemoveFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="w-full md:w-1/2">
                      {previewUrl && selectedFile?.type.startsWith("image/") && (
                        <div className="aspect-square overflow-hidden rounded-md">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {previewUrl && selectedFile?.type.startsWith("video/") && (
                        <div className="aspect-video overflow-hidden rounded-md">
                          <video 
                            src={previewUrl} 
                            controls 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-1/2 space-y-4">
                      {(selectedType === "post" || selectedType === "reels") && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Caption
                          </label>
                          <Textarea
                            placeholder="Write a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="resize-none"
                            rows={3}
                          />
                        </div>
                      )}
                      
                      {selectedType === "video" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Title
                            </label>
                            <Input
                              placeholder="Enter a title..."
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Description
                            </label>
                            <Textarea
                              placeholder="Write a description..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="resize-none"
                              rows={5}
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedType === "reels" && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Music
                          </label>
                          <Input
                            placeholder="Add music info..."
                            value={music}
                            onChange={(e) => setMusic(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isUploading && (
                    <div className="mb-4">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center mt-1">{progress}% uploaded</p>
                    </div>
                  )}
                  
                  <div className="flex gap-4 justify-end">
                    <Button variant="outline" onClick={() => setSelectedType(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? "Uploading..." : (selectedType === "live" ? "Start Streaming" : "Upload")}
                    </Button>
                  </div>
                </div>
              )}
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
