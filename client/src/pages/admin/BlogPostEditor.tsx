import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRoute, useLocation } from "wouter";
import AdminLayout from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Save,
  Eye,
  ArrowLeft,
  Globe,
  Search,
  Image,
  Link2,
  Settings,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  TrendingUp,
  MessageSquare,
  Tag,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  authorId: number | null;
  categoryId: number | null;
  status: string;
  visibility: string;
  publishedAt: string | null;
  scheduledAt: string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  focusKeyword: string;
  seoScore: number;
  readabilityScore: number;
  allowComments: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  affiliateLinks: any[];
  adPlacements: any[];
  tags: number[];
}

const defaultPost: BlogPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  featuredImageAlt: "",
  authorId: null,
  categoryId: null,
  status: "draft",
  visibility: "public",
  publishedAt: null,
  scheduledAt: null,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  focusKeyword: "",
  seoScore: 0,
  readabilityScore: 0,
  allowComments: true,
  isPinned: false,
  isFeatured: false,
  affiliateLinks: [],
  adPlacements: [],
  tags: []
};

export default function BlogPostEditor() {
  const [, params] = useRoute("/admin/blog/posts/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = params?.id === "new";
  const postId = isNew ? null : parseInt(params?.id || "0");

  const [post, setPost] = useState<BlogPost>(defaultPost);
  const [activeTab, setActiveTab] = useState("content");

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/blog/categories');
      return response.json();
    },
  });

  const { data: authors } = useQuery({
    queryKey: ['blog-authors'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/blog/authors');
      return response.json();
    },
  });

  const { data: tags } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/blog/tags');
      return response.json();
    },
  });

  const { data: existingPost, isLoading } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/blog/posts/${postId}`);
      return response.json();
    },
    enabled: !isNew && !!postId,
  });

  useEffect(() => {
    if (existingPost) {
      setPost(existingPost);
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPost) => {
      if (isNew) {
        return apiRequest('POST', '/api/admin/blog/posts', data);
      }
      return apiRequest('PUT', `/api/admin/blog/posts/${postId}`, data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: isNew ? "Post Created" : "Post Updated",
        description: "Your blog post has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
      if (isNew && result.id) {
        setLocation(`/admin/blog/posts/${result.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save blog post.",
        variant: "destructive",
      });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title,
      ogTitle: prev.ogTitle || title,
      twitterTitle: prev.twitterTitle || title,
    }));
  };

  const calculateSeoScore = () => {
    let score = 0;
    if (post.metaTitle && post.metaTitle.length >= 30 && post.metaTitle.length <= 60) score += 15;
    if (post.metaDescription && post.metaDescription.length >= 120 && post.metaDescription.length <= 160) score += 15;
    if (post.focusKeyword) score += 10;
    if (post.focusKeyword && post.title.toLowerCase().includes(post.focusKeyword.toLowerCase())) score += 10;
    if (post.focusKeyword && post.content.toLowerCase().includes(post.focusKeyword.toLowerCase())) score += 10;
    if (post.featuredImage) score += 10;
    if (post.featuredImageAlt) score += 10;
    if (post.excerpt) score += 10;
    if (post.content.length > 300) score += 10;
    return score;
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const seoScore = calculateSeoScore();

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/admin/blog")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isNew ? "Create New Post" : "Edit Post"}
              </h1>
              <p className="text-sm text-slate-600">
                {isNew ? "Write and optimize your blog content" : `Editing: ${post.title}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getSeoScoreColor(seoScore)}>
              SEO: {seoScore}%
            </Badge>
            <Select
              value={post.status}
              onValueChange={(value) => setPost(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
              disabled={!post.slug}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => saveMutation.mutate(post)}
              disabled={saveMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Post Title</Label>
                    <Input
                      id="title"
                      value={post.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title..."
                      className="text-lg font-medium mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-500">/blog/</span>
                      <Input
                        id="slug"
                        value={post.slug}
                        onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="post-url-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={post.excerpt}
                      onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief summary of the post..."
                      rows={3}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {post.excerpt.length}/300 characters recommended
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={post.content}
                      onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your blog post content here... (Supports Markdown)"
                      rows={20}
                      className="mt-1 font-mono"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {post.content.split(/\s+/).filter(Boolean).length} words |{" "}
                      {Math.ceil(post.content.split(/\s+/).filter(Boolean).length / 200)} min read
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Post Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={post.categoryId?.toString() || ""}
                    onValueChange={(value) => setPost(prev => ({ ...prev, categoryId: parseInt(value) }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Author</Label>
                  <Select
                    value={post.authorId?.toString() || ""}
                    onValueChange={(value) => setPost(prev => ({ ...prev, authorId: parseInt(value) }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors?.map((author: any) => (
                        <SelectItem key={author.id} value={author.id.toString()}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label>Featured Post</Label>
                  <Switch
                    checked={post.isFeatured}
                    onCheckedChange={(checked) => setPost(prev => ({ ...prev, isFeatured: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Pin to Top</Label>
                  <Switch
                    checked={post.isPinned}
                    onCheckedChange={(checked) => setPost(prev => ({ ...prev, isPinned: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Allow Comments</Label>
                  <Switch
                    checked={post.allowComments}
                    onCheckedChange={(checked) => setPost(prev => ({ ...prev, allowComments: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={post.featuredImage}
                    onChange={(e) => setPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Alt Text (for SEO)</Label>
                  <Input
                    value={post.featuredImageAlt}
                    onChange={(e) => setPost(prev => ({ ...prev, featuredImageAlt: e.target.value }))}
                    placeholder="Describe the image..."
                    className="mt-1"
                  />
                </div>
                {post.featuredImage && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.featuredImageAlt}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Focus Keyword</Label>
                  <Input
                    value={post.focusKeyword}
                    onChange={(e) => setPost(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="Main keyword to rank for"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Meta Title</Label>
                  <Input
                    value={post.metaTitle}
                    onChange={(e) => setPost(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="SEO title (50-60 chars)"
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {post.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    value={post.metaDescription}
                    onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="SEO description (120-160 chars)"
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {post.metaDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <Label>Keywords</Label>
                  <Input
                    value={post.metaKeywords}
                    onChange={(e) => setPost(prev => ({ ...prev, metaKeywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Canonical URL</Label>
                  <Input
                    value={post.canonicalUrl}
                    onChange={(e) => setPost(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>OG Title</Label>
                  <Input
                    value={post.ogTitle}
                    onChange={(e) => setPost(prev => ({ ...prev, ogTitle: e.target.value }))}
                    placeholder="Facebook/LinkedIn title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>OG Description</Label>
                  <Textarea
                    value={post.ogDescription}
                    onChange={(e) => setPost(prev => ({ ...prev, ogDescription: e.target.value }))}
                    placeholder="Facebook/LinkedIn description"
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>OG Image URL</Label>
                  <Input
                    value={post.ogImage}
                    onChange={(e) => setPost(prev => ({ ...prev, ogImage: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>

                <Separator />

                <div>
                  <Label>Twitter Title</Label>
                  <Input
                    value={post.twitterTitle}
                    onChange={(e) => setPost(prev => ({ ...prev, twitterTitle: e.target.value }))}
                    placeholder="Twitter card title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Twitter Description</Label>
                  <Textarea
                    value={post.twitterDescription}
                    onChange={(e) => setPost(prev => ({ ...prev, twitterDescription: e.target.value }))}
                    placeholder="Twitter card description"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monetization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Add affiliate links and ad placements to monetize your content.
                  Configure in the Analytics section.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
