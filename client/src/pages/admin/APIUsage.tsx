import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, Activity, Zap, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from "date-fns";

interface APIRequest {
  id: number;
  endpoint: string;
  method: string;
  userId: string;
  statusCode: number;
  responseTime: number;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

interface APIStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  requestsByEndpoint: Array<{
    endpoint: string;
    count: number;
  }>;
  requestsOverTime: Array<{
    time: string;
    requests: number;
    errors: number;
  }>;
  recentRequests: APIRequest[];
}

export default function APIUsage() {
  const [stats, setStats] = useState<APIStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAPIUsage = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/api-usage', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch API usage');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching API usage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIUsage();
    const interval = setInterval(fetchAPIUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </AdminLayout>
    );
  }

  const filteredRequests = stats.recentRequests.filter(req => {
    return searchQuery === "" || 
      req.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.method.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge className="bg-green-100 text-green-700 border-green-200">{statusCode}</Badge>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">{statusCode}</Badge>;
    } else if (statusCode >= 500) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">{statusCode}</Badge>;
    }
    return <Badge variant="secondary">{statusCode}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-100 text-blue-700 border-blue-200',
      POST: 'bg-green-100 text-green-700 border-green-200',
      PUT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',
      PATCH: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return <Badge className={colors[method] || ''}>{method}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">API Usage</h1>
            <p className="text-slate-600 mt-2">Monitor API requests, response times, and rate limits</p>
          </div>
          <Button onClick={fetchAPIUsage} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Total Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalRequests.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.successfulRequests.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.failedRequests.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Avg Response Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.avgResponseTime}ms</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Requests Over Time</CardTitle>
              <CardDescription>API traffic and error rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.requestsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests" />
                  <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} name="Errors" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Endpoints</CardTitle>
              <CardDescription>Most frequently accessed API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.requestsByEndpoint}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="endpoint" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent API Requests</CardTitle>
                <CardDescription>Latest API calls with response details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by endpoint, user, or method..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="border">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              {getMethodBadge(request.method)}
                              <span className="font-mono text-sm text-slate-900">{request.endpoint}</span>
                              {getStatusBadge(request.statusCode)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600">
                              <div>User: {request.userId}</div>
                              <div>Response: {request.responseTime}ms</div>
                              <div>IP: {request.ipAddress}</div>
                              <div>{formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
