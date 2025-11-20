import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BotpressChatbot } from "@/components/BotpressChatbot";
import { isAuthenticated } from "@/lib/auth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ActivityLogs from "@/pages/admin/ActivityLogs";
import Sessions from "@/pages/admin/Sessions";
import LoginHistory from "@/pages/admin/LoginHistory";
import CampaignAnalytics from "@/pages/admin/CampaignAnalytics";
import ContactTracking from "@/pages/admin/ContactTracking";
import SystemLogs from "@/pages/admin/SystemLogs";
import APIUsage from "@/pages/admin/APIUsage";
import SecurityEvents from "@/pages/admin/SecurityEvents";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";
import UserChat from "@/pages/admin/UserChat";
import CampaignView from "@/pages/campaign-view";
import BackupImport from "@/pages/BackupImport";
import DemoBooking from "@/pages/demo-booking";
import AboutUs from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Security from "@/pages/security";
import Compliance from "@/pages/compliance";
import ApiDocs from "@/pages/api-docs";
import Features from "@/pages/features";
import TwilioSetup from "@/pages/twilio-setup";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import NotFound from "@/pages/not-found";
import NLQueryInterface from "@/components/NLQueryInterface";
import AdvancedSearch from "@/pages/advanced-search";
import ContactsFilter from "@/pages/contacts-filter";

// Protected Route component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  
  if (!isAuthenticated()) {
    setLocation("/");
    return null;
  }
  
  return <Component />;
}

// Admin Route component - requires admin role
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated()) {
        setLocation("/");
        return;
      }

      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setLocation("/dashboard");
        }
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setLocation("/");
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [setLocation]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={AboutUs} />
      <Route path="/demo" component={DemoBooking} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/security" component={Security} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/features" component={Features} />
      <Route path="/twilio-setup" component={TwilioSetup} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/admin">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/activity-logs">
        <AdminRoute component={ActivityLogs} />
      </Route>
      <Route path="/admin/sessions">
        <AdminRoute component={Sessions} />
      </Route>
      <Route path="/admin/login-history">
        <AdminRoute component={LoginHistory} />
      </Route>
      <Route path="/admin/campaign-analytics">
        <AdminRoute component={CampaignAnalytics} />
      </Route>
      <Route path="/admin/contact-tracking">
        <AdminRoute component={ContactTracking} />
      </Route>
      <Route path="/admin/system-logs">
        <AdminRoute component={SystemLogs} />
      </Route>
      <Route path="/admin/api-usage">
        <AdminRoute component={APIUsage} />
      </Route>
      <Route path="/admin/security-events">
        <AdminRoute component={SecurityEvents} />
      </Route>
      <Route path="/admin/settings">
        <AdminRoute component={Settings} />
      </Route>
      <Route path="/admin/users">
        <AdminRoute component={Users} />
      </Route>
      <Route path="/admin/users/:userId/chat">
        <AdminRoute component={UserChat} />
      </Route>
      <Route path="/campaign/:id">
        <ProtectedRoute component={CampaignView} />
      </Route>
      <Route path="/backup-import">
        <ProtectedRoute component={BackupImport} />
      </Route>
      <Route path="/nl-query">
        <ProtectedRoute component={NLQueryInterface} />
      </Route>
      <Route path="/advanced-search">
        <ProtectedRoute component={AdvancedSearch} />
      </Route>
      <Route path="/contacts-filter">
        <ProtectedRoute component={ContactsFilter} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BotpressChatbot />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
