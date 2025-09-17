import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Layout, useLayout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/dashboard/login";
import Register from "@/pages/dashboard/register";
import Dashboard from "@/pages/Dashboard";
import FaceRecognition from "@/components/facerecognition/FaceRecognition";
import FaceSketch from "@/pages/FaceSketch";
import CriminalDatabase from "@/components/criminaldb/CriminalDatabase";
import MatchFound from "@/pages/dashboard/matchfound";
import MatchNotFound from "@/pages/dashboard/matchnotfound";
import Profile from "@/pages/dashboard/profile";
import Settings from "@/pages/dashboard/settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// MainContent component that adjusts based on sidebar state
const MainContent = () => {
  const { isSidebarOpen } = useLayout();
  
  return (
    <div 
      className={`transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-70' : ''
      }`}
    >
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/face-recognition" element={
          <ProtectedRoute>
            <FaceRecognition />
          </ProtectedRoute>
        } />
        <Route path="/make-sketch" element={
          <ProtectedRoute>
            <FaceSketch />
          </ProtectedRoute>
        } />
        <Route path="/criminal-database" element={
          <ProtectedRoute>
            <CriminalDatabase />
          </ProtectedRoute>
        } />
        
        <Route path="/match-found" element={
          <ProtectedRoute>
            <MatchFound />
          </ProtectedRoute>
        } />
        <Route path="/match-not-found" element={
          <ProtectedRoute>
            <MatchNotFound />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Navbar />
          <MainContent />
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
