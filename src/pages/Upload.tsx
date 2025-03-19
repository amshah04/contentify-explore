import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image, 
  Film, 
  Video,
  Play, 
  X,
  ChevronDown,
  Camera,
  ImagePlus
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { 
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";

type UploadType = "post" | "story" | "reel" | "video" | "live";

export default function Upload() {
  const { user } = useAuth();
  const { uploadFile, isUploading, progress } = useUpload();
  const isMobile = useIsMobile();
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<UploadType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [music, setMusic] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [recentMedia, setRecentMedia] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    const demoImages = [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ];
    setRecentMedia(demoImages);
  }, []);
  
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: selectedType === "live" || selectedType === "reel" || selectedType === "video"
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
          setCameraPermission(true);
          setShowCamera(true);
        }
      } else {
        toast({
          title: "Camera not available",
          description: "Your device doesn't support camera access or permission was denied",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCamera(false);
  };
  
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
            
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            
            if (selectedType !== "live" && selectedType !== "video" && selectedType !== "reel") {
              stopCamera();
            }
          }
        }, 'image/jpeg', 0.92);
      }
    }
  };
  
  const handleUploadTypeSelect = (type: UploadType) => {
    setSelectedType(type);
    
    if (type === "live") {
      startCamera();
    } else {
      setIsMediaPickerOpen(true);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (selectedType === "post" || selectedType === "story") {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image or video file",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedType === "video" || selectedType === "reel" || selectedType === "live") {
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
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsMediaPickerOpen(false);
    
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  const handleSelectMultiple = () => {
    toast({
      title: "Multiple selection",
      description: "You can select multiple files for your post",
    });
  };
  
  const handleCameraButton = () => {
    startCamera();
    setIsMediaPickerOpen(false);
  };
  
  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleClose = () => {
    stopCamera();
    setSelectedType(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption("");
    setTitle("");
    setDescription("");
    setMusic("");
    setIsMediaPickerOpen(false);
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
      case "reel":
        contentType = "reels";
        additionalData = { caption, music };
        break;
      case "live":
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
      handleClose();
      toast({
        title: "Upload successful",
        description: `Your ${selectedType} has been uploaded`,
      });
    }
  };
  
  const renderUploadButton = () => (
    <div className="flex flex-col gap-4 items-center">
      <Button 
        onClick={() => setIsMediaPickerOpen(true)} 
        className="rounded-full p-8 flex items-center justify-center"
      >
        <Camera className="h-8 w-8" />
      </Button>
      
      <Button
        onClick={openGallery}
        variant="outline"
        className="rounded-full flex items-center gap-2"
      >
        <ImagePlus className="h-5 w-5" />
        <span>Gallery</span>
      </Button>
    </div>
  );
  
  const renderMediaPicker = () => {
    const Component = isMobile ? Drawer : Dialog;
    const ContentComponent = isMobile ? DrawerContent : DialogContent;
    const CloseComponent = isMobile ? DrawerClose : DialogClose;
    
    return (
      <Component open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <ContentComponent className="p-0 max-w-full sm:max-w-full h-[90vh] sm:h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <CloseComponent asChild>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </CloseComponent>
              <h2 className="text-xl font-semibold">New post</h2>
              <Button variant="ghost" className="text-blue-500 font-semibold" onClick={handleUpload}>
                Next
              </Button>
            </div>
            
            <div className="flex-1 bg-black flex items-center justify-center">
              {showCamera ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {selectedType !== "live" && (
                    <button 
                      className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2"
                      onClick={takePhoto}
                    >
                      <div className="bg-white rounded-full w-16 h-16 border-2 border-gray-300" />
                    </button>
                  )}
                  
                  {selectedType === "live" && (
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full">
                      Live
                    </div>
                  )}
                </div>
              ) : previewUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  {selectedFile?.type.startsWith("video/") ? (
                    <video 
                      src={previewUrl} 
                      controls 
                      className="max-h-full max-w-full"
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className="text-white">Select media to upload</div>
              )}
            </div>
            
            <div className="bg-black text-white p-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="font-semibold">Recents</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-white border-white/20 bg-white/10" onClick={handleSelectMultiple}>
                    SELECT MULTIPLE
                  </Button>
                  <Button variant="outline" className="text-white border-white/20 bg-white/10 rounded-full p-2" onClick={handleCameraButton}>
                    <Camera className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="text-white border-white/20 bg-white/10 rounded-full p-2" onClick={openGallery}>
                    <Image className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-0.5">
                {recentMedia.map((media, index) => (
                  <div 
                    key={index}
                    className="aspect-square overflow-hidden cursor-pointer" 
                    onClick={() => {
                      setPreviewUrl(media);
                    }}
                  >
                    <img 
                      src={media} 
                      alt={`Recent media ${index}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black text-white p-4 flex justify-around border-t border-white/10">
              <button 
                className={`uppercase font-semibold ${selectedType === 'post' ? 'text-white' : 'text-white/50'}`}
                onClick={() => handleUploadTypeSelect('post')}
              >
                Post
              </button>
              <button 
                className={`uppercase font-semibold ${selectedType === 'story' ? 'text-white' : 'text-white/50'}`}
                onClick={() => handleUploadTypeSelect('story')}
              >
                Story
              </button>
              <button 
                className={`uppercase font-semibold ${selectedType === 'reel' ? 'text-white' : 'text-white/50'}`}
                onClick={() => handleUploadTypeSelect('reel')}
              >
                Reel
              </button>
              <button 
                className={`uppercase font-semibold ${selectedType === 'video' ? 'text-white' : 'text-white/50'}`}
                onClick={() => handleUploadTypeSelect('video')}
              >
                Video
              </button>
              <button 
                className={`uppercase font-semibold ${selectedType === 'live' ? 'text-white' : 'text-white/50'}`}
                onClick={() => handleUploadTypeSelect('live')}
              >
                Live
              </button>
            </div>
          </div>
        </ContentComponent>
      </Component>
    );
  };
  
  const renderHiddenFileInput = () => (
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
  );
  
  return (
    <Layout>
      <div className="flex items-center justify-center h-[calc(100vh-60px)]">
        {renderUploadButton()}
        {renderMediaPicker()}
        {renderHiddenFileInput()}
      </div>
    </Layout>
  );
}
