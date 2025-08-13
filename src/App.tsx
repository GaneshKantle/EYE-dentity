import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FaceRecognition from "./pages/FaceRecognition";
import MatchFound from "./pages/MatchFound";
import MatchNotFound from "./pages/MatchNotFound";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
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
            
            {/* TODO: Add remaining protected routes */}
            {/* <Route path="/make-sketch" element={<ProtectedRoute><MakeSketch /></ProtectedRoute>} /> */}
            {/* <Route path="/criminal-database" element={<ProtectedRoute><CriminalDatabase /></ProtectedRoute>} /> */}
            {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
            {/* <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
