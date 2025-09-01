import { Shield, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
// Icon is now served from public directory

export const Header = () => {
  const { user } = useAuthStore();

  return (
    <>
      {/* Header Background Image - Separately positioned below navbar */}
      <div className="w-full h-96 bg-cover bg-center" style={{
        backgroundImage: `url(/forensic-lab-bg.jpg)`,
        backgroundSize: 'cover'
      }} />

      {/* Content Section - Positioned below the image */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {/* Professional Header */}
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-lg px-6 py-3 mb-6 shadow-sm">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-gray-700 font-medium">Forensic Investigation System</span>
              <Badge variant="outline" className="border-red-300 text-red-600">v2.0</Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
              Forensic
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-6 tracking-wide">
              Investigation Center
            </h2>
            
            <div className="flex items-center justify-center space-x-6 text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Officer: {user?.username || 'Unknown'}</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced forensic face recognition and sketch creation tools for law enforcement professionals. 
              Access cutting-edge technology to solve cases faster and more accurately.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
