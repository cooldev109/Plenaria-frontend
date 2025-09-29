import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AdminRoute, LawyerRoute, CustomerRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/admin/AdminLayout";
import LawyerLayout from "./components/lawyer/LawyerLayout";
import CustomerLayout from "./components/customer/CustomerLayout";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import HomeRedirect from "./components/HomeRedirect";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminContent from "./pages/admin/AdminContent";
import LawyerDashboard from "./pages/lawyer/LawyerDashboard";
import LawyerConsultations from "./pages/lawyer/LawyerConsultations";
import LawyerDrafts from "./pages/lawyer/LawyerDrafts";
import LawyerProjects from "./pages/lawyer/LawyerProjects";
import LawyerCourses from "./pages/lawyer/LawyerCourses";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProjects from "./pages/customer/CustomerProjects";
import CustomerConsultations from "./pages/customer/CustomerConsultations";
import CustomerCourses from "./pages/customer/CustomerCourses";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerSettings from "./pages/customer/CustomerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Navbar />
            <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/plans" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminPlans />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/content" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminContent />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Lawyer Routes */}
            <Route path="/lawyer" element={
              <LawyerRoute>
                <LawyerLayout>
                  <LawyerDashboard />
                </LawyerLayout>
              </LawyerRoute>
            } />
            <Route path="/lawyer/dashboard" element={
              <LawyerRoute>
                <LawyerLayout>
                  <LawyerDashboard />
                </LawyerLayout>
              </LawyerRoute>
            } />
            <Route path="/lawyer/consultations" element={
              <LawyerRoute>
                <LawyerLayout>
                  <LawyerConsultations />
                </LawyerLayout>
              </LawyerRoute>
            } />
            <Route path="/lawyer/drafts" element={
              <LawyerRoute>
                <LawyerLayout>
                  <LawyerDrafts />
                </LawyerLayout>
              </LawyerRoute>
            } />
            <Route path="/lawyer/projects" element={
              <LawyerRoute>
                <LawyerLayout>
                  <LawyerProjects />
                </LawyerLayout>
              </LawyerRoute>
            } />
            <Route path="/lawyer/courses" element={
              <LawyerRoute>
                <LawyerLayout>
                  <LawyerCourses />
                </LawyerLayout>
              </LawyerRoute>
            } />
            
            {/* Customer Routes */}
            <Route path="/customer" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerDashboard />
                </CustomerLayout>
              </CustomerRoute>
            } />
            <Route path="/customer/dashboard" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerDashboard />
                </CustomerLayout>
              </CustomerRoute>
            } />
            <Route path="/customer/projects" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerProjects />
                </CustomerLayout>
              </CustomerRoute>
            } />
            <Route path="/customer/consultations" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerConsultations />
                </CustomerLayout>
              </CustomerRoute>
            } />
            <Route path="/customer/courses" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerCourses />
                </CustomerLayout>
              </CustomerRoute>
            } />
            <Route path="/customer/profile" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerProfile />
                </CustomerLayout>
              </CustomerRoute>
            } />
            <Route path="/customer/settings" element={
              <CustomerRoute>
                <CustomerLayout>
                  <CustomerSettings />
                </CustomerLayout>
              </CustomerRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
