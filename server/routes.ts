import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Series endpoints
  app.get("/api/series", async (req, res) => {
    try {
      const series = await storage.getAllSeries();
      res.json(series);
    } catch (error) {
      console.error("Error fetching series:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/series/:id", async (req, res) => {
    try {
      const series = await storage.getSeriesById(req.params.id);
      if (!series) {
        return res.status(404).json({ error: "Series not found" });
      }
      res.json(series);
    } catch (error) {
      console.error("Error fetching series:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/series", async (req, res) => {
    try {
      const series = await storage.createSeries(req.body);
      res.status(201).json(series);
    } catch (error) {
      console.error("Error creating series:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/series/:id", async (req, res) => {
    try {
      const series = await storage.updateSeries(req.params.id, req.body);
      if (!series) {
        return res.status(404).json({ error: "Series not found" });
      }
      res.json(series);
    } catch (error) {
      console.error("Error updating series:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/series/:id", async (req, res) => {
    try {
      const success = await storage.deleteSeries(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Series not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting series:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/series/:id/videos", async (req, res) => {
    try {
      const videos = await storage.getVideosBySeriesId(req.params.id);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Video endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const video = await storage.createVideo(req.body);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.updateVideo(req.params.id, req.body);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const success = await storage.deleteVideo(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Feedback endpoints
  app.get("/api/videos/:id/feedback", async (req, res) => {
    try {
      const feedback = await storage.getFeedbackByVideoId(req.params.id);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/videos/:id/feedback", async (req, res) => {
    try {
      const feedback = await storage.createFeedback({
        videoId: req.params.id,
        ...req.body,
      });
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}