
import { MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PageHeader() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
      <Link to="/" className="text-xl font-bold social-text-gradient">
        SocialNest
      </Link>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/messages">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
