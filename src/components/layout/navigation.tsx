
import { Bell, Home, MessageCircle, PlusSquare, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: PlusSquare, label: "Create", path: "/create" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Navigation({ className }: { className?: string }) {
  return (
    <nav className={cn("fixed bottom-0 left-0 z-50 w-full border-t bg-background p-2 md:relative md:border-r md:p-4", className)}>
      <div className="hidden md:flex md:flex-col md:items-center md:gap-2">
        <div className="mb-6 flex items-center">
          <h1 className="text-3xl font-bold social-text-gradient">Social</h1>
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
        <div className="mt-auto">
          <ModeToggle />
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
