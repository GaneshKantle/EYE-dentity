import { useNavigate } from 'react-router-dom';
import { XCircle, Search, ArrowLeft, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

export const MatchNotFound = () => {
  const navigate = useNavigate();
  const { clearAllData } = useAppStore();

  const handleNewSearch = () => {
    clearAllData();
    navigate('/face-recognition');
  };

  const handleCreateSketch = () => {
    clearAllData();
    navigate('/make-sketch');
  };

  const handleBackToDashboard = () => {
    clearAllData();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* No Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-20 h-20 bg-warning/20 border-2 border-warning rounded-full flex items-center justify-center mb-6 animate-pulse">
            <XCircle className="w-10 h-10 text-warning" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">No Match Found</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We couldn't find a match for this image in our current database. 
            Try a different image or create a more detailed sketch.
          </p>
        </motion.div>

        {/* Suggestions Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">What would you like to do next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Try Different Image */}
            <div className="p-6 rounded-xl border border-border bg-glass/50 hover:bg-glass/80 transition-all cursor-pointer group"
                 onClick={handleNewSearch}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Try Different Image</h3>
                  <p className="text-sm text-muted-foreground">Upload a clearer or different photo</p>
                </div>
              </div>
            </div>

            {/* Create Detailed Sketch */}
            <div className="p-6 rounded-xl border border-border bg-glass/50 hover:bg-glass/80 transition-all cursor-pointer group"
                 onClick={handleCreateSketch}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <PenTool className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create Detailed Sketch</h3>
                  <p className="text-sm text-muted-foreground">Use our sketch tool for better accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="font-semibold mb-4">Tips for Better Recognition</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use high-resolution, well-lit images</li>
            <li>• Ensure the face is clearly visible and not obscured</li>
            <li>• Front-facing photos work best</li>
            <li>• Avoid heavily filtered or edited images</li>
            <li>• Create detailed sketches with accurate proportions</li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleNewSearch}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Try New Search
          </Button>
          <Button
            onClick={handleCreateSketch}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            Create Sketch
          </Button>
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchNotFound;