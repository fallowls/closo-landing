import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, Calendar, User, FileText, Download, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ActivityLog {
  id: number;
  userId: string | null;
  userRole: string | null;
  activityType: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface ActivityResponse {
  activities: ActivityLog[];
  total: number;
  limit: number;
  offset: number;
}

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { data, isLoading, refetch } = useQuery<ActivityResponse>({
    queryKey: ['activity-logs', page, activityTypeFilter, userRoleFilter, timeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (page * pageSize).toString(),
      });
      
      if (activityTypeFilter !== 'all') {
        params.append('activityType', activityTypeFilter);
      }
      
      if (userRoleFilter !== 'all') {
        params.append('userRole', userRoleFilter);
      }
      
      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (timeFilter) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        params.append('startDate', startDate.toISOString());
      }
      
      const response = await apiRequest('GET', `/api/admin/activity-logs?${params.toString()}`);
      return response.json();
    },
    refetchInterval: 30000,
  });

  const activities = data?.activities || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case 'login': return 'default';
      case 'logout': return 'secondary';
      case 'view': return 'outline';
      case 'edit': return 'default';
      case 'delete': return 'destructive';
      case 'upload': return 'default';
      case 'download': return 'secondary';
      case 'search': return 'outline';
      default: return 'outline';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resourceType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const activityTypes = [...new Set(activities.map(a => a.activityType))];
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const exportToCSV = async () => {
    try {
      // Fetch all filtered data from the server for complete export
      const params = new URLSearchParams({
        limit: '10000',
        offset: '0',
        exportAll: 'true'
      });
      
      if (activityTypeFilter !== 'all') {
        params.append('activityType', activityTypeFilter);
      }
      
      if (userRoleFilter !== 'all') {
        params.append('userRole', userRoleFilter);
      }
      
      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (timeFilter) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        params.append('startDate', startDate.toISOString());
      }
      
      const response = await apiRequest('GET', `/api/admin/activity-logs?${params.toString()}`);
      const exportData: ActivityResponse = await response.json();
      const allActivities = exportData.activities;
      
      // Apply client-side search filter
      const searchFiltered = allActivities.filter(activity => {
        const matchesSearch = 
          activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.resourceType?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
      });
      
      const csvContent = [
        ['Time', 'User', 'Role', 'Type', 'Action', 'Resource', 'IP Address'].join(','),
        ...searchFiltered.map(activity => [
          formatDate(activity.createdAt),
          activity.userId || 'Anonymous',
          activity.userRole || 'N/A',
          activity.activityType,
          activity.action,
          activity.resourceType ? `${activity.resourceType} #${activity.resourceId || ''}` : 'N/A',
          activity.ipAddress || 'N/A'
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
        <p className="text-slate-600 mt-1">Monitor all user actions and system events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-3xl font-bold text-slate-900">{activities?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-3xl font-bold text-slate-900">
                {activities?.filter(a => 
                  new Date(a.createdAt).toDateString() === new Date().toDateString()
                ).length || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-3xl font-bold text-slate-900">
                {new Set(activities?.map(a => a.userId).filter(Boolean)).size || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Activity Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-3xl font-bold text-slate-900">{activityTypes.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Detailed view of all user activities ({data?.total || 0} total records)</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={exportToCSV} variant="outline" size="sm" disabled={filteredActivities.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="flex gap-2 w-full flex-wrap mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {activityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <User className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading activities...</p>
            </div>
          ) : filteredActivities && filteredActivities.length > 0 ? (
            <>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                      <TableHead className="font-semibold">Resource</TableHead>
                      <TableHead className="font-semibold">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <>
                        <TableRow key={activity.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === activity.id ? null : activity.id)}>
                          <TableCell>
                            {expandedRow === activity.id ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {formatDate(activity.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {activity.userId || 'Anonymous'}
                              </span>
                              {activity.userRole && (
                                <span className="text-xs text-slate-500">{activity.userRole}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getActivityBadgeVariant(activity.activityType)}>
                              {activity.activityType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {activity.action}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {activity.resourceType && (
                              <span>
                                {activity.resourceType}
                                {activity.resourceId && ` #${activity.resourceId}`}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {activity.ipAddress || 'N/A'}
                          </TableCell>
                        </TableRow>
                        {expandedRow === activity.id && (
                          <TableRow className="bg-slate-50/50">
                            <TableCell colSpan={7} className="p-4">
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  {activity.userAgent && (
                                    <div>
                                      <span className="text-xs font-semibold text-slate-600">User Agent:</span>
                                      <p className="text-sm text-slate-800 mt-1">{activity.userAgent}</p>
                                    </div>
                                  )}
                                  {activity.details && Object.keys(activity.details).length > 0 && (
                                    <div className="col-span-2">
                                      <span className="text-xs font-semibold text-slate-600">Details:</span>
                                      <pre className="text-xs text-slate-800 mt-1 bg-white p-3 rounded border border-slate-200 overflow-x-auto">
                                        {JSON.stringify(activity.details, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-slate-600">
                    Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, data?.total || 0)} of {data?.total || 0} activities
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setPage(p => Math.max(0, p - 1))} 
                      disabled={page === 0}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + Math.max(0, page - 2);
                        if (pageNum >= totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-10"
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <Button 
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                      disabled={page >= totalPages - 1}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No activities found</h3>
              <p className="text-slate-600">
                {searchTerm || activityTypeFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Activity logs will appear here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
