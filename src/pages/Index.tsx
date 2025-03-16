
import { useEffect, useState } from "react";
import Auth from "./Auth";
import Home from "./Home";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // For demo purposes, let's auto-login after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoggedIn(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return isLoggedIn ? <Home /> : <Auth />;
};

export default Index;
