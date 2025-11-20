import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'active' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/alerts');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return AlertCircle;
    }
  };

  const getSeverityVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'error': return 'border-orange-200 bg-orange-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSearch = 
      alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            System Alerts
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor and manage system alerts and notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {alerts?.filter(a => a.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {alerts?.filter(a => a.severity === 'critical' && a.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {alerts?.filter(a => a.severity === 'warning' && a.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {alerts?.filter(a => a.status === 'resolved').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">All Alerts</CardTitle>
                <CardDescription className="mt-1">
                  {filteredAlerts?.length || 0} alerts
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-600">Loading alerts...</p>
                </div>
              </div>
            ) : filteredAlerts && filteredAlerts.length > 0 ? (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => {
                  const Icon = getSeverityIcon(alert.severity);
                  return (
                    <Card key={alert.id} className={`${getSeverityColor(alert.severity)} border`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="h-5 w-5 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                                <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                                  {alert.severity}
                                </Badge>
                                <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'} className="text-xs">
                                  {alert.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-700">{alert.description}</p>
                              <p className="text-xs text-slate-500 mt-2">
                                {formatDate(alert.createdAt)}
                                {alert.resolvedAt && ` • Resolved: ${formatDate(alert.resolvedAt)}`}
                              </p>
                            </div>
                          </div>
                          {alert.status === 'active' && (
                            <div className="flex gap-2">
                              <button className="text-sm px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors">
                                Dismiss
                              </button>
                              <button className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                                Resolve
                              </button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">All clear!</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm || filterStatus !== 'all' ? "Try adjusting your filters" : "No alerts at this time"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
