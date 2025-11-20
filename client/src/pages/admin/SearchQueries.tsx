import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, TrendingUp } from "lucide-react";
import AdminLayout from "./AdminLayout";

interface SearchQuery {
  id: number;
  userId: string;
  query: string;
  resultsCount: number;
  executionTime: number;
  createdAt: string;
}

export default function SearchQueries() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: queries, isLoading } = useQuery<SearchQuery[]>({
    queryKey: ['search-queries'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/search-queries');
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

  const filteredQueries = queries?.filter(query =>
    query.query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularSearches = queries?.reduce((acc: any[], query) => {
    const existing = acc.find(q => q.query === query.query);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ query: query.query, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            Search Queries
          </h1>
          <p className="text-slate-600 mt-2">
            Analyze user search patterns and popular queries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{queries?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {queries?.length ? Math.floor(queries.reduce((sum, q) => sum + (q.resultsCount || 0), 0) / queries.length) : 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {queries?.length ? (queries.reduce((sum, q) => sum + (q.executionTime || 0), 0) / queries.length).toFixed(2) : 0}ms
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
              <CardDescription>Most frequently searched queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularSearches?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-900">{item.query}</span>
                    </div>
                    <Badge variant="secondary">{item.count} times</Badge>
                  </div>
                )) || (
                  <div className="text-center py-8 text-slate-400">
                    No popular searches yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Searches</CardTitle>
                  <CardDescription className="mt-1">
                    {filteredQueries?.length || 0} queries
                  </CardDescription>
                </div>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Filter..."
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
                    <p className="mt-4 text-slate-600">Loading searches...</p>
                  </div>
                </div>
              ) : filteredQueries && filteredQueries.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-slate-100">
                        <TableHead className="font-semibold">Query</TableHead>
                        <TableHead className="font-semibold">Results</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQueries.slice(0, 10).map((query) => (
                        <TableRow key={query.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium">{query.query}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{query.resultsCount}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {formatDate(query.createdAt)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="font-medium text-slate-900 mb-2">No searches yet</h3>
                  <p className="text-slate-500 text-sm">
                    {searchTerm ? "Try adjusting your filter" : "Search queries will appear here"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
