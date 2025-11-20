import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Table, HardDrive, Activity } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function DatabaseStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['database-stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/database-stats');
      return response.json();
    },
    refetchInterval: 60000,
  });

  const metrics = [
    {
      title: "Total Records",
      value: stats?.totalRecords || 0,
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Tables",
      value: stats?.tableCount || 0,
      icon: Table,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Database Size",
      value: stats?.databaseSize || "0 MB",
      icon: HardDrive,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Connections",
      value: stats?.activeConnections || 0,
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
              <Database className="w-6 h-6 text-white" />
            </div>
            Database Statistics
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor database health and performance metrics
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading database stats...</p>
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

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Table Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.tables?.map((table: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Table className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-900">{table.name}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {table.rowCount?.toLocaleString()} rows
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-slate-400">
                      No table data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
