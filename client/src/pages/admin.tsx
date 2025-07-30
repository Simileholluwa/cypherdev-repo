import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAuth } from "../components/admin-auth";
import { Plus, Edit, Trash2, Upload, VideoIcon, Users } from "lucide-react";
import { seriesService, videosService } from "../lib/firestore";
import { storageService } from "../lib/firebase-storage";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { type Series, type Video } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: series, isLoading: seriesLoading } = useQuery({
    queryKey: ["admin-series"],
    queryFn: () => seriesService.getAll(),
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: () => videosService.getAll(),
  });

  const createSeriesMutation = useMutation({
    mutationFn: async (data: { series: Omit<Series, 'id'>; thumbnail?: File }) => {
      let thumbnailUrl = "";
      if (data.thumbnail) {
        const tempId = Date.now().toString();
        thumbnailUrl = await storageService.uploadSeriesThumbnail(data.thumbnail, tempId);
      }
      return await seriesService.create({
        ...data.series,
        thumbnailUrl: thumbnailUrl || "https://via.placeholder.com/400x300?text=No+Image"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-series"] });
      toast({ title: "Series created successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error creating series", description: error.message, variant: "destructive" });
    }
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: { video: Omit<Video, 'id'>; banner?: File }) => {
      let bannerUrl = "";
      if (data.banner) {
        const tempId = Date.now().toString();
        bannerUrl = await storageService.uploadVideoBanner(data.banner, tempId);
      }
      return await videosService.create({
        ...data.video,
        bannerUrl: bannerUrl || "https://via.placeholder.com/400x200?text=No+Image"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast({ title: "Video created successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error creating video", description: error.message, variant: "destructive" });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCreateSeries = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const seriesData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      level: formData.get("level") as string,
      videoCount: 0,
      totalDuration: "0 min",
      thumbnailUrl: "https://via.placeholder.com/400x300?text=No+Image",
    };

    createSeriesMutation.mutate({
      series: seriesData,
      thumbnail: selectedFile || undefined
    });

    event.currentTarget.reset();
    setSelectedFile(null);
  };

  const handleCreateVideo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const videoData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      seriesId: formData.get("seriesId") as string,
      duration: formData.get("duration") as string,
      level: formData.get("level") as string,
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()).filter(Boolean),
      videoUrl: formData.get("videoUrl") as string,
      bannerUrl: "https://via.placeholder.com/400x200?text=No+Image",
    };

    createVideoMutation.mutate({
      video: videoData,
      banner: selectedFile || undefined
    });

    event.currentTarget.reset();
    setSelectedFile(null);
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
                        <Label htmlFor="thumbnail">Thumbnail Image</Label>
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
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
                            <div>
                              <h4 className="font-medium">{seriesItem.name}</h4>
                              <p className="text-sm text-cosmic-gray">{seriesItem.videoCount} videos</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                        <Label htmlFor="videoUrl">Video URL (Twitter/X)</Label>
                        <Input 
                          id="videoUrl" 
                          name="videoUrl" 
                          type="url"
                          placeholder="https://twitter.com/..."
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner">Banner Image</Label>
                        <Input
                          id="banner"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
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
                              <p className="text-cosmic-gray text-xs">{video.duration}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" className="h-6 w-6 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
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
              <div className="grid md:grid-cols-3 gap-6">
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
                    <CardTitle>Platform Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-green-100 text-green-800">
                      🟢 Online
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminAuth>
  );
}