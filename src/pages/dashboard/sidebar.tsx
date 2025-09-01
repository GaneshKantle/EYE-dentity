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
            className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-70 bg-white border-r border-amber-200 shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Navigation</h2>
                <div className="w-12 h-0.5 bg-red-500 rounded-full" />
              </div>
              
              {/* Navigation Items */}
              <nav className="space-y-2 mb-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-red-100 text-red-600 border border-red-200 shadow-sm'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-red-600 hover:border hover:border-amber-200 hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* User Profile Section */}
              <div className="pt-6 border-t border-amber-200">
                <div className="flex items-center space-x-3 px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-red-500 text-white text-xs font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate mb-0.5">
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
