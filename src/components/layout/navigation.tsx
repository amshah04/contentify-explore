
import { Home, Search, Film, PlusSquare, User, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: PlusSquare, label: "Upload", path: "/upload" },
    { icon: Film, label: "Reels", path: "/reels" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className={cn("bg-background", className)}>
      <div className="hidden md:flex md:flex-col md:items-center md:gap-2 md:p-4">
        <div className="mb-6 flex items-center">
          <Link to="/">
            <h1 className="text-3xl font-bold social-text-gradient">Social</h1>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.path}
              className="flex items-center gap-4 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto space-y-2">
          <ModeToggle />
          {user ? (
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-around md:hidden">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className="flex flex-col items-center gap-1 p-2"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
