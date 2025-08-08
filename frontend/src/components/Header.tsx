import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink as RouterNavLink, Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Heart,
  MessageSquare,
  Search,
  Grid3X3,
  Bell,
  User,
  LogOut,
  Crown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-yellow-400">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Logo */}
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2 sm:space-x-3">
            <img src={logo} alt="Public Matrimony Logo" className="h-10 w-10 sm:h-14 sm:w-14 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                Public Matrimony
              </span>
              <span className="text-xs sm:text-sm text-yellow-600 font-medium">Find Your Perfect Match</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-wrap gap-1">
            {isLoggedIn ? (
              <>
                <NavLink to="/home" icon={<Home className="h-4 w-4" />} text="Home" />
                <NavLink to="/search" icon={<Users className="h-4 w-4" />} text="Matches" />
                <NavLink to="/dashboard" icon={<Heart className="h-4 w-4" />} text="Interests" />
                <NavLink to="/messages" icon={<MessageSquare className="h-4 w-4" />} text="Messages" />
                <NavLink to="/events" icon={<Grid3X3 className="h-4 w-4" />} text="Events" />
                <NavLink to="/membership" icon={<Crown className="h-4 w-4" />} text="Membership" />
                <Link
                  to="/notifications"
                  className="flex items-center px-2 sm:px-4 py-2 relative rounded-lg hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200 text-sm font-medium text-gray-700"
                >
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <NavLink to="/" icon={<Home className="h-4 w-4" />} text="Home" />
                <NavLink to="/search" icon={<Search className="h-4 w-4" />} text="Search" />
                <NavLink to="/membership" icon={<Crown className="h-4 w-4" />} text="Membership" />
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 font-medium px-4 sm:px-6 text-sm"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-400 text-red-700 hover:bg-red-50 font-medium px-4 sm:px-6 text-sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 font-medium px-4 sm:px-6 text-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold px-4 sm:px-6 shadow-lg text-sm">
                    Join Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-yellow-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} className="text-yellow-700" /> : <Menu size={24} className="text-yellow-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2 text-sm">
            {isLoggedIn ? (
              <>
                <MobileLink to="/home" text="Home" />
                <MobileLink to="/search" text="Matches" />
                <MobileLink to="/dashboard" text="Interests" />
                <MobileLink to="/messages" text="Messages" />
                <MobileLink to="/events" text="Events" />
                <MobileLink to="/membership" text="Membership" />
                <MobileLink to="/notifications" text="Notifications" />
                <Button variant="ghost" className="text-left text-yellow-700" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
                <Button variant="ghost" className="text-left text-red-600" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <MobileLink to="/" text="Home" />
                <MobileLink to="/search" text="Search" highlight />
                <MobileLink to="/membership" text="Membership" />
                <MobileLink to="/login" text="Login" />
                <Link
                  to="/signup"
                  className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded text-center"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// Desktop NavLink with Active Highlight
const NavLink = ({ to, icon, text }: any) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-1 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
        isActive
          ? "text-yellow-600 font-semibold shadow-md shadow-yellow-400 bg-yellow-50"
          : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
      }`
    }
  >
    {icon}
    <span>{text}</span>
  </RouterNavLink>
);

// Mobile Navigation Link
const MobileLink = ({ to, text, highlight }: any) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded ${
      highlight
        ? "text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
        : "text-gray-700 hover:bg-yellow-50"
    }`}
  >
    {text}
  </Link>
);

export default Header;
