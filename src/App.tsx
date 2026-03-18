import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MediBot from "@/components/MediBot";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load all pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Features = lazy(() => import("./pages/Features"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const MedicinesPage = lazy(() => import("./pages/dashboard/MedicinesPage"));
const BillingPage = lazy(() => import("./pages/dashboard/BillingPage"));
const AlertsPage = lazy(() => import("./pages/dashboard/AlertsPage"));
const NotificationSettingsPage = lazy(() => import("./pages/dashboard/NotificationSettingsPage"));
const SalesPage = lazy(() => import("./pages/admin/SalesPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min cache
      gcTime: 10 * 60 * 1000, // 10 min garbage collection
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MediBot />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/admin-login" element={<AdminAuth />} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><UserDashboard /></ProtectedRoute>
              } />
              <Route path="/dashboard/medicines" element={
                <ProtectedRoute><MedicinesPage /></ProtectedRoute>
              } />
              <Route path="/dashboard/billing" element={
                <ProtectedRoute><BillingPage /></ProtectedRoute>
              } />
              <Route path="/dashboard/alerts" element={
                <ProtectedRoute><AlertsPage /></ProtectedRoute>
              } />
              <Route path="/dashboard/notifications" element={
                <ProtectedRoute><NotificationSettingsPage /></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/medicines" element={
                <ProtectedRoute requireAdmin><MedicinesPage /></ProtectedRoute>
              } />
              <Route path="/admin/sales" element={
                <ProtectedRoute requireAdmin><SalesPage /></ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requireAdmin><ReportsPage /></ProtectedRoute>
              } />
              <Route path="/admin/audit-logs" element={
                <ProtectedRoute requireAdmin><AuditLogsPage /></ProtectedRoute>
              } />
              <Route path="/admin/alerts" element={
                <ProtectedRoute requireAdmin><AlertsPage /></ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
