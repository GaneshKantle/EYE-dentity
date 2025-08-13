import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Scan, Loader2, Image, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { faceAPI } from '@/services/api';
import { useAppStore } from '@/store/appStore';

export const FaceRecognition = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isRecognizing, setRecognizing, setRecognitionResult } = useAppStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp'],
    },
    multiple: false,
  });

  const handleRecognition = async () => {
    if (!uploadedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image first.',
      });
      return;
    }

    setRecognizing(true);
    try {
      const result = await faceAPI.recognize(uploadedFile);
      setRecognitionResult(result);
      
      if (result.match) {
        navigate('/match-found');
      } else {
        navigate('/match-not-found');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Recognition failed',
        description: error.response?.data?.message || 'Failed to process the image',
      });
    } finally {
      setRecognizing(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-float">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Face Recognition</h1>
          <p className="text-xl text-muted-foreground">
            Upload a sketch or photo to find matches in our database
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {!previewUrl ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300 glass-card
                ${isDragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary hover:bg-primary/5'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">
                {isDragActive ? 'Drop the image here' : 'Upload Image'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop an image here, or click to select a file
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 bg-muted rounded-full">JPG</span>
                <span className="px-3 py-1 bg-muted rounded-full">PNG</span>
                <span className="px-3 py-1 bg-muted rounded-full">BMP</span>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8">
              <div className="flex items-start gap-8">
                {/* Image Preview */}
                <div className="flex-1">
                  <div className="relative rounded-xl overflow-hidden bg-muted">
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {uploadedFile?.name} • {Math.round((uploadedFile?.size || 0) / 1024)} KB
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 min-w-[200px]">
                  <Button
                    onClick={handleRecognition}
                    disabled={isRecognizing}
                    className="btn-primary"
                  >
                    {isRecognizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Start Recognition
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearUpload}
                    variant="outline"
                    disabled={isRecognizing}
                    className="btn-ghost"
                  >
                    Clear Upload
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Recognition Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use clear, well-lit images for best results</li>
                  <li>• Face should be clearly visible and not obscured</li>
                  <li>• Supported formats: JPG, PNG, BMP</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaceRecognition;