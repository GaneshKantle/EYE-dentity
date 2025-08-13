import { useNavigate } from 'react-router-dom';
import { Scan, PenTool, Database, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 animate-glow">
            Welcome back, {user?.username}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced forensic face recognition and sketch creation tools at your fingertips
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div
                  className="feature-card cursor-pointer group-hover:scale-105 h-full"
                  onClick={() => handleFeatureClick(feature.path)}
                >
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4
                        ${feature.color === 'primary' ? 'bg-gradient-primary' : ''}
                        ${feature.color === 'secondary' ? 'bg-secondary' : ''}
                        ${feature.color === 'success' ? 'bg-success' : ''}
                        group-hover:animate-float
                      `}>
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="p-0 h-auto text-primary hover:text-primary-glow transition-colors group-hover:translate-x-2"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 glass-card p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">99.2%</div>
              <div className="text-muted-foreground">Recognition Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-muted-foreground">Database Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">&lt;2s</div>
              <div className="text-muted-foreground">Average Processing Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;