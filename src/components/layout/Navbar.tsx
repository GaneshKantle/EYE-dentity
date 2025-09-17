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
// Icon is now served from public directory

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
        <div className="w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 3xl:px-20">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-16 md:h-16 lg:h-16 xl:h-16">
            {/* Hamburger Menu Button - Left */}
            <div className="flex items-center flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 xs:p-2 sm:p-2 hover:bg-amber-50 text-gray-700 transition-colors duration-200 ease-in-out"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5" />
                ) : (
                  <Menu className="h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>

            {/* Logo & Title - Center */}
            <div className="flex items-center justify-center flex-1 min-w-0 px-2 xs:px-3 sm:px-4">
              <Link to="/dashboard" className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 transition-transform duration-200 ease-in-out hover:scale-105">
                <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/icon.png" 
                    alt="EYE'dentify Logo" 
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
                <span className="font-bold text-sm xs:text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl text-gray-800 truncate">
                  EYE'dentify
                </span>
              </Link>
            </div>

            {/* Profile Menu - Right */}
            <div className="flex items-center flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 xs:h-10 xs:w-10 sm:h-10 sm:w-10 rounded-full hover:bg-amber-50 transition-all duration-200 ease-in-out hover:scale-105"
                  >
                    <Avatar className="h-8 w-8 xs:h-10 xs:w-10 sm:h-10 sm:w-10">
                      <AvatarFallback className="bg-red-500 text-white text-xs xs:text-sm sm:text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-48 xs:w-56 sm:w-56 md:w-56 lg:w-56 xl:w-56 bg-white border-amber-200 shadow-lg rounded-lg" 
                  align="end"
                  sideOffset={8}
                >
                  <div className="flex items-center justify-start gap-2 p-2 xs:p-3 sm:p-3">
                    <div className="flex flex-col space-y-0.5 xs:space-y-1 sm:space-y-1 leading-none">
                      <p className="font-medium text-gray-800 text-sm xs:text-base sm:text-base truncate max-w-[180px] xs:max-w-[200px] sm:max-w-[200px]">
                        {user?.username}
                      </p>
                      <p className="text-xs xs:text-sm sm:text-sm text-gray-600 truncate max-w-[180px] xs:max-w-[200px] sm:max-w-[200px]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-amber-200" />
                  <DropdownMenuItem asChild className="hover:bg-amber-50 focus:bg-amber-50 transition-colors duration-150 ease-in-out">
                    <Link to="/profile" className="flex items-center text-gray-700 text-sm xs:text-base sm:text-base py-2 xs:py-2.5 sm:py-2.5">
                      <User className="mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-amber-50 focus:bg-amber-50 transition-colors duration-150 ease-in-out">
                    <Link to="/settings" className="flex items-center text-gray-700 text-sm xs:text-base sm:text-base py-2 xs:py-2.5 sm:py-2.5">
                      <Settings className="mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-200" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors duration-150 ease-in-out text-sm xs:text-base sm:text-base py-2 xs:py-2.5 sm:py-2.5"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
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