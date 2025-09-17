import { useLocation, useNavigate } from 'react-router-dom';
import { Scan, PenTool, Database, Home } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/layout/Layout';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Face Recognition', path: '/face-recognition', icon: Scan },
  { name: 'Make Sketch', path: '/make-sketch', icon: PenTool },
  { name: 'Criminal Database', path: '/criminal-database', icon: Database },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-14 xs:top-16 sm:top-16 h-[calc(100vh-3.5rem)] xs:h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] w-64 xs:w-72 sm:w-80 md:w-80 lg:w-80 xl:w-80 bg-white border-r border-amber-200 shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4 xs:p-5 sm:p-6 md:p-6 lg:p-6 xl:p-8">
              {/* Header Section */}
              <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-6">
                <h2 className="text-base xs:text-lg sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 xs:mb-2 sm:mb-2">Navigation</h2>
                <div className="w-10 xs:w-12 sm:w-12 md:w-14 h-0.5 xs:h-0.5 sm:h-0.5 bg-red-500 rounded-full" />
              </div>
              
              {/* Navigation Items */}
              <nav className="space-y-1.5 xs:space-y-2 sm:space-y-2 md:space-y-2 mb-6 xs:mb-8 sm:mb-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center space-x-2 xs:space-x-3 sm:space-x-3 px-3 xs:px-4 sm:px-4 py-2.5 xs:py-3 sm:py-3 rounded-lg transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-red-100 text-red-600 border border-red-200 shadow-sm'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-red-600 hover:border hover:border-amber-200 hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium text-xs xs:text-sm sm:text-sm">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* User Profile Section */}
              <div className="pt-4 xs:pt-6 sm:pt-6 border-t border-amber-200">
                <div className="flex items-center space-x-2.5 xs:space-x-3 sm:space-x-3 px-3 xs:px-4 sm:px-4 py-2.5 xs:py-3 sm:py-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Avatar className="h-7 w-7 xs:h-8 xs:w-8 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-red-500 text-white text-xs font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs xs:text-sm sm:text-sm font-semibold text-gray-800 truncate mb-0.5">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
