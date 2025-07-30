import { Router } from "express";
import { seriesService, videosService, feedbackService } from "../client/src/lib/firestore";

const router = Router();

// Series routes
router.get("/series", async (req, res) => {
  try {
    const series = await seriesService.getAll();
    res.json(series);
  } catch (error) {
    console.error("Error fetching series:", error);
    res.status(500).json({ error: "Failed to fetch series" });
  }
});

router.get("/series/:id", async (req, res) => {
  try {
    const series = await seriesService.getById(req.params.id);
    if (!series) {
      return res.status(404).json({ error: "Series not found" });
    }
    res.json(series);
  } catch (error) {
    console.error("Error fetching series:", error);
    res.status(500).json({ error: "Failed to fetch series" });
  }
});

// Videos routes
router.get("/series/:seriesId/videos", async (req, res) => {
  try {
    const videos = await videosService.getBySeriesId(req.params.seriesId);
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

router.get("/videos/:id", async (req, res) => {
  try {
    const video = await videosService.getById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

// Feedback routes
router.get("/videos/:videoId/feedback", async (req, res) => {
  try {
    const feedback = await feedbackService.getByVideoId(req.params.videoId);
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

router.post("/videos/:videoId/feedback", async (req, res) => {
  try {
    const feedbackId = await feedbackService.create({
      videoId: req.params.videoId,
      ...req.body
    });
    res.json({ id: feedbackId, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

export default router;