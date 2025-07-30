import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Play, Clock, User, MessageCircle, Send } from "lucide-react";
// Using MessageCircle from lucide-react for X/Twitter icon
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type Video as VideoType, type Feedback, type Series } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import StarRating from "@/components/ui/star-rating";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

const feedbackFormSchema = insertFeedbackSchema.extend({
  cHandle: z.string().min(1, "X handle is required"),
  message: z.string().min(10, "Feedback must be at least 10 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function Video() {
  const [match, params] = useRoute("/video/:videoId");
  const videoId = params?.videoId;
  const { toast } = useToast();

  const { data: video, isLoading: videoLoading } = useQuery<VideoType>({
    queryKey: ["/api/videos", videoId],
    enabled: !!videoId,
  });

  const { data: series } = useQuery<Series>({
    queryKey: ["/api/series", video?.seriesId],
    enabled: !!video?.seriesId,
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/videos", videoId, "feedback"],
    enabled: !!videoId,
  });

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      cHandle: "",
      message: "",
      rating: 0,
      videoId: videoId || "",
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await apiRequest("POST", `/api/videos/${videoId}/feedback`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback. It helps us improve our content.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/videos", videoId, "feedback"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    feedbackMutation.mutate(data);
  };

  if (videoLoading) {
    return (
      <div className="page-transition">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-lunar-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="page-transition">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-astro-navy mb-4">Video not found</h1>
          <Link href="/">
            <Button className="bg-galactic-ember hover:bg-solar-orange">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/" className="text-cosmic-gray hover:text-astro-navy transition-colors mr-2">
          Home
        </Link>
        <span className="text-cosmic-gray mx-2">›</span>
        {series && (
          <>
            <Link 
              href={`/series/${series.id}`} 
              className="text-cosmic-gray hover:text-astro-navy transition-colors mr-2"
            >
              {series.name}
            </Link>
            <span className="text-cosmic-gray mx-2">›</span>
          </>
        )}
        <span className="text-astro-navy">{video.title}</span>
      </div>

      {/* Video Content */}
      <div className="bg-lunar-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-astro-navy mb-4">{video.title}</h1>
        
        {/* Video Banner */}
        <div className="mb-6">
          <img 
            src={video.bannerUrl} 
            alt={`${video.title} Video Banner`}
            className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-xl shadow-glow"
          />
        </div>

        {/* Video Embed Placeholder */}
        <div className="bg-gray-100 rounded-xl p-4 sm:p-6 lg:p-8 text-center mb-6">
          <Play className="mx-auto text-4xl sm:text-6xl text-galactic-ember mb-4" />
          <p className="text-cosmic-gray mb-4 text-sm sm:text-base">Click to watch on X (Twitter)</p>
          <Button className="bg-galactic-ember hover:bg-solar-orange shadow-glow w-full sm:w-auto">
            <MessageCircle className="w-4 h-4 mr-2" />
            Watch Video
          </Button>
        </div>

        {/* Video Description */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-astro-navy mb-3">What You'll Learn</h3>
          <p className="text-cosmic-gray mb-4">{video.description}</p>
          <div className="flex flex-wrap gap-2">
            {video.tags?.map((tag) => (
              <p key={tag} className="bg-galactic-ember/10 text-galactic-ember text-xs">
                {tag}
              </p>
            ))}
          </div>
        </div>

        {/* Video Stats */}
        <div className="flex items-center gap-6 text-xs text-cosmic-gray">
          <span>
            <Clock className="w-4 h-4 mr-1 inline" />
            {video.duration} duration
          </span>
          <span>
            <User className="w-4 h-4 mr-1 inline" />
            {video.level} level
          </span>
          <span>
            <MessageCircle className="w-4 h-4 mr-1 inline" />
            {feedback?.length || 0} feedback
          </span>
        </div>
      </div>

      {/* Anonymous Feedback Section */}
      <div className="bg-lunar-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-astro-navy mb-6">
          Share Your Feedback
        </h3>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <Label htmlFor="cHandle" className="text-sm font-medium text-astro-navy mb-2 block">
                X (Twitter) Handle
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-gray">
                  @
                </span>
                <Input
                  id="cHandle"
                  placeholder="yourusername"
                  className="pl-8 bg-white border-gray-200 focus:ring-galactic-ember focus:border-galactic-ember"
                  {...form.register("cHandle")}
                />
              </div>
              {form.formState.errors.cHandle && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cHandle.message}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-astro-navy mb-2 block">Rating</Label>
              <StarRating
                value={form.watch("rating")}
                onChange={(rating) => form.setValue("rating", rating)}
                className="justify-start"
              />
              {form.formState.errors.rating && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.rating.message}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="message" className="text-sm font-medium text-astro-navy mb-2 block">
              Your Feedback
            </Label>
            <Textarea
              id="message"
              placeholder="Share your thoughts, questions, or suggestions about this video..."
              className="bg-white border-gray-200 focus:ring-galactic-ember focus:border-galactic-ember resize-none h-24 sm:h-32"
              {...form.register("message")}
            />
            {form.formState.errors.message && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={feedbackMutation.isPending}
            className="bg-galactic-ember hover:bg-solar-orange shadow-glow w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>

      {/* Feedback List */}
      <div className="bg-lunar-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
        <h3 className="text-xl sm:text-2xl font-semibold text-astro-navy mb-6">
          {feedback?.length || 0} Community Feedback
        </h3>
        
        {feedbackLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border-b border-gray-100 pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : feedback?.length ? (
          <div className="space-y-6">
            {feedback.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 sm:pb-6 last:border-b-0">
                <div className="flex items-start gap-3 sm:gap-4">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                      <span className="font-medium text-astro-navy text-sm sm:text-base">@{item.cHandle}</span>
                      <div className="flex text-galactic-ember text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < item.rating ? "text-galactic-ember" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-cosmic-gray">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-cosmic-gray text-sm sm:text-base break-words">{item.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-2">
            <p className="text-cosmic-gray">No feedback yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
