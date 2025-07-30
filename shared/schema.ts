import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const series = pgTable("series", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  totalDuration: text("total_duration").notNull(),
  level: text("level").notNull(),
  videoCount: integer("video_count").notNull().default(0),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey(),
  seriesId: varchar("series_id").notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  bannerUrl: text("banner_url").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  tags: text("tags").array().notNull().default([]),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull(),
  cHandle: text("c_handle").notNull(),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSeriesSchema = createInsertSchema(series).omit({
  id: true,
  videoCount: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  timestamp: true,
});

export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Series = typeof series.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
