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
      <div className="max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <div className="flex items-center justify-center space-x-2 xs:space-x-3 sm:space-x-3 mb-4 xs:mb-6 sm:mb-6">
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16 flex items-center justify-center">
              <img 
                src="/icon.png" 
                alt="EYE'dentify Logo" 
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-3 xs:mb-4 sm:mb-4">
            Face Recognition
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-2xl mx-auto">
            Upload a sketch or photo to find matches in our database
          </p>
        </motion.div>

        {/* Don't have an image? Create one! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 xs:mb-8 sm:mb-8 md:mb-10"
        >
          <Card className="bg-gradient-to-r from-red-50 to-amber-50 border-red-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 xs:p-5 sm:p-6 md:p-8 text-center">
              <div className="max-w-sm xs:max-w-md sm:max-w-lg mx-auto">
                <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12 bg-gradient-to-br from-red-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-3">
                  <Image className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 text-red-500" />
                </div>
                <h3 className="text-base xs:text-lg sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 xs:mb-2 sm:mb-2">
                  Don't have an Sketch?
                </h3>
                <p className="text-xs xs:text-sm sm:text-sm md:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4">
                  Create a detailed forensic sketch using our advanced face builder tool.
                </p>
                <Button
                  onClick={() => navigate('/make-sketch')}
                  className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white px-4 xs:px-6 sm:px-6 py-2 xs:py-2.5 sm:py-2.5 text-xs xs:text-sm sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Image className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 mr-1.5 xs:mr-2" />
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
          className="space-y-6 xs:space-y-8 sm:space-y-8 md:space-y-10"
        >
          {!previewUrl ? (
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6 xs:p-8 sm:p-10 md:p-12 lg:p-14">
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl xs:rounded-2xl p-6 xs:p-8 sm:p-10 md:p-12 text-center cursor-pointer
                    transition-all duration-300
                    ${isDragActive 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-amber-300 hover:border-red-400 hover:bg-amber-50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 text-gray-400 mx-auto mb-4 xs:mb-6 sm:mb-6" />
                  <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold mb-3 xs:mb-4 sm:mb-4 text-gray-800">
                    {isDragActive ? 'Drop the image here' : 'Upload Image'}
                  </h3>
                  <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-4 xs:mb-6 sm:mb-6">
                    Drag and drop an image here, or click to select a file
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 xs:gap-2 sm:gap-2 text-xs xs:text-sm sm:text-sm text-gray-500">
                    <span className="px-2 xs:px-3 sm:px-3 py-1 xs:py-1 sm:py-1 bg-amber-100 rounded-full border border-amber-200">JPG</span>
                    <span className="px-2 xs:px-3 sm:px-3 py-1 xs:py-1 sm:py-1 bg-amber-100 rounded-full border border-amber-200">PNG</span>
                    <span className="px-2 xs:px-3 sm:px-3 py-1 xs:py-1 sm:py-1 bg-amber-100 rounded-full border border-amber-200">BMP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="flex flex-col xs:flex-col sm:flex-row items-start gap-4 xs:gap-6 sm:gap-8 md:gap-8 lg:gap-10">
                  {/* Image Preview */}
                  <div className="flex-1 w-full xs:w-full sm:w-auto">
                    <div className="relative rounded-lg xs:rounded-xl overflow-hidden bg-white border border-amber-200">
                      <img
                        src={previewUrl}
                        alt="Uploaded preview"
                        className="w-full h-auto max-h-64 xs:max-h-80 sm:max-h-96 md:max-h-[28rem] lg:max-h-[32rem] object-contain"
                      />
                    </div>
                    <div className="mt-3 xs:mt-4 sm:mt-4 text-center">
                      <p className="text-xs xs:text-sm sm:text-sm text-gray-600 truncate">
                        {uploadedFile?.name} • {Math.round((uploadedFile?.size || 0) / 1024)} KB
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col xs:flex-row sm:flex-col gap-3 xs:gap-4 sm:gap-4 w-full xs:w-full sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px]">
                    <Button
                      onClick={handleRecognition}
                      disabled={isRecognizing}
                      className="bg-red-500 hover:bg-red-600 text-white h-10 xs:h-11 sm:h-11 text-sm xs:text-base sm:text-base transition-all duration-300"
                    >
                      {isRecognizing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 mr-1.5 xs:mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 mr-1.5 xs:mr-2" />
                          Start Recognition
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={clearUpload}
                      variant="outline"
                      disabled={isRecognizing}
                      className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600 h-10 xs:h-11 sm:h-11 text-sm xs:text-base sm:text-base transition-all duration-300"
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
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4 xs:p-5 sm:p-6 md:p-8">
                <div className="flex items-start gap-3 xs:gap-4 sm:gap-4">
                  <AlertCircle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5 xs:mt-1 sm:mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 xs:mb-2 sm:mb-2 text-gray-800 text-sm xs:text-base sm:text-lg">Recognition Tips</h4>
                    <ul className="text-xs xs:text-sm sm:text-sm text-gray-600 space-y-1 xs:space-y-1 sm:space-y-1">
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