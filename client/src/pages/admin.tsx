import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminAuth } from "../components/admin-auth";
import { Plus, Edit, Trash2, Upload, VideoIcon, Users, Save, X } from "lucide-react";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { type Series, type Video } from "@shared/schema";

import { seriesService, videosService } from "../lib/firestore";

interface AdminProps {}

export default function Admin({}: AdminProps) {
  const [isSeriesDialogOpen, setIsSeriesDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isVideoEditDialogOpen, setIsVideoEditDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const { toast } = useToast();

  const { data: series, isLoading: seriesLoading } = useQuery({
    queryKey: ["admin-series"],
    queryFn: () => seriesService.getAll(),
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: () => videosService.getAll(),
  });

  const createSeriesMutation = useMutation({
    mutationFn: async (data: Series) => {
      const response = await seriesService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-series"] });
      toast({ title: "Series created successfully!" });
    },
    onError: (error) => {
      console.error("Error creating series:", error);
      toast({ title: "Error creating series", description: error.message, variant: "destructive" });
    }
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: Video) => {
      const response = await videosService.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast({ title: "Video created successfully!" });
    },
    onError: (error) => {
      console.error("Error creating video:", error);
      toast({ title: "Error creating video", description: error.message, variant: "destructive" });
    }
  });

  const updateSeriesMutation = useMutation({
    mutationFn: async (data: { id: string; series: Partial<Series> }) => {
      await seriesService.update(data.id, data.series);
      return await seriesService.getById(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-series"] });
      toast({ title: "Series updated successfully!" });
      setIsEditDialogOpen(false);
      setEditingSeries(null);
    },
    onError: (error) => {
      console.error("Error updating series:", error);
      toast({ title: "Error updating series", description: error.message, variant: "destructive" });
    }
  });

  const updateVideoMutation = useMutation({
    mutationFn: async (data: { id: string; video: Partial<Video> }) => {
      await videosService.update(data.id, data.video);
      return await videosService.getById(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast({ title: "Video updated successfully!" });
      setIsVideoEditDialogOpen(false);
      setEditingVideo(null);
    },
    onError: (error) => {
      console.error("Error updating video:", error);
      toast({ title: "Error updating video", description: error.message, variant: "destructive" });
    }
  });

  const deleteSeriesMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete all videos in the series first
      const seriesVideos = await videosService.getBySeriesId(id);
      await Promise.all(seriesVideos.map(video => videosService.delete(video.id)));

      // Delete the series
      await seriesService.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-series"] });
      toast({ title: "Series deleted successfully!" });
    },
    onError: (error) => {
      console.error("Error deleting series:", error);
      toast({ title: "Error deleting series", description: error.message, variant: "destructive" });
    }
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const video = await videosService.getById(id);
      if (video) {
        await videosService.delete(id);

        // Update series video count
        const seriesVideos = await videosService.getBySeriesId(video.seriesId);
        await seriesService.update(video.seriesId, { 
          videoCount: seriesVideos.length 
        });
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast({ title: "Video deleted successfully!" });
    },
    onError: (error) => {
      console.error("Error deleting video:", error);
      toast({ title: "Error deleting video", description: error.message, variant: "destructive" });
    }
  });

  const handleCreateSeries = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const series: Series = {
      id: "",
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      level: formData.get("level") as string,
      videoCount: 0,
      totalDuration: "0 min",
      thumbnailUrl: formData.get("thumbnailUrl") as string,
    };

    createSeriesMutation.mutate(series);
  };

  const handleCreateVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const video: Video = {
      id: "",
      seriesId: formData.get("seriesId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoUrl: formData.get("videoUrl") as string,
      duration: formData.get("duration") as string,
      level: formData.get("level") as string,
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()).filter(Boolean),
      bannerUrl: formData.get("bannerUrl") as string,
    };

    createVideoMutation.mutate(video);
  };

  const handleEditSeries = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSeries) return;

    const formData = new FormData(event.currentTarget);

    const seriesData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      level: formData.get("level") as string,
    };

    updateSeriesMutation.mutate({
      id: editingSeries.id,
      series: seriesData,
    });
  };

  const handleEditVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingVideo) return;

    const formData = new FormData(e.currentTarget);

    const updates: Partial<Video> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      videoUrl: formData.get("videoUrl") as string,
      duration: formData.get("duration") as string,
      level: formData.get("level") as string,
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()).filter(Boolean),
      bannerUrl: formData.get("bannerUrl") as string,
    };

    updateVideoMutation.mutate({ id: editingVideo.id, video: updates });
  };

  const openEditSeries = (seriesItem: Series) => {
    setEditingSeries(seriesItem);
    setIsEditDialogOpen(true);
  };

  const openEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsVideoEditDialogOpen(true);
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-astro-navy dark:text-lunar-white mb-2">
              CypherUni Learn Admin
            </h1>
            <p className="text-cosmic-gray dark:text-gray-400">
              Manage your educational content and platform settings
            </p>
          </div>

          <Tabs defaultValue="series" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="series">Series</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="series" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Create Series Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create New Series
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateSeries} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Series Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <select
                          id="level"
                          name="level"
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
                        <Input
                          id="thumbnail"
                          name="thumbnailUrl"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-galactic-ember hover:bg-solar-orange"
                        disabled={createSeriesMutation.isPending}
                      >
                        {createSeriesMutation.isPending ? "Creating..." : "Create Series"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Series List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Series ({series?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {seriesLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {series?.map((seriesItem) => (
                          <div key={seriesItem.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <h4 className="font-medium">{seriesItem.name}</h4>
                              <p className="text-sm text-cosmic-gray">{seriesItem.videoCount} videos • {seriesItem.level}</p>
                              <p className="text-xs text-cosmic-gray line-clamp-2">{seriesItem.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditSeries(seriesItem)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Series</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{seriesItem.name}"? This action cannot be undone and will also delete all associated videos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteSeriesMutation.mutate(seriesItem.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Create Video Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5" />
                      Add New Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateVideo} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Video Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                      </div>
                      <div>
                        <Label htmlFor="seriesId">Series</Label>
                        <select
                          id="seriesId"
                          name="seriesId"
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Select a series</option>
                          {series?.map((seriesItem) => (
                            <option key={seriesItem.id} value={seriesItem.id}>
                              {seriesItem.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input 
                            id="duration" 
                            name="duration" 
                            placeholder="e.g., 15 min"
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <select
                            id="level"
                            name="level"
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input 
                          id="tags" 
                          name="tags" 
                          placeholder="git, version-control, tutorial"
                        />
                      </div>
                      <div>
                        <Label htmlFor="video-url">Video URL (Twitter/X)</Label>
                        <Input 
                          id="video-url" 
                          name="videoUrl" 
                          type="url"
                          placeholder="https://twitter.com/..."
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-url">Banner Image URL</Label>
                        <Input
                          id="banner-url"
                          name="bannerUrl"
                          type="url"
                          placeholder="https://example.com/banner.jpg"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-galactic-ember hover:bg-solar-orange"
                        disabled={createVideoMutation.isPending}
                      >
                        {createVideoMutation.isPending ? "Adding..." : "Add Video"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Videos List */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Videos ({videos?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {videosLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {videos?.map((video) => (
                          <div key={video.id} className="flex items-center justify-between p-2 border rounded text-sm">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium truncate">{video.title}</h5>
                              <p className="text-cosmic-gray text-xs">{video.duration} • {video.level}</p>
                              <div className="flex gap-1 mt-1">
                                {video.tags.slice(0, 2).map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => openEditVideo(video)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" className="h-6 w-6 p-0">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{video.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteVideoMutation.mutate(video.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Total Series
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-galactic-ember">
                      {series?.length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5" />
                      Total Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-galactic-ember">
                      {videos?.length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Avg Videos/Series</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-galactic-ember">
                      {series?.length ? Math.round((videos?.length || 0) / series.length * 10) / 10 : 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-green-100 text-green-800">
                      🟢 Online
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content by Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                        const seriesCount = series?.filter(s => s.level === level).length || 0;
                        const videoCount = videos?.filter(v => v.level === level).length || 0;
                        return (
                          <div key={level} className="flex justify-between items-center">
                            <span className="font-medium">{level}</span>
                            <div className="text-sm text-cosmic-gray">
                              {seriesCount} series • {videoCount} videos
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-cosmic-gray">
                      <p>• {series?.length || 0} series created</p>
                      <p>• {videos?.length || 0} videos uploaded</p>
                      <p>• Platform running smoothly</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Series Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Series
              </DialogTitle>
            </DialogHeader>
            {editingSeries && (
              <form onSubmit={handleEditSeries} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Series Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    defaultValue={editingSeries.name}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    defaultValue={editingSeries.description}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-level">Level</Label>
                  <select
                    id="edit-level"
                    name="level"
                    className="w-full p-2 border rounded-md"
                    defaultValue={editingSeries.level}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnailUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-galactic-ember hover:bg-solar-orange"
                    disabled={updateSeriesMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateSeriesMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Video Dialog */}
        <Dialog open={isVideoEditDialogOpen} onOpenChange={setIsVideoEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                Edit Video
              </DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <form onSubmit={handleEditVideo} className="space-y-4">
                <div>
                  <Label htmlFor="edit-video-title">Video Title</Label>
                  <Input 
                    id="edit-video-title" 
                    name="title" 
                    defaultValue={editingVideo.title}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video-description">Description</Label>
                  <Textarea 
                    id="edit-video-description" 
                    name="description" 
                    defaultValue={editingVideo.description}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video-series">Series</Label>
                  <select
                    id="edit-video-series"
                    name="seriesId"
                    className="w-full p-2 border rounded-md"
                    defaultValue={editingVideo.seriesId}
                    required
                  >
                    {series?.map((seriesItem) => (
                      <option key={seriesItem.id} value={seriesItem.id}>
                        {seriesItem.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-video-duration">Duration</Label>
                    <Input 
                      id="edit-video-duration" 
                      name="duration" 
                      defaultValue={editingVideo.duration}
                      placeholder="e.g., 15 min"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-video-level">Level</Label>
                    <select
                      id="edit-video-level"
                      name="level"
                      className="w-full p-2 border rounded-md"
                      defaultValue={editingVideo.level}
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-video-tags">Tags (comma-separated)</Label>
                  <Input 
                    id="edit-video-tags" 
                    name="tags" 
                    defaultValue={editingVideo.tags.join(", ")}
                    placeholder="git, version-control, tutorial"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video-url">Video URL (Twitter/X)</Label>
                  <Input 
                    id="edit-video-url" 
                    name="videoUrl" 
                    type="url"
                    defaultValue={editingVideo.videoUrl}
                    placeholder="https://twitter.com/..."
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnailUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video-banner">Update Banner (optional)</Label>
                  <Input
                    id="edit-video-banner"
                    name="bannerUrl"
                    type="url"
                    defaultValue={editingVideo.bannerUrl}
                    placeholder="https://example.com/banner.jpg"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-galactic-ember hover:bg-solar-orange"
                    disabled={updateVideoMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateVideoMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsVideoEditDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminAuth>
  );
}