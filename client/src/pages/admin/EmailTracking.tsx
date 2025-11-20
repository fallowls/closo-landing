import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Search, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface EmailTracking {
  id: number;
  contactId: number;
  userId: string;
  emailType: string;
  subject: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  openedAt?: string;
  clickedAt?: string;
  createdAt: string;
}

export default function EmailTracking() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: emails, isLoading } = useQuery<EmailTracking[]>({
    queryKey: ['email-tracking'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/email-tracking');
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'opened': return 'default';
      case 'clicked': return 'default';
      case 'sent': return 'secondary';
      case 'bounced': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredEmails = emails?.filter(email =>
    email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.contactId.toString().includes(searchTerm) ||
    email.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            Email Tracking
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor email campaigns and engagement metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{emails?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {emails?.filter(e => ['delivered', 'opened', 'clicked'].includes(e.status)).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Opened</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {emails?.filter(e => ['opened', 'clicked'].includes(e.status)).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Clicked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {emails?.filter(e => e.status === 'clicked').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Bounced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {emails?.filter(e => e.status === 'bounced' || e.status === 'failed').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Email Activity</CardTitle>
                <CardDescription className="mt-1">
                  {filteredEmails?.length || 0} emails tracked
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search emails..."
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
                  <p className="mt-4 text-slate-600">Loading email tracking...</p>
                </div>
              </div>
            ) : filteredEmails && filteredEmails.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow key={email.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium max-w-md truncate">{email.subject}</TableCell>
                      <TableCell>Contact #{email.contactId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{email.emailType || 'Marketing'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(email.status)} className="gap-1">
                            {email.status === 'delivered' || email.status === 'opened' || email.status === 'clicked' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : email.status === 'bounced' || email.status === 'failed' ? (
                              <XCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {email.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(email.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">No email tracking data</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search" : "Email tracking will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
