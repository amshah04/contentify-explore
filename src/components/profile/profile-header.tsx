
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, MoreHorizontal } from "lucide-react";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onSettingsClick?: () => void;
  editProfileOpen?: boolean;
  setEditProfileOpen?: (open: boolean) => void;
}

export function ProfileHeader({
  username,
  name,
  bio,
  avatar,
  postsCount,
  followersCount,
  followingCount,
  isCurrentUser = true,
  onEditProfile,
  onSettingsClick,
  editProfileOpen = false,
  setEditProfileOpen,
}: ProfileHeaderProps) {
  // Use local state if no external state is provided
  const [localEditProfileOpen, setLocalEditProfileOpen] = useState(false);
  
  // Determine which state to use
  const isDialogOpen = editProfileOpen !== undefined ? editProfileOpen : localEditProfileOpen;
  const setIsDialogOpen = setEditProfileOpen || setLocalEditProfileOpen;
  
  // Handlers
  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">@{username}</p>
          </div>
        </div>
        {isCurrentUser ? (
          <div className="flex gap-2">
            <Button onClick={handleEditProfile}>Edit Profile</Button>
            <Button size="icon" variant="ghost" onClick={handleSettingsClick}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button>Follow</Button>
            <Button variant="outline">Message</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Block</DropdownMenuItem>
                <DropdownMenuItem>Copy profile URL</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <div className="text-center">
          <p className="font-bold">{postsCount}</p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{followersCount}</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{followingCount}</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      </div>

      <div>
        <p className="font-medium">{bio}</p>
      </div>

      {isCurrentUser && (
        <EditProfileDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          currentProfile={{
            name,
            username,
            bio,
            avatar
          }}
        />
      )}
    </div>
  );
}
