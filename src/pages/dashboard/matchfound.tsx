import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
// Placeholder image is now served from public directory

export const MatchFound = () => {
  const navigate = useNavigate();
  const { recognitionResult, clearAllData } = useAppStore();

  const handleNewSearch = () => {
    clearAllData();
    navigate('/face-recognition');
  };

  const handleBackToDashboard = () => {
    clearAllData();
    navigate('/dashboard');
  };

  // Mock data if no actual result
  const matchData = recognitionResult || {
    confidence: 94.5,
    match: {
      id: 'CR001',
      name: 'John Doe',
      age: 32,
      description: 'Suspected in multiple fraud cases',
      location: 'New York, NY',
      image: "/placeholder-criminal.jpg",
      criminalRecord: {
        charges: ['Fraud', 'Identity Theft'],
        lastSeen: '2024-01-15',
        status: 'Wanted'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Match Found!</h1>
          <p className="text-xl text-gray-600">
            We found a {matchData.confidence}% match in our database
          </p>
        </motion.div>

        {/* Match Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-8 mb-8 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photo Section */}
            <div className="text-center">
              <div className="relative">
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-2xl overflow-hidden mb-4 border border-amber-200">
                  {matchData.match?.image ? (
                    <img
                      src={matchData.match.image}
                      alt={`${matchData.match.name} photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {matchData.confidence}% Match
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{matchData.match?.name || 'Unknown'}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium text-gray-800">{matchData.match?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium text-gray-800">{matchData.match?.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-800">{matchData.match?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      matchData.match?.criminalRecord?.status === 'Wanted' 
                        ? 'bg-red-100 text-red-600 border border-red-200' 
                        : 'bg-amber-100 text-amber-600 border border-amber-200'
                    }`}>
                      {matchData.match?.criminalRecord?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Criminal Record */}
              {matchData.match?.criminalRecord && (
                <div className="border-t border-amber-200 pt-4">
                  <h4 className="font-semibold mb-3 text-gray-800">Criminal Record</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Charges:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {matchData.match.criminalRecord.charges?.map((charge, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full border border-red-200"
                          >
                            {charge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Seen:</span>
                      <span className="text-gray-800">{matchData.match.criminalRecord.lastSeen}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {matchData.match?.description && (
            <div className="mt-8 pt-8 border-t border-amber-200">
              <h4 className="font-semibold mb-3 text-gray-800">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {matchData.match.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleNewSearch}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <Search className="w-4 h-4" />
            New Search
          </Button>
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="flex items-center gap-2 border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-amber-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchFound;