import { type Series, type InsertSeries, type Video, type InsertVideo, type Feedback, type InsertFeedback } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Series operations
  getAllSeries(): Promise<Series[]>;
  getSeriesById(id: string): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;
  
  // Video operations
  getVideosBySeriesId(seriesId: string): Promise<Video[]>;
  getVideoById(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Feedback operations
  getFeedbackByVideoId(videoId: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private series: Map<string, Series>;
  private videos: Map<string, Video>;
  private feedback: Map<string, Feedback>;

  constructor() {
    this.series = new Map();
    this.videos = new Map();
    this.feedback = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample series data
    const sampleSeries: Series[] = [
      {
        id: "github-series",
        name: "GitHub Series",
        description: "Master version control with GitHub. Learn branching, pull requests, and collaboration workflows.",
        thumbnailUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalDuration: "2h 15m",
        level: "Beginner",
        videoCount: 8
      },
      {
        id: "no-code-series",
        name: "No/Low Code Tools",
        description: "Build powerful applications without traditional coding. Explore Zapier, Airtable, and more.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalDuration: "3h 45m",
        level: "Beginner",
        videoCount: 12
      },
      {
        id: "extensions-series",
        name: "Essential Dev Extensions",
        description: "Supercharge your development workflow with must-have VS Code extensions and browser tools.",
        thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalDuration: "1h 30m",
        level: "Intermediate",
        videoCount: 6
      },
      {
        id: "notion-series",
        name: "Notion Basics",
        description: "Organize your life and projects with Notion. Learn databases, templates, and advanced features.",
        thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalDuration: "2h 50m",
        level: "Beginner",
        videoCount: 10
      },
      {
        id: "intro-coding-series",
        name: "Intro to Coding",
        description: "Start your coding journey from zero. Learn programming concepts, logic, and your first language.",
        thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalDuration: "4h 20m",
        level: "Beginner",
        videoCount: 15
      },
      {
        id: "web-dev-series",
        name: "Web Dev Fundamentals",
        description: "Build your first websites with HTML, CSS, and JavaScript. Learn responsive design and modern practices.",
        thumbnailUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        totalDuration: "6h 15m",
        level: "Beginner",
        videoCount: 20
      }
    ];

    sampleSeries.forEach(s => this.series.set(s.id, s));

    // Initialize with sample videos for GitHub series
    const sampleVideos: Video[] = [
      {
        id: "github-intro",
        seriesId: "github-series",
        title: "Introduction to GitHub",
        videoUrl: "https://twitter.com/sample/status/123456789",
        bannerUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        description: "Learn what GitHub is, why developers use it, and how it fits into modern software development workflows.",
        duration: "15:30",
        level: "Beginner",
        tags: ["Version Control", "Collaboration", "Open Source", "Portfolio"]
      },
      {
        id: "git-basics",
        seriesId: "github-series",
        title: "Git Basics: Clone, Add, Commit",
        videoUrl: "https://twitter.com/sample/status/123456790",
        bannerUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        description: "Master the fundamental Git commands every developer needs: cloning repositories, staging changes, and making commits.",
        duration: "18:45",
        level: "Beginner",
        tags: ["Git", "Commands", "Terminal", "Workflow"]
      },
      {
        id: "branching-merging",
        seriesId: "github-series",
        title: "Branching and Merging",
        videoUrl: "https://twitter.com/sample/status/123456791",
        bannerUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        description: "Understand Git branching strategies, create feature branches, and learn how to merge changes safely.",
        duration: "22:10",
        level: "Beginner",
        tags: ["Branching", "Merging", "Git Flow", "Collaboration"]
      }
    ];

    sampleVideos.forEach(v => this.videos.set(v.id, v));
  }

  async getAllSeries(): Promise<Series[]> {
    return Array.from(this.series.values());
  }

  async getSeriesById(id: string): Promise<Series | undefined> {
    return this.series.get(id);
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const id = randomUUID();
    const series: Series = { ...insertSeries, id, videoCount: 0 };
    this.series.set(id, series);
    return series;
  }

  async getVideosBySeriesId(seriesId: string): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.seriesId === seriesId);
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo, 
      id,
      tags: insertVideo.tags || []
    };
    this.videos.set(id, video);
    
    // Update video count for the series
    const series = this.series.get(insertVideo.seriesId);
    if (series) {
      series.videoCount += 1;
      this.series.set(insertVideo.seriesId, series);
    }
    
    return video;
  }

  async getFeedbackByVideoId(videoId: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values())
      .filter(f => f.videoId === videoId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = { 
      ...insertFeedback, 
      id, 
      timestamp: new Date() 
    };
    this.feedback.set(id, feedback);
    return feedback;
  }
}

export const storage = new MemStorage();
