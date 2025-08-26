import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLayout } from './Layout';
import { Sidebar } from '@/pages/dashboard/sidebar';
import iconImage from '../assets/icon.png';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger Menu Button - Left */}
            <div className="flex items-center flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-amber-50 text-gray-700"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Logo & Title - Center */}
            <div className="flex items-center justify-center flex-1 min-w-0">
              <Link to="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={iconImage} 
                    alt="EYE'dentify Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800 truncate">EYE'dentify</span>
              </Link>
            </div>

            {/* Profile Menu - Right */}
            <div className="flex items-center flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-amber-50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-red-500 text-white">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-amber-200 shadow-lg" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-800">{user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-amber-200" />
                  <DropdownMenuItem asChild className="hover:bg-amber-50 focus:bg-amber-50">
                    <Link to="/profile" className="flex items-center text-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-amber-50 focus:bg-amber-50">
                    <Link to="/settings" className="flex items-center text-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-200" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Component */}
      <Sidebar />
    </>
  );
};