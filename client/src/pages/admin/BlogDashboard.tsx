import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "./AdminLayout";
import { useLocation } from "wouter";
import {
  FileText,
  Eye,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  BarChart3,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Calendar
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  totalViews: number;
  totalComments: number;
  totalSubscribers: number;
  totalRevenue: number;
  avgSeoScore: number;
  topPosts: Array<{
    id: number;
    title: string;
    views: number;
    shares: number;
    comments: number;
  }>;
  trafficData: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
  revenueData: Array<{
    date: string;
    affiliate: number;
    ads: number;
    sponsored: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    count: number;
  }>;
  recentPosts: Array<{
    id: number;
    title: string;
    slug: string;
    status: string;
    views: number;
    seoScore: number;
    publishedAt: string | null;
    createdAt: string;
  }>;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function BlogDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: stats, isLoading, refetch } = useQuery<BlogStats>({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/blog/stats');
      return response.json();
    },
    refetchInterval: 60000,
  });

  const defaultStats: BlogStats = {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    scheduledPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
    avgSeoScore: 0,
    topPosts: [],
    trafficData: [],
    revenueData: [],
    categoryDistribution: [],
    recentPosts: []
  };

  const data = stats || defaultStats;

  const metrics = [
    { title: "Total Posts", value: data.totalPosts, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Published", value: data.publishedPosts, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Total Views", value: data.totalViews.toLocaleString(), icon: Eye, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Subscribers", value: data.totalSubscribers, icon: Users, color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { title: "Comments", value: data.totalComments, icon: MessageSquare, color: "text-teal-600", bgColor: "bg-teal-50" },
    { title: "Revenue", value: `$${data.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { title: "Avg SEO Score", value: `${data.avgSeoScore}%`, icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Drafts", value: data.draftPosts, icon: Clock, color: "text-slate-600", bgColor: "bg-slate-50" },
  ];

  const filteredPosts = data.recentPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700">Published</Badge>;
      case 'draft':
        return <Badge className="bg-slate-100 text-slate-700">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Blog Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your blog posts, track performance, and optimize for SEO
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setLocation("/admin/blog/posts/new")} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className="border-slate-200">
                <CardContent className="pt-4 pb-4">
                  <div className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <p className="text-xs text-slate-500">{metric.title}</p>
                  <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Traffic Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="views" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="visitors" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="affiliate" stackId="a" fill="#6366f1" />
                  <Bar dataKey="ads" stackId="a" fill="#10b981" />
                  <Bar dataKey="sponsored" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Top Performing Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topPosts.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No posts yet</p>
                ) : (
                  data.topPosts.map((post, idx) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-900 truncate max-w-[200px]">{post.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> {post.comments}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Recent Posts
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No posts found</p>
                <Button onClick={() => setLocation("/admin/blog/posts/new")} className="mt-4">
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>SEO Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[300px] truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>{post.views.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getSeoScoreColor(post.seoScore)}`}>
                          {post.seoScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLocation(`/admin/blog/posts/${post.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setLocation("/admin/blog/categories")}
          >
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>Manage Categories</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setLocation("/admin/blog/comments")}
          >
            <MessageSquare className="w-6 h-6 text-teal-600" />
            <span>Moderate Comments</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setLocation("/admin/blog/analytics")}
          >
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>View Analytics</span>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
