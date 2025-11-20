import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, TrendingUp, Users, Phone, Target, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalContacts: number;
  totalCalls: number;
  successRate: number;
  avgCallDuration: number;
  recentCampaigns: Array<{
    id: number;
    name: string;
    status: string;
    contacts: number;
    callsMade: number;
    successRate: number;
    createdAt: string;
  }>;
  dailyStats: Array<{
    date: string;
    calls: number;
    success: number;
    failed: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
  }>;
  performanceByUser: Array<{
    user: string;
    campaigns: number;
    contacts: number;
    calls: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CampaignAnalytics() {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/campaign-analytics', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-slate-500">
          Failed to load analytics
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Campaign Analytics</h1>
            <p className="text-slate-600 mt-2">Comprehensive campaign performance metrics and insights</p>
          </div>
          <Button onClick={fetchAnalytics} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Total Campaigns</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalCampaigns}</div>
              <p className="text-sm text-green-600 mt-1">
                {stats.activeCampaigns} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Total Contacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalContacts.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Total Calls</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalCalls.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-sm font-medium text-slate-600">Success Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.successRate}%</div>
              <p className="text-sm text-slate-600 mt-1">
                Avg. {stats.avgCallDuration}s call duration
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Call Activity</CardTitle>
              <CardDescription>Call volume and success rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} name="Total Calls" />
                  <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Successful" />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Status Distribution</CardTitle>
              <CardDescription>Breakdown of campaign states</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance by User</CardTitle>
            <CardDescription>Campaign activity and engagement metrics per user</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.performanceByUser}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="campaigns" fill="#3b82f6" name="Campaigns" />
                <Bar dataKey="contacts" fill="#10b981" name="Contacts" />
                <Bar dataKey="calls" fill="#f59e0b" name="Calls" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Latest campaign activity and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {stats.recentCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="border">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                            <Badge variant={
                              campaign.status === 'active' ? 'default' :
                              campaign.status === 'completed' ? 'secondary' :
                              'outline'
                            }>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Contacts:</span>
                              <span className="font-semibold ml-1">{campaign.contacts}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Calls Made:</span>
                              <span className="font-semibold ml-1">{campaign.callsMade}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">Success Rate:</span>
                              <span className="font-semibold ml-1 text-green-600">{campaign.successRate}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
