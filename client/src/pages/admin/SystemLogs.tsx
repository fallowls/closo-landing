import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, AlertTriangle, Info, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface SystemLog {
  id: number;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  category: string;
  message: string;
  details: Record<string, any>;
  source: string;
  timestamp: string;
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/system-logs', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch system logs');
      
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching system logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warnCount = logs.filter(l => l.level === 'warn').length;
  const infoCount = logs.filter(l => l.level === 'info').length;
  const successCount = logs.filter(l => l.level === 'success').length;

  const categories = Array.from(new Set(logs.map(l => l.category)));

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'debug':
        return <AlertCircle className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Error</Badge>;
      case 'warn':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Info</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Success</Badge>;
      case 'debug':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Debug</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Logs</h1>
          <p className="text-slate-600 mt-2">Monitor application events, errors, and system activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{logs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Errors</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{errorCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Warnings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{warnCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{infoCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Success</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{successCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Application Logs</CardTitle>
                <CardDescription>Real-time system events and error tracking</CardDescription>
              </div>
              <Button onClick={fetchLogs} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search logs by message, category, or source..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <Button
                      variant={filterLevel === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("all")}
                    >
                      All Levels
                    </Button>
                    <Button
                      variant={filterLevel === "error" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("error")}
                    >
                      Errors
                    </Button>
                    <Button
                      variant={filterLevel === "warn" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("warn")}
                    >
                      Warnings
                    </Button>
                    <Button
                      variant={filterLevel === "info" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("info")}
                    >
                      Info
                    </Button>
                    <Button
                      variant={filterLevel === "success" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("success")}
                    >
                      Success
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory("all")}
                  >
                    All Categories
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No logs found
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <Card key={log.id} className="border-l-4" style={{
                        borderLeftColor: 
                          log.level === 'error' ? '#ef4444' :
                          log.level === 'warn' ? '#f97316' :
                          log.level === 'success' ? '#10b981' :
                          log.level === 'info' ? '#3b82f6' : '#8b5cf6'
                      }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                {getLevelIcon(log.level)}
                                {getLevelBadge(log.level)}
                                <Badge variant="outline">{log.category}</Badge>
                                <span className="text-xs text-slate-500">
                                  {format(new Date(log.timestamp), 'PPpp')}
                                </span>
                              </div>

                              <div className="text-sm font-medium text-slate-900">
                                {log.message}
                              </div>

                              {Object.keys(log.details).length > 0 && (
                                <div className="text-xs bg-slate-50 p-3 rounded font-mono overflow-x-auto">
                                  <pre>{JSON.stringify(log.details, null, 2)}</pre>
                                </div>
                              )}

                              <div className="text-xs text-slate-500">
                                Source: {log.source}
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
