import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, Phone, Mail, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContactInteraction {
  id: number;
  contactName: string;
  contactEmail: string;
  contactMobile: string;
  campaignName: string;
  interactionType: 'call' | 'email' | 'sms';
  status: 'success' | 'failed' | 'pending';
  duration: number | null;
  notes: string;
  userId: string;
  timestamp: string;
}

export default function ContactTracking() {
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contact-tracking', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch contact interactions');
      
      const data = await response.json();
      setInteractions(data);
    } catch (error) {
      console.error('Error fetching contact interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
    const interval = setInterval(fetchInteractions, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = searchQuery === "" || 
      interaction.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.contactMobile.includes(searchQuery) ||
      interaction.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || interaction.interactionType === filterType;
    const matchesStatus = filterStatus === "all" || interaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const callCount = interactions.filter(i => i.interactionType === 'call').length;
  const emailCount = interactions.filter(i => i.interactionType === 'email').length;
  const smsCount = interactions.filter(i => i.interactionType === 'sms').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-5 w-5 text-blue-600" />;
      case 'email':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
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
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contact Tracking</h1>
          <p className="text-slate-600 mt-2">Monitor all contact interactions across campaigns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{interactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Phone Calls</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{callCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Emails</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{emailCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-sm font-medium text-slate-600">SMS Messages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{smsCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contact Interactions</CardTitle>
                <CardDescription>Complete timeline of all contact communications</CardDescription>
              </div>
              <Button onClick={fetchInteractions} variant="outline" size="sm" disabled={loading}>
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
                    placeholder="Search by contact name, email, phone, or campaign..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                  >
                    All Types
                  </Button>
                  <Button
                    variant={filterType === "call" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("call")}
                  >
                    Calls
                  </Button>
                  <Button
                    variant={filterType === "email" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("email")}
                  >
                    Emails
                  </Button>
                  <Button
                    variant={filterType === "sms" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("sms")}
                  >
                    SMS
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
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : filteredInteractions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No interactions found
                    </div>
                  ) : (
                    filteredInteractions.map((interaction) => (
                      <Card key={interaction.id} className="border-l-4" style={{
                        borderLeftColor: 
                          interaction.interactionType === 'call' ? '#3b82f6' :
                          interaction.interactionType === 'email' ? '#10b981' : '#8b5cf6'
                      }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                {getTypeIcon(interaction.interactionType)}
                                <span className="font-semibold text-slate-900">{interaction.contactName}</span>
                                <Badge variant="outline">{interaction.campaignName}</Badge>
                                {getStatusBadge(interaction.status)}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Mail className="h-4 w-4" />
                                  <span>{interaction.contactEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Phone className="h-4 w-4" />
                                  <span>{interaction.contactMobile}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatDistanceToNow(new Date(interaction.timestamp), { addSuffix: true })}</span>
                                </div>
                                {interaction.duration && (
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Clock className="h-4 w-4" />
                                    <span>Duration: {interaction.duration}s</span>
                                  </div>
                                )}
                              </div>

                              {interaction.notes && (
                                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                                  <strong>Notes:</strong> {interaction.notes}
                                </div>
                              )}

                              <div className="text-xs text-slate-500">
                                User: {interaction.userId}
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
