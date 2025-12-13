import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MedicinesPage from "./pages/dashboard/MedicinesPage";
import BillingPage from "./pages/dashboard/BillingPage";
import AlertsPage from "./pages/dashboard/AlertsPage";
import SalesPage from "./pages/admin/SalesPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
