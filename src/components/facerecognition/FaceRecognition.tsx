import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Scan, Loader2, Image, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { faceAPI } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent } from '@/components/ui/card';
// Icon is now served from public directory

export const FaceRecognition = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isRecognizing, setRecognizing, setRecognitionResult } = useAppStore();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process the image';
      toast({
        variant: 'destructive',
        title: 'Recognition failed',
        description: errorMessage,
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/icon.png" 
                alt="EYE'dentify Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Face Recognition</h1>
          <p className="text-xl text-gray-600">
            Upload a sketch or photo to find matches in our database
          </p>
        </motion.div>

        {/* Don't have an image? Create one! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-red-50 to-amber-50 border-red-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Don't have an Sketch?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a detailed forensic sketch using our advanced face builder tool.
                </p>
                <Button
                  onClick={() => navigate('/make-sketch')}
                  className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Create Forensic Sketch
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {!previewUrl ? (
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardContent className="p-12">
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                    transition-all duration-300
                    ${isDragActive 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-amber-300 hover:border-red-400 hover:bg-amber-50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    {isDragActive ? 'Drop the image here' : 'Upload Image'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop an image here, or click to select a file
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-amber-100 rounded-full border border-amber-200">JPG</span>
                    <span className="px-3 py-1 bg-amber-100 rounded-full border border-amber-200">PNG</span>
                    <span className="px-3 py-1 bg-amber-100 rounded-full border border-amber-200">BMP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-8">
                  {/* Image Preview */}
                  <div className="flex-1">
                    <div className="relative rounded-xl overflow-hidden bg-white border border-amber-200">
                      <img
                        src={previewUrl}
                        alt="Uploaded preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {uploadedFile?.name} • {Math.round((uploadedFile?.size || 0) / 1024)} KB
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <Button
                      onClick={handleRecognition}
                      disabled={isRecognizing}
                      className="bg-red-500 hover:bg-red-600 text-white"
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
                      className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600"
                    >
                      Clear Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-800">Recognition Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use clear, well-lit images for best results</li>
                      <li>• Face should be clearly visible and not obscured</li>
                      <li>• Supported formats: JPG, PNG, BMP</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaceRecognition;