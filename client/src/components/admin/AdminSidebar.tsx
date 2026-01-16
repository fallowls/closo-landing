import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  Users,
  FileText,
  BarChart3,
  Settings,
  History,
  UserCheck,
  Database,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  Download,
  Upload,
  Search,
  Eye,
  Lock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PenSquare,
  Tags,
  FolderOpen,
  LineChart
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import closoLogo from "@assets/closo_logo_1768558290200.png";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navSections: NavSection[] = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          description: "Main overview"
        },
        {
          title: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
          description: "Charts and metrics"
        }
      ]
    },
    {
      title: "Content Management",
      items: [
        {
          title: "Blog Dashboard",
          href: "/admin/blog",
          icon: FileText,
          description: "Blog overview"
        },
        {
          title: "New Post",
          href: "/admin/blog/posts/new",
          icon: PenSquare,
          description: "Create new post"
        },
        {
          title: "Categories & Tags",
          href: "/admin/blog/categories",
          icon: Tags,
          description: "Manage taxonomy"
        },
        {
          title: "Blog Analytics",
          href: "/admin/blog/analytics",
          icon: LineChart,
          description: "Content performance"
        }
      ]
    },
    {
      title: "User Monitoring",
      items: [
        {
          title: "Activity Logs",
          href: "/admin/activity-logs",
          icon: Activity,
          description: "All user actions"
        },
        {
          title: "Active Sessions",
          href: "/admin/sessions",
          icon: UserCheck,
          description: "Live user sessions"
        },
        {
          title: "Login History",
          href: "/admin/login-history",
          icon: Clock,
          description: "Authentication logs"
        },
        {
          title: "User Management",
          href: "/admin/users",
          icon: Users,
          description: "Manage users"
        }
      ]
    },
    {
      title: "Communication",
      items: [
        {
          title: "User Chats",
          href: "/admin/users",
          icon: MessageSquare,
          description: "Chat with users"
        }
      ]
    },
    {
      title: "Campaign Tracking",
      items: [
        {
          title: "Campaign Views",
          href: "/admin/campaign-views",
          icon: Eye,
          description: "Campaign access logs"
        },
        {
          title: "Contact Interactions",
          href: "/admin/contact-interactions",
          icon: MessageSquare,
          description: "Contact activity"
        },
        {
          title: "Call Logs",
          href: "/admin/call-logs",
          icon: Phone,
          description: "All call records"
        },
        {
          title: "Email Tracking",
          href: "/admin/email-tracking",
          icon: Mail,
          description: "Email activity"
        }
      ]
    },
    {
      title: "Data & Files",
      items: [
        {
          title: "Upload History",
          href: "/admin/upload-history",
          icon: Upload,
          description: "File uploads"
        },
        {
          title: "Download Logs",
          href: "/admin/download-logs",
          icon: Download,
          description: "Export activity"
        },
        {
          title: "Database Stats",
          href: "/admin/database-stats",
          icon: Database,
          description: "Database metrics"
        }
      ]
    },
    {
      title: "Search & Performance",
      items: [
        {
          title: "Search Queries",
          href: "/admin/search-queries",
          icon: Search,
          description: "User searches"
        },
        {
          title: "Performance",
          href: "/admin/performance",
          icon: TrendingUp,
          description: "System performance"
        },
        {
          title: "API Usage",
          href: "/admin/api-usage",
          icon: Globe,
          description: "API statistics"
        }
      ]
    },
    {
      title: "Security",
      items: [
        {
          title: "Security Logs",
          href: "/admin/security-logs",
          icon: Shield,
          description: "Security events"
        },
        {
          title: "Failed Logins",
          href: "/admin/failed-logins",
          icon: Lock,
          description: "Authentication failures"
        },
        {
          title: "Alerts",
          href: "/admin/alerts",
          icon: AlertCircle,
          badge: "3",
          description: "System alerts"
        }
      ]
    },
    {
      title: "System",
      items: [
        {
          title: "Audit Trail",
          href: "/admin/audit-trail",
          icon: History,
          description: "Complete audit log"
        },
        {
          title: "Settings",
          href: "/admin/settings",
          icon: Settings,
          description: "System settings"
        }
      ]
    }
  ];

  return (
    <div
      className={cn(
        "relative border-r border-slate-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src={closoLogo} alt="Closo" className="h-8 w-auto object-contain" />
              <span className="font-bold text-slate-900">Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {navSections.map((section, sectionIdx) => (
              <div key={section.title}>
                {sectionIdx > 0 && <Separator className="mb-4" />}
                {!collapsed && (
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    
                    return (
                      <Link key={item.href} href={item.href}>
                        <a
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-purple-50 text-purple-700"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          )}
                          title={collapsed ? item.title : undefined}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
