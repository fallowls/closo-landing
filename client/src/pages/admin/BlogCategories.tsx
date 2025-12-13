import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./AdminLayout";
import { useLocation } from "wouter";
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  RefreshCw,
  Tag,
  Hash
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount?: number;
  metaTitle: string;
  metaDescription: string;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

export default function BlogCategories() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"categories" | "tags">("categories");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#6366f1",
    metaTitle: "",
    metaDescription: ""
  });

  const [newTag, setNewTag] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#10b981"
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/blog/categories');
      return response.json();
    },
  });

  const { data: tags, isLoading: loadingTags } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/blog/tags');
      return response.json();
    },
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCategory) {
        return apiRequest('PUT', `/api/admin/blog/categories/${editingCategory.id}`, data);
      }
      return apiRequest('POST', '/api/admin/blog/categories', data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category saved successfully" });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      setNewCategory({ name: "", slug: "", description: "", color: "#6366f1", metaTitle: "", metaDescription: "" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/blog/categories/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "Category deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    },
  });

  const saveTagMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingTag) {
        return apiRequest('PUT', `/api/admin/blog/tags/${editingTag.id}`, data);
      }
      return apiRequest('POST', '/api/admin/blog/tags', data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Tag saved successfully" });
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      setIsTagDialogOpen(false);
      setEditingTag(null);
      setNewTag({ name: "", slug: "", description: "", color: "#10b981" });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/blog/tags/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "Tag deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
    },
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const filteredCategories = categories?.filter((cat: Category) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredTags = tags?.filter((tag: BlogTag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-purple-600" />
                Categories & Tags
              </h1>
              <p className="text-sm text-slate-600">
                Organize your blog content
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <Button
            variant={activeTab === "tags" ? "default" : "outline"}
            onClick={() => setActiveTab("tags")}
          >
            <Tag className="w-4 h-4 mr-2" />
            Tags
          </Button>
        </div>

        {activeTab === "categories" && (
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingCategory(null);
                        setNewCategory({ name: "", slug: "", description: "", color: "#6366f1", metaTitle: "", metaDescription: "" });
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={editingCategory?.name || newCategory.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, name, slug: editingCategory.slug || generateSlug(name) });
                              } else {
                                setNewCategory({ ...newCategory, name, slug: newCategory.slug || generateSlug(name) });
                              }
                            }}
                            placeholder="Category name"
                          />
                        </div>
                        <div>
                          <Label>Slug</Label>
                          <Input
                            value={editingCategory?.slug || newCategory.slug}
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, slug: e.target.value });
                              } else {
                                setNewCategory({ ...newCategory, slug: e.target.value });
                              }
                            }}
                            placeholder="category-slug"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={editingCategory?.description || newCategory.description}
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, description: e.target.value });
                              } else {
                                setNewCategory({ ...newCategory, description: e.target.value });
                              }
                            }}
                            placeholder="Category description"
                          />
                        </div>
                        <div>
                          <Label>Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingCategory?.color || newCategory.color}
                              onChange={(e) => {
                                if (editingCategory) {
                                  setEditingCategory({ ...editingCategory, color: e.target.value });
                                } else {
                                  setNewCategory({ ...newCategory, color: e.target.value });
                                }
                              }}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={editingCategory?.color || newCategory.color}
                              onChange={(e) => {
                                if (editingCategory) {
                                  setEditingCategory({ ...editingCategory, color: e.target.value });
                                } else {
                                  setNewCategory({ ...newCategory, color: e.target.value });
                                }
                              }}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Meta Title (SEO)</Label>
                          <Input
                            value={editingCategory?.metaTitle || newCategory.metaTitle}
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, metaTitle: e.target.value });
                              } else {
                                setNewCategory({ ...newCategory, metaTitle: e.target.value });
                              }
                            }}
                            placeholder="SEO title for category page"
                          />
                        </div>
                        <div>
                          <Label>Meta Description (SEO)</Label>
                          <Textarea
                            value={editingCategory?.metaDescription || newCategory.metaDescription}
                            onChange={(e) => {
                              if (editingCategory) {
                                setEditingCategory({ ...editingCategory, metaDescription: e.target.value });
                              } else {
                                setNewCategory({ ...newCategory, metaDescription: e.target.value });
                              }
                            }}
                            placeholder="SEO description for category page"
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => saveCategoryMutation.mutate(editingCategory || newCategory)}
                          disabled={saveCategoryMutation.isPending}
                        >
                          {saveCategoryMutation.isPending ? "Saving..." : "Save Category"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCategories ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No categories found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category: Category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-slate-500">{category.slug}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{category.postCount || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-xs text-slate-500">{category.color}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingCategory(category);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this category?")) {
                                  deleteCategoryMutation.mutate(category.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
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
        )}

        {activeTab === "tags" && (
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tags</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingTag(null);
                        setNewTag({ name: "", slug: "", description: "", color: "#10b981" });
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tag
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingTag ? "Edit Tag" : "New Tag"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={editingTag?.name || newTag.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              if (editingTag) {
                                setEditingTag({ ...editingTag, name, slug: editingTag.slug || generateSlug(name) });
                              } else {
                                setNewTag({ ...newTag, name, slug: newTag.slug || generateSlug(name) });
                              }
                            }}
                            placeholder="Tag name"
                          />
                        </div>
                        <div>
                          <Label>Slug</Label>
                          <Input
                            value={editingTag?.slug || newTag.slug}
                            onChange={(e) => {
                              if (editingTag) {
                                setEditingTag({ ...editingTag, slug: e.target.value });
                              } else {
                                setNewTag({ ...newTag, slug: e.target.value });
                              }
                            }}
                            placeholder="tag-slug"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={editingTag?.description || newTag.description}
                            onChange={(e) => {
                              if (editingTag) {
                                setEditingTag({ ...editingTag, description: e.target.value });
                              } else {
                                setNewTag({ ...newTag, description: e.target.value });
                              }
                            }}
                            placeholder="Tag description"
                          />
                        </div>
                        <div>
                          <Label>Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editingTag?.color || newTag.color}
                              onChange={(e) => {
                                if (editingTag) {
                                  setEditingTag({ ...editingTag, color: e.target.value });
                                } else {
                                  setNewTag({ ...newTag, color: e.target.value });
                                }
                              }}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={editingTag?.color || newTag.color}
                              onChange={(e) => {
                                if (editingTag) {
                                  setEditingTag({ ...editingTag, color: e.target.value });
                                } else {
                                  setNewTag({ ...newTag, color: e.target.value });
                                }
                              }}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => saveTagMutation.mutate(editingTag || newTag)}
                          disabled={saveTagMutation.isPending}
                        >
                          {saveTagMutation.isPending ? "Saving..." : "Save Tag"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTags ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Tag className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No tags found</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {filteredTags.map((tag: BlogTag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                    >
                      <Hash className="w-4 h-4" style={{ color: tag.color }} />
                      <span className="font-medium">{tag.name}</span>
                      <Badge variant="outline" className="text-xs">{tag.postCount}</Badge>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setEditingTag(tag);
                            setIsTagDialogOpen(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            if (confirm("Delete this tag?")) {
                              deleteTagMutation.mutate(tag.id);
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
