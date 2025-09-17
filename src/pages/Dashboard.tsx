import { useNavigate } from 'react-router-dom';
import { Scan, PenTool, Database, ArrowRight, Shield, FileText, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/pages/dashboard/header';
import { Footer } from '@/pages/dashboard/footer';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    id: 'face-recognition',
    title: 'Face Recognition',
    description: 'Upload a sketch or photo to find matches in our database',
    icon: Scan,
    path: '/face-recognition',
    color: 'primary',
  },
  {
    id: 'make-sketch',
    title: 'Make Sketch',
    description: 'Create detailed facial sketches using our digital tools',
    icon: PenTool,
    path: '/make-sketch',
    color: 'secondary',
  },
  {
    id: 'criminal-database',
    title: 'Criminal Database',
    description: 'Manage criminal records and facial data',
    icon: Database,
    path: '/criminal-database',
    color: 'success',
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800 relative overflow-hidden">
      {/* Background Pattern - Subtle Investigation Board Effect */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(239, 68, 68, 0.02) 50%, transparent 60%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 200px 200px'
        }} />
      </div>

      {/* Subtle Border Accents */}
      <div className="absolute top-0 left-0 right-0 h-0.5 xs:h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-10" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 xs:h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-10" />

      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto">
          {/* Main Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16"
          >
            <div className="text-center mb-6 xs:mb-8 sm:mb-8 md:mb-10">
              <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4">
                Investigation Tools
              </h3>
              <div className="w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 h-0.5 xs:h-1 sm:h-1.5 bg-red-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 xs:gap-6 sm:gap-6 md:gap-8 lg:gap-8 xl:gap-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <Card 
                      className="bg-white/80 backdrop-blur-sm border-amber-200 hover:border-red-300 transition-all duration-300 cursor-pointer group-hover:scale-105 h-full shadow-sm hover:shadow-md hover:shadow-lg"
                      onClick={() => handleFeatureClick(feature.path)}
                    >
                      {/* Investigation Board Pin Effect */}
                      <div className="absolute top-3 xs:top-4 sm:top-4 right-3 xs:right-4 sm:right-4 w-1.5 xs:w-2 sm:w-2 h-1.5 xs:h-2 sm:h-2 bg-red-500 rounded-full shadow-sm" />
                      
                      <CardContent className="p-4 xs:p-5 sm:p-6 md:p-6 lg:p-6 xl:p-8">
                        <div className="flex flex-col h-full">
                          {/* Icon with Professional Style */}
                          <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-6">
                            <div className={`
                              w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full flex items-center justify-center text-white mb-3 xs:mb-4 relative
                              ${feature.color === 'primary' ? 'bg-gradient-to-br from-red-500 to-red-600' : ''}
                              ${feature.color === 'secondary' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : ''}
                              ${feature.color === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : ''}
                              group-hover:shadow-lg transition-shadow duration-300
                            `}>
                              <Icon className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-9 xl:h-9" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-3 group-hover:text-red-600 transition-colors duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-sm xs:text-base sm:text-base md:text-base lg:text-base xl:text-lg text-gray-600 mb-4 xs:mb-5 sm:mb-6 md:mb-6 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center justify-between pt-3 xs:pt-4 sm:pt-4 border-t border-amber-200">
                            <Button
                              variant="ghost"
                              className="p-0 h-auto text-red-600 hover:text-red-700 hover:bg-transparent transition-all duration-300 group-hover:translate-x-2 text-sm xs:text-base sm:text-base"
                            >
                              Access Tool
                              <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 ml-1.5 xs:ml-2" />
                            </Button>
                            <Badge variant="outline" className="border-amber-300 text-amber-700 text-xs xs:text-sm sm:text-sm px-2 xs:px-3 py-1">
                              Available
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* System Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 xs:gap-6 sm:gap-6 md:gap-8 lg:gap-8 xl:gap-10"
          >
            {/* System Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="p-4 xs:p-5 sm:p-6">
                <CardTitle className="text-gray-800 flex items-center space-x-2 text-base xs:text-lg sm:text-xl">
                  <Shield className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-green-600" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 xs:p-5 sm:p-6 pt-0">
                <div className="space-y-3 xs:space-y-4 sm:space-y-4">
                  {[
                    { name: 'Face Recognition Engine', status: 'Online' },
                    { name: 'Database Connection', status: 'Online' },
                    { name: 'Sketch Builder', status: 'Online' },
                    { name: 'Backup Systems', status: 'Online' }
                  ].map((system, index) => (
                    <div key={system.name} className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm xs:text-base sm:text-base truncate pr-2">{system.name}</span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 rounded-full bg-green-500" />
                        <span className="text-green-600 text-xs xs:text-sm sm:text-sm font-medium">{system.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-3 xs:my-4 sm:my-4" />
                
                <div className="text-center">
                  <p className="text-green-600 font-semibold text-sm xs:text-base sm:text-base">All Systems Operational</p>
                  <p className="text-gray-500 text-xs xs:text-sm sm:text-sm">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="p-4 xs:p-5 sm:p-6">
                <CardTitle className="text-gray-800 flex items-center space-x-2 text-base xs:text-lg sm:text-xl">
                  <FileText className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-amber-600" />
                  <span>Quick Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 xs:p-5 sm:p-6 pt-0">
                <div className="space-y-2 xs:space-y-3 sm:space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-black-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50 transition-all duration-300 h-10 xs:h-11 sm:h-11 text-sm xs:text-base sm:text-base"
                    onClick={() => navigate('/face-recognition')}
                  >
                    <Scan className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 mr-2" />
                    Start Face Recognition
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-black-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50 transition-all duration-300 h-10 xs:h-11 sm:h-11 text-sm xs:text-base sm:text-base"
                    onClick={() => navigate('/make-sketch')}
                  >
                    <PenTool className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 mr-2" />
                    Create New Sketch
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-black-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50 transition-all duration-300 h-10 xs:h-11 sm:h-11 text-sm xs:text-base sm:text-base"
                    onClick={() => navigate('/criminal-database')}
                  >
                    <Database className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 mr-2" />
                    View Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;