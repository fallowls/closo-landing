import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, CheckCircle2, XCircle, AlertTriangle, Calendar, MapPin, User } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface LoginAttempt {
  id: number;
  userId: string;
  userRole: string | null;
  ipAddress: string;
  userAgent: string;
  device: string;
  browser: string;
  location: string;
  status: 'success' | 'failed' | 'blocked';
  failureReason: string | null;
  timestamp: string;
}

export default function LoginHistory() {
  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchLoginHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/login-history', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch login history');
      
      const data = await response.json();
      setLoginHistory(data);
    } catch (error) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
    const interval = setInterval(fetchLoginHistory, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredHistory = loginHistory.filter(attempt => {
    const matchesSearch = searchQuery === "" || 
      attempt.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attempt.ipAddress.includes(searchQuery) ||
      attempt.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || attempt.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const successCount = loginHistory.filter(a => a.status === 'success').length;
  const failedCount = loginHistory.filter(a => a.status === 'failed').length;
  const blockedCount = loginHistory.filter(a => a.status === 'blocked').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Failed</Badge>;
      case 'blocked':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Blocked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Login History</h1>
          <p className="text-slate-600 mt-2">Track all authentication attempts and login events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{loginHistory.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{successCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{failedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{blockedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Authentication Log</CardTitle>
                <CardDescription>Complete history of all login attempts and events</CardDescription>
              </div>
              <Button onClick={fetchLoginHistory} variant="outline" size="sm" disabled={loading}>
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
                    placeholder="Search by user, IP, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "success" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("success")}
                  >
                    Success
                  </Button>
                  <Button
                    variant={filterStatus === "failed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("failed")}
                  >
                    Failed
                  </Button>
                  <Button
                    variant={filterStatus === "blocked" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("blocked")}
                  >
                    Blocked
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No login attempts found
                    </div>
                  ) : (
                    filteredHistory.map((attempt) => (
                      <Card key={attempt.id} className="border-l-4" style={{
                        borderLeftColor: 
                          attempt.status === 'success' ? '#10b981' : 
                          attempt.status === 'failed' ? '#ef4444' : '#f97316'
                      }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(attempt.status)}
                                <span className="font-semibold text-slate-900">{attempt.userId}</span>
                                {attempt.userRole && (
                                  <Badge variant={attempt.userRole === 'admin' ? 'default' : 'secondary'}>
                                    {attempt.userRole}
                                  </Badge>
                                )}
                                {getStatusBadge(attempt.status)}
                              </div>

                              {attempt.failureReason && (
                                <div className="text-sm text-red-600 font-medium">
                                  Reason: {attempt.failureReason}
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{attempt.ipAddress} • {attempt.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <User className="h-4 w-4" />
                                  <span>{attempt.device} • {attempt.browser}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(attempt.timestamp), 'PPpp')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDistanceToNow(new Date(attempt.timestamp), { addSuffix: true })}</span>
                                </div>
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
