import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Clock, User, Video, Filter, TrendingUp, Calendar, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Series } from "@shared/schema";
import { useState, useMemo } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const { data: series, isLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const filteredAndSortedSeries = useMemo(() => {
    if (!series) return [];
    
    let filtered = series.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === "all" || s.level.toLowerCase() === levelFilter.toLowerCase();
      return matchesSearch && matchesLevel;
    });

    // Sort series
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.videoCount - a.videoCount;
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "duration":
          // Simple duration comparison - could be enhanced with proper parsing
          return b.totalDuration.localeCompare(a.totalDuration);
        default:
          return 0;
      }
    });

    return filtered;
  }, [series, searchTerm, levelFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="page-transition">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-astro-navy mb-4">
            Learn to Code in the <span className="text-galactic-ember">Cosmos</span>
          </h1>
          <p className="text-xl text-cosmic-gray max-w-3xl mx-auto">
            Explore our galaxy of coding tutorials, from GitHub basics to advanced development tools. 
            Start your cosmic coding journey today!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-lunar-white border-gray-200">
              <div className="h-48 bg-gray-200 rounded-t-xl"></div>
              <CardContent className="p-6 bg-lunar-white">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-astro-navy mb-4">
          Learn to Code in the <span className="text-galactic-ember">Cosmos</span>
        </h1>
        <p className="text-lg sm:text-xl text-cosmic-gray max-w-3xl mx-auto">
          Explore our galaxy of coding tutorials, from GitHub basics to advanced development tools. 
          Start your cosmic coding journey today!
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-gray w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for series, topics, or technologies..."
            className="pl-12 h-12 text-lg bg-lunar-white border-gray-200 focus:ring-galactic-ember focus:border-galactic-ember rounded-xl shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-between">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 bg-lunar-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-lunar-white border-gray-200">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 bg-lunar-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-lunar-white border-gray-200">
                  <SelectItem value="popularity">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Popular
                    </div>
                  </SelectItem>
                  <SelectItem value="alphabetical">
                    <div className="flex items-center gap-2">
                      <span>🔤</span>
                      A-Z
                    </div>
                  </SelectItem>
                  <SelectItem value="duration">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-cosmic-gray text-center sm:text-right">
            Showing {filteredAndSortedSeries.length} of {series?.length || 0} series
          </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedSeries.map((seriesItem) => (
          <Link key={seriesItem.id} href={`/series/${seriesItem.id}`}>
            <Card className="bg-lunar-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full group">
              <div className="h-48 overflow-hidden rounded-t-xl">
                <img 
                  src={seriesItem.thumbnailUrl} 
                  alt={`${seriesItem.name} Banner`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 sm:p-6 bg-lunar-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-astro-navy line-clamp-2 group-hover:text-galactic-ember transition-colors">{seriesItem.name}</h3>
                  <Badge className="bg-galactic-ember/10 text-galactic-ember hover:bg-galactic-ember/20 ml-2 flex-shrink-0 border-0">
                    {seriesItem.videoCount} videos                     
                  </Badge>
                </div>
                <p className="text-cosmic-gray mb-4 text-sm sm:text-base line-clamp-3">{seriesItem.description}</p>
                <div className="flex flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-cosmic-gray">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {seriesItem.totalDuration}
                    </span>
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {seriesItem.level}
                    </span>
                  </div>
                  {seriesItem.videoCount > 5 && (
                    <Badge className="bg-solar-orange/10 text-solar-orange border-0 text-xs w-fit">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredAndSortedSeries.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mb-4">
            <Search className="mx-auto w-16 h-16 text-cosmic-gray/50" />
          </div>
          <h3 className="text-xl font-semibold text-astro-navy mb-2">No series found</h3>
          <p className="text-cosmic-gray mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm("");
              setLevelFilter("all");
              setSortBy("popularity");
            }}
            variant="outline"
            className="border-galactic-ember text-galactic-ember hover:bg-galactic-ember hover:text-white"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
