import { Bell, ShoppingCart, User, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useCart} from "@/context/CartContext";
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const {user, isAuthenticated, setUser} = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //close dropdown when clicking outside

  useEffect(()=>{
    function handleClickOutside(event: MouseEvent){
      if(
        dropdownRef.current &&
        !dropdownRef.current?.contains(event.target as Node)
      ){
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    
  }

  const displayName = user?.firstName || user?.email ||"User";

  const avatarUrl = user?.user_profile_photo && user.user_profile_photo !== "default.png"
  ? `/uploads/${user.user_profile_photo}`
  : null;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-primary">Wow Pets Palace</span>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="shop" className="text-foreground hover:text-primary transition-colors">
              Explore Products
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Find Shelters
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Explore Breeds
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Track Your Pet
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Articles
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              About Us
            </a>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-secondary text-xs">
                3
              </Badge>
            </Button>
            <Button
            onClick={()=>navigate("/cart")}
            variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-secondary text-xs">
  {getTotalItems()}
</Badge>
            </Button>
            {/* <Button variant="ghost" size="icon" onClick={()=>navigate("/login")}>
              <User className="w-5 h-5" />
            </Button> */}

              {/* User Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                
                {/* Avatar */}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                    
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted"
                    >
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/login")}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}