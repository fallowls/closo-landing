import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Cpu, HardDrive, Activity } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function Performance() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['performance-stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/performance');
      return response.json();
    },
    refetchInterval: 10000,
  });

  const metrics = [
    {
      title: "Avg Response Time",
      value: stats?.avgResponseTime || "0ms",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "CPU Usage",
      value: stats?.cpuUsage || "0%",
      icon: Cpu,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Memory Usage",
      value: stats?.memoryUsage || "0 MB",
      icon: HardDrive,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Requests",
      value: stats?.activeRequests || 0,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            Performance Metrics
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor system performance and resource usage
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading performance data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
                        {metric.title}
                        <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Response Time Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    Chart visualization coming soon
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    Chart visualization coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
