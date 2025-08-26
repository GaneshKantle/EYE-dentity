import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Mail, Calendar, Shield, Edit, Save, Camera, 
  Key, Eye, EyeOff, Phone, MapPin, Briefcase
} from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.username?.split(' ')[0] || '',
    lastName: user?.username?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    department: 'Forensic Investigation',
    rank: 'Senior Officer',
    badgeNumber: 'FIC-2024-001',
    location: 'Central Station',
    bio: 'Experienced forensic investigator with expertise in facial recognition and composite sketching.',
    password: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Officer Profile</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-300 text-green-600">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "border-amber-200 text-gray-700" : "bg-red-500 hover:bg-red-600"}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-red-500 text-white text-2xl">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-0 right-0 bg-white border-amber-200"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl text-gray-800">
                  {profileData.firstName} {profileData.lastName}
                </CardTitle>
                <p className="text-gray-600">{profileData.rank}</p>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {profileData.badgeNumber}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{profileData.department}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Member since {new Date().getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <User className="w-5 h-5 text-red-500" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white border-amber-200 text-gray-800 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white border-amber-200 text-gray-800 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-white border-amber-200 text-gray-800 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-white border-amber-200 text-gray-800 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-amber-200 rounded-md bg-white text-gray-800 disabled:bg-gray-50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <Key className="w-5 h-5 text-red-500" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-gray-700">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={profileData.password}
                      onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white border-amber-200 text-gray-800 disabled:bg-gray-50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-white border-amber-200 text-gray-800 disabled:bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-end space-x-3"
              >
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-amber-200 text-gray-700 hover:border-red-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
