
import { useEffect } from "react";
import Auth from "./Auth";
import Home from "./Home";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }
  
  return user ? <Home /> : <Auth />;
};

export default Index;
