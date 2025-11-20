import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, User, Clock, MapPin, Monitor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserSession {
  id: string;
  userId: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sessions', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchQuery === "" || 
      session.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ipAddress.includes(searchQuery);
    
    const matchesRole = filterRole === "all" || session.userRole === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const activeSessionsCount = sessions.filter(s => s.isActive).length;
  const adminSessionsCount = sessions.filter(s => s.userRole === 'admin').length;
  const userSessionsCount = sessions.filter(s => s.userRole === 'user').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Session Monitoring</h1>
          <p className="text-slate-600 mt-2">Monitor active user sessions and authentication states</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{sessions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeSessionsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Admin Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{adminSessionsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{userSessionsCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Real-time view of all authenticated user sessions</CardDescription>
              </div>
              <Button onClick={fetchSessions} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by user ID or IP address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterRole === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterRole === "admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("admin")}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={filterRole === "user" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("user")}
                  >
                    Users
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : filteredSessions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No sessions found
                    </div>
                  ) : (
                    filteredSessions.map((session) => (
                      <Card key={session.id} className="border-l-4" style={{
                        borderLeftColor: session.isActive ? '#10b981' : '#94a3b8'
                      }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-slate-400" />
                                <span className="font-semibold text-slate-900">{session.userId}</span>
                                <Badge variant={session.userRole === 'admin' ? 'default' : 'secondary'}>
                                  {session.userRole}
                                </Badge>
                                {session.isActive && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Active
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{session.ipAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Monitor className="h-4 w-4" />
                                  <span>{session.device} • {session.browser}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span>Last activity: {formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span>Created: {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
                                </div>
                              </div>

                              <div className="text-xs text-slate-500">
                                Session ID: {session.id}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
