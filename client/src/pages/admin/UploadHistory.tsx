import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, Search, Calendar, FileText, CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface UploadRecord {
  id: number;
  userId: string;
  filename: string;
  fileSize: number;
  campaignId: number;
  success: boolean;
  errorMessage: string;
  createdAt: string;
}

export default function UploadHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: uploads, isLoading } = useQuery<UploadRecord[]>({
    queryKey: ['upload-history'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/upload-history');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUploads = uploads?.filter(upload =>
    upload.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upload.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            Upload History
          </h1>
          <p className="text-slate-600 mt-2">
            Track all file uploads and their status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{uploads?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {uploads?.filter(u => u.success).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {uploads?.filter(u => !u.success).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {formatFileSize(uploads?.reduce((sum, u) => sum + (u.fileSize || 0), 0) || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">All Uploads</CardTitle>
                <CardDescription className="mt-1">
                  {filteredUploads?.length || 0} uploads recorded
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search uploads..."
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
                  <p className="mt-4 text-slate-600">Loading upload history...</p>
                </div>
              </div>
            ) : filteredUploads && filteredUploads.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">Filename</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Size</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUploads.map((upload) => (
                    <TableRow key={upload.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{upload.filename}</span>
                        </div>
                      </TableCell>
                      <TableCell>{upload.userId || 'N/A'}</TableCell>
                      <TableCell className="text-slate-600">{formatFileSize(upload.fileSize || 0)}</TableCell>
                      <TableCell>
                        <Badge variant={upload.success ? 'default' : 'destructive'} className="gap-1">
                          {upload.success ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {upload.success ? 'Success' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(upload.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No uploads yet</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "Upload history will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
