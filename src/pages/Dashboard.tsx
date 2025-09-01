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
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-10" />

      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Investigation Tools</h3>
              <div className="w-24 h-1 bg-red-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      className="bg-white/80 backdrop-blur-sm border-amber-200 hover:border-red-300 transition-all duration-300 cursor-pointer group-hover:scale-105 h-full shadow-sm hover:shadow-md"
                      onClick={() => handleFeatureClick(feature.path)}
                    >
                      {/* Investigation Board Pin Effect */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
                      
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          {/* Icon with Professional Style */}
                          <div className="mb-6">
                            <div className={`
                              w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 relative
                              ${feature.color === 'primary' ? 'bg-gradient-to-br from-red-500 to-red-600' : ''}
                              ${feature.color === 'secondary' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : ''}
                              ${feature.color === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : ''}
                              group-hover:shadow-lg transition-shadow
                            `}>
                              <Icon className="w-8 h-8" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center justify-between pt-4 border-t border-amber-200">
                            <Button
                              variant="ghost"
                              className="p-0 h-auto text-red-600 hover:text-red-700 hover:bg-transparent transition-colors group-hover:translate-x-2"
                            >
                              Access Tool
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Badge variant="outline" className="border-amber-300 text-amber-700">
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* System Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Face Recognition Engine', status: 'Online' },
                    { name: 'Database Connection', status: 'Online' },
                    { name: 'Sketch Builder', status: 'Online' },
                    { name: 'Backup Systems', status: 'Online' }
                  ].map((system, index) => (
                    <div key={system.name} className="flex items-center justify-between">
                      <span className="text-gray-700">{system.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-green-600 text-sm font-medium">{system.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center">
                  <p className="text-green-600 font-semibold">All Systems Operational</p>
                  <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>Quick Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-black-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50"
                    onClick={() => navigate('/face-recognition')}
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Start Face Recognition
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-black-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50"
                    onClick={() => navigate('/make-sketch')}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Create New Sketch
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-black-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50"
                    onClick={() => navigate('/criminal-database')}
                  >
                    <Database className="w-4 h-4 mr-2" />
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