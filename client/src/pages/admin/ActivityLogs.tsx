import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  createdAt: string;
}

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");

  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/activity-logs');
      return response.json();
    },
    refetchInterval: 10000,
  });

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

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activityTypeFilter === 'all' || activity.activityType === activityTypeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const activityTypes = [...new Set(activities?.map(a => a.activityType) || [])];

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
              <CardDescription>Detailed view of all user activities</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
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
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {activityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading activities...</p>
            </div>
          ) : filteredActivities && filteredActivities.length > 0 ? (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
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
                    <TableRow key={activity.id} className="hover:bg-slate-50">
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
                  ))}
                </TableBody>
              </Table>
            </div>
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
