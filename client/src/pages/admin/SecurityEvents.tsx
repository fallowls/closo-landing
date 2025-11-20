import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, Shield, AlertTriangle, XCircle, AlertCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface SecurityEvent {
  id: number;
  eventType: 'brute_force' | 'suspicious_activity' | 'unauthorized_access' | 'data_breach' | 'malware' | 'policy_violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  userId: string | null;
  ipAddress: string;
  location: string;
  action: string;
  status: 'active' | 'resolved' | 'investigating';
  details: Record<string, any>;
  timestamp: string;
}

export default function SecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/security-events', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch security events');
      
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching security events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
    const interval = setInterval(fetchSecurityEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ipAddress.includes(searchQuery) ||
      (event.userId && event.userId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSeverity = filterSeverity === "all" || event.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = events.filter(e => e.severity === 'critical').length;
  const highCount = events.filter(e => e.severity === 'high').length;
  const activeCount = events.filter(e => e.status === 'active').length;
  const resolvedCount = events.filter(e => e.status === 'resolved').length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Active</Badge>;
      case 'investigating':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Security Events</h1>
          <p className="text-slate-600 mt-2">Monitor security alerts and suspicious activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{events.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Critical</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm font-medium text-slate-600">High Severity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{highCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{activeCount}</div>
              <p className="text-sm text-green-600 mt-1">{resolvedCount} resolved</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>Real-time security events and threat detection</CardDescription>
              </div>
              <Button onClick={fetchSecurityEvents} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by description, IP, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterSeverity === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterSeverity("all")}
                  >
                    All Severity
                  </Button>
                  <Button
                    variant={filterSeverity === "critical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterSeverity("critical")}
                  >
                    Critical
                  </Button>
                  <Button
                    variant={filterSeverity === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterSeverity("high")}
                  >
                    High
                  </Button>
                  <Button
                    variant={filterSeverity === "medium" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterSeverity("medium")}
                  >
                    Medium
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Status
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === "investigating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("investigating")}
                  >
                    Investigating
                  </Button>
                  <Button
                    variant={filterStatus === "resolved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("resolved")}
                  >
                    Resolved
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No security events found
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <Card key={event.id} className="border-l-4" style={{
                        borderLeftColor: 
                          event.severity === 'critical' ? '#ef4444' :
                          event.severity === 'high' ? '#f97316' :
                          event.severity === 'medium' ? '#f59e0b' : '#3b82f6'
                      }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                {getSeverityIcon(event.severity)}
                                {getSeverityBadge(event.severity)}
                                {getStatusBadge(event.status)}
                                <Badge variant="outline">{event.eventType.replace('_', ' ')}</Badge>
                              </div>

                              <div className="text-sm font-medium text-slate-900">
                                {event.description}
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                {event.userId && <div>User: {event.userId}</div>}
                                <div>IP: {event.ipAddress}</div>
                                <div>Location: {event.location}</div>
                                <div>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</div>
                              </div>

                              {event.action && (
                                <div className="text-sm bg-slate-50 p-3 rounded">
                                  <strong>Action Taken:</strong> {event.action}
                                </div>
                              )}

                              {Object.keys(event.details).length > 0 && (
                                <div className="text-xs bg-slate-50 p-3 rounded font-mono overflow-x-auto">
                                  <pre>{JSON.stringify(event.details, null, 2)}</pre>
                                </div>
                              )}
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
