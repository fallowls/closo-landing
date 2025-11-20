import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Search, X, Download, Save, RotateCcw, Filter, 
  Users, Building2, TrendingUp, Globe, Mail, Phone, Linkedin,
  Briefcase, DollarSign, MapPin, Star, ChevronDown, ChevronUp,
  Sparkles, Target, Award, Zap, BarChart3, Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface ContactFilter {
  column: string;
  operator: string;
  value: any;
  value2?: any;
}

interface Contact {
  id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  email: string;
  mobile_phone?: string;
  company?: string;
  employees?: number;
  employee_size_bracket?: string;
  industry?: string;
  website?: string;
  annual_revenue?: number;
  person_linkedin?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_score?: number;
  technologies?: string[];
  business_type?: string;
}

const OPERATORS = [
  { value: 'equals', label: 'Equals', icon: '=' },
  { value: 'contains', label: 'Contains', icon: '⊃' },
  { value: 'starts_with', label: 'Starts with', icon: '→' },
  { value: 'greater_or_equal', label: '≥', icon: '≥' },
  { value: 'less_or_equal', label: '≤', icon: '≤' },
  { value: 'is_not_null', label: 'Has value', icon: '✓' },
];

const FILTER_FIELDS = [
  { value: 'title', label: 'Job Title', icon: Briefcase, type: 'text' },
  { value: 'company', label: 'Company', icon: Building2, type: 'text' },
  { value: 'industry', label: 'Industry', icon: Target, type: 'text' },
  { value: 'employees', label: 'Company Size', icon: Users, type: 'number' },
  { value: 'annual_revenue', label: 'Revenue', icon: DollarSign, type: 'number' },
  { value: 'city', label: 'City', icon: MapPin, type: 'text' },
  { value: 'country', label: 'Country', icon: Globe, type: 'text' },
  { value: 'lead_score', label: 'Lead Score', icon: Star, type: 'number' },
];

export default function ContactsFilter() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<ContactFilter[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [showStats, setShowStats] = useState(true);
  const { toast } = useToast();

  // Fetch filter templates
  const { data: templatesData } = useQuery({
    queryKey: ['/api/contacts-filter/templates'],
  });

  // Fetch statistics
  const { data: statistics } = useQuery({
    queryKey: ['/api/contacts-filter/statistics'],
    refetchInterval: false,
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (searchQuery: any) => {
      const response = await apiRequest('POST', '/api/contacts-filter/search', searchQuery);
      return response.json();
    },
    onError: (error: any) => {
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search contacts",
        variant: "destructive"
      });
    }
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (searchQuery: any) => {
      const response = await fetch('/api/contacts-filter/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchQuery),
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_export_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Export Complete",
        description: "Your contacts have been exported successfully",
      });
    }
  });

  const handleSearch = () => {
    const query = {
      filters,
      globalSearch: globalSearch.trim() || undefined,
      page,
      pageSize,
      sortBy: 'lead_score',
      sortOrder: 'desc' as const
    };
    searchMutation.mutate(query);
  };

  const handleExport = () => {
    const query = {
      filters,
      globalSearch: globalSearch.trim() || undefined,
      sortBy: 'lead_score',
      sortOrder: 'desc' as const
    };
    exportMutation.mutate(query);
  };

  const addFilter = (column: string) => {
    const field = FILTER_FIELDS.find(f => f.value === column);
    const defaultOperator = field?.type === 'number' ? 'greater_or_equal' : 'contains';
    
    setFilters([...filters, {
      column,
      operator: defaultOperator,
      value: ''
    }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof ContactFilter, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters([]);
    setGlobalSearch('');
    setSelectedTemplate('');
    setPage(1);
    searchMutation.reset();
  };

  const applyTemplate = (templateId: string) => {
    const template = (templatesData as any)?.templates?.[templateId];
    if (!template) return;

    setSelectedTemplate(templateId);
    // Store template metadata for backend OR/AND logic
    setFilters([]);
    localStorage.setItem('activeTemplateId', templateId);
    setGlobalSearch('');
    setPage(1);
    
    // Trigger search with template immediately
    const query = {
      filters: [],
      filterGroups: [{
        filters: template.filters,
        combineWith: template.combineWith || 'AND'
      }],
      page: 1,
      pageSize,
      sortBy: 'lead_score',
      sortOrder: 'desc' as const
    };
    searchMutation.mutate(query);
  };

  // Auto-search when filters change
  useEffect(() => {
    if (filters.length > 0 || globalSearch.trim()) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filters, globalSearch, page]);

  const result = searchMutation.data;
  const templates: Record<string, any> = (templatesData as any)?.templates || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/dashboard')}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  Advanced Contact Filters
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Search across {(statistics as any)?.total_contacts?.toLocaleString() || '6,716'} professional contacts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={filters.length === 0 && !globalSearch}
                data-testid="button-reset"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleExport}
                disabled={!result || exportMutation.isPending}
                data-testid="button-export"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Bar */}
      {statistics && showStats && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-90">Total Contacts</div>
                  <div className="text-lg font-bold">{parseInt((statistics as any).total_contacts || 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-90">Companies</div>
                  <div className="text-lg font-bold">{parseInt((statistics as any).total_companies || 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-90">Industries</div>
                  <div className="text-lg font-bold">{parseInt((statistics as any).total_industries || 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-90">Avg Lead Score</div>
                  <div className="text-lg font-bold">{parseFloat((statistics as any).avg_lead_score || 0).toFixed(1)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-90">High-Score Leads</div>
                  <div className="text-lg font-bold">{parseInt((statistics as any).high_score_leads || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(false)}
              className="text-white hover:bg-white/20"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {!showStats && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(true)}
            className="text-white hover:bg-white/20 w-full"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Show Statistics
          </Button>
        </div>
      )}

      <div className="flex h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <aside className="w-96 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Global Search */}
            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                Quick Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name, email, company..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-global-search"
                />
              </div>
            </div>

            <Separator />

            {/* Filter Templates */}
            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3 block flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quick Filters
              </Label>
              <div className="grid gap-2">
                {Object.entries(templates).map(([id, template]: [string, any]) => (
                  <Button
                    key={id}
                    variant={selectedTemplate === id ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyTemplate(id)}
                    className={cn(
                      "justify-start text-left h-auto py-2",
                      selectedTemplate === id && "bg-gradient-to-r from-blue-600 to-indigo-600"
                    )}
                    data-testid={`button-template-${id}`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs opacity-70">{template.description}</div>
                    </div>
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Active Filters */}
            {filters.length > 0 && (
              <div>
                <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3 block">
                  Active Filters ({filters.length})
                </Label>
                <div className="space-y-2">
                  {filters.map((filter, index) => {
                    const field = FILTER_FIELDS.find(f => f.value === filter.column);
                    const needsValue = !['is_null', 'is_not_null'].includes(filter.operator);
                    
                    return (
                      <Card key={index} className="p-3" data-testid={`filter-${index}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {field && <field.icon className="h-4 w-4 text-blue-600" />}
                            <span className="text-sm font-medium">{field?.label || filter.column}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => removeFilter(index)}
                            data-testid={`button-remove-filter-${index}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Select
                          value={filter.operator}
                          onValueChange={(value) => updateFilter(index, 'operator', value)}
                        >
                          <SelectTrigger className="h-8 text-xs mb-2" data-testid={`select-operator-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPERATORS.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {needsValue && (
                          <Input
                            placeholder="Value"
                            value={filter.value || ''}
                            onChange={(e) => updateFilter(index, 'value', e.target.value)}
                            className="h-8 text-xs"
                            type={field?.type === 'number' ? 'number' : 'text'}
                            data-testid={`input-value-${index}`}
                          />
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Add New Filter */}
            <div>
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3 block flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Filter
              </Label>
              <div className="grid gap-2">
                {FILTER_FIELDS.map((field) => (
                  <Button
                    key={field.value}
                    variant="outline"
                    size="sm"
                    onClick={() => addFilter(field.value)}
                    className="justify-start"
                    data-testid={`button-add-${field.value}`}
                  >
                    <field.icon className="h-4 w-4 mr-2 text-slate-600" />
                    {field.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Results Header */}
          {result && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {result.totalCount.toLocaleString()} Contacts Found
                </h2>
                {result.aggregations && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                )}
              </div>
              
              {result.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {page} of {result.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(result.totalPages, page + 1))}
                    disabled={page === result.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Contact Cards */}
          {searchMutation.isPending ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Searching contacts...</p>
              </div>
            </div>
          ) : result && result.data.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {result.data.map((contact: Contact) => (
                <Card key={contact.id} className="hover:shadow-lg transition-shadow" data-testid={`contact-${contact.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {contact.full_name}
                          {contact.lead_score && contact.lead_score >= 70 && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                              <Star className="h-3 w-3 mr-1" />
                              {contact.lead_score}
                            </Badge>
                          )}
                        </CardTitle>
                        {contact.title && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {contact.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{contact.company}</span>
                        {contact.employees && (
                          <Badge variant="outline" className="text-xs">
                            {contact.employee_size_bracket || `${contact.employees.toLocaleString()} emp`}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {contact.industry && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Target className="h-4 w-4" />
                        {contact.industry}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm">
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </a>
                      )}
                      
                      {contact.mobile_phone && (
                        <a
                          href={`tel:${contact.mobile_phone}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Call
                        </a>
                      )}
                      
                      {contact.person_linkedin && (
                        <a
                          href={contact.person_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                          LinkedIn
                        </a>
                      )}
                    </div>

                    {(contact.city || contact.country) && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}
                      </div>
                    )}

                    {contact.technologies && contact.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {contact.technologies.slice(0, 3).map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {contact.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{contact.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : result && result.data.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No contacts found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Start searching for contacts
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Use the filters on the left or quick search to find contacts
              </p>
              <div className="flex justify-center gap-2">
                {Object.keys(templates).slice(0, 3).map((id) => (
                  <Button
                    key={id}
                    variant="outline"
                    onClick={() => applyTemplate(id)}
                    size="sm"
                  >
                    Try: {templates[id].name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
