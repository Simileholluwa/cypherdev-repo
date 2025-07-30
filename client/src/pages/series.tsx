import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  Clock,
  User,
  Video,
  Play,
  MessageCircle,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Series, type Video as VideoType } from "@shared/schema";

export default function Series() {
  const [match, params] = useRoute("/series/:seriesId");
  const seriesId = params?.seriesId;

  const { data: series, isLoading: seriesLoading } = useQuery<Series>({
    queryKey: ["/api/series", seriesId],
    enabled: !!seriesId,
  });

  const { data: videos, isLoading: videosLoading } = useQuery<VideoType[]>({
    queryKey: ["/api/series", seriesId, "videos"],
    enabled: !!seriesId,
  });

  if (seriesLoading || videosLoading) {
    return (
      <div className="page-transition">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="bg-lunar-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="page-transition">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-astro-navy mb-4">
            Series not found
          </h1>
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
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-cosmic-gray hover:text-astro-navy mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Series
          </Button>
        </Link>

        {/* Series Header */}
        <div className="bg-lunar-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-astro-navy mb-4">
                {series.name}
              </h1>
              <p className="text-cosmic-gray text-base sm:text-lg mb-6">
                {series.description}
              </p>
              <div className="flex flex-wrap gap-1 text-sm">
                <p className=" flex bg-galactic-ember/10 text-galactic-ember">
                  {series.videoCount} videos •
                </p>
                <p className="flex bg-galactic-ember/10 text-galactic-ember">
                  {series.totalDuration} total •
                </p>
                <p className="flex bg-galactic-ember/10 text-galactic-ember">
                  {series.level} Level
                </p>
              </div>
            </div>
            <div className="w-full lg:w-80">
              <img
                src={series.thumbnailUrl}
                alt={`${series.name} Header`}
                className="w-full h-48 object-cover rounded-xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="rounded-xl space-y-4">
        {videos?.map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <Card className="bg-lunar-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardContent className="p-4 sm:p-6 bg-lunar-white">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
                  <div className="w-full md:w-48 flex-shrink-0">
                    <img
                      src={video.bannerUrl}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-astro-navy group-hover:text-galactic-ember transition-colors">
                        {video.title}
                      </h3>
                      <h4 className="bg-galactic-ember/10 text-galactic-ember border-0 w-fit">
                        {video.duration}
                      </h4>
                    </div>
                    <p className="text-cosmic-gray mb-3 text-sm sm:text-base">
                      {video.description}
                    </p>
                    <div className="ml-0 flex items-center gap-3 mb-3">
                      {video.tags?.map((tag) => (
                        <p
                          key={tag}
                          className="bg-solar-orange/10 text-solar-orange border-0 text-xs"
                        >
                          {tag}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-cosmic-gray">
                      <span className="flex items-center">
                        <Play className="w-3 h-3 mr-1" />
                        Watch on X
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        View feedback
                      </span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {video.level}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {videos?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-cosmic-gray text-lg">
            No videos found in this series yet.
          </p>
        </div>
      )}
    </div>
  );
}
