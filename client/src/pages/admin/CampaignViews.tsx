import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Search, Calendar, Clock } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface CampaignView {
  id: number;
  campaignId: number;
  userId: string;
  viewDuration: number;
  contactsViewed: number;
  actionsPerformed: any;
  createdAt: string;
}

export default function CampaignViews() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: views, isLoading } = useQuery<CampaignView[]>({
    queryKey: ['campaign-views'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/campaign-views');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredViews = views?.filter(view =>
    view.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    view.campaignId.toString().includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            Campaign Views
          </h1>
          <p className="text-slate-600 mt-2">
            Track campaign access and viewing patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{views?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {views?.length ? formatDuration(Math.floor(views.reduce((sum, v) => sum + (v.viewDuration || 0), 0) / views.length)) : '0m 0s'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Today's Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {views?.filter(v => new Date(v.createdAt).toDateString() === new Date().toDateString()).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">All Campaign Views</CardTitle>
                <CardDescription className="mt-1">
                  {filteredViews?.length || 0} views recorded
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search views..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-600">Loading campaign views...</p>
                </div>
              </div>
            ) : filteredViews && filteredViews.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">Campaign ID</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Contacts Viewed</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredViews.map((view) => (
                    <TableRow key={view.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <Badge variant="outline">#{view.campaignId}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{view.userId || 'Anonymous'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-4 w-4" />
                          {formatDuration(view.viewDuration || 0)}
                        </div>
                      </TableCell>
                      <TableCell>{view.contactsViewed || 0}</TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(view.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Eye className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No campaign views yet</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "Campaign views will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
