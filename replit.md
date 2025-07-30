# CypherUni Learn - Video Learning Platform

## Overview

CypherUni Learn is a full-stack web application for hosting and managing video learning content. It features a modern React frontend with a Node.js/Express backend, designed as a video tutorial platform with series organization, video playback, and user feedback capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Space-themed color palette without bluish appearances, centered filter buttons, clean card designs matching the overall app theme.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom space-themed design tokens
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **API Design**: RESTful API with JSON responses

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type sharing between frontend and backend
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Tables**: 
  - `series` - Video series/courses
  - `videos` - Individual videos within series
  - `feedback` - User feedback and ratings for videos

## Key Components

### Frontend Components
- **Pages**: Home, Series detail, Video player, 404 error page
- **UI Components**: Comprehensive shadcn/ui component library (40+ components)
- **Custom Components**: Star rating, stardust background animation
- **Layout**: Navigation header, footer, responsive design

### Backend Components
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **API Routes**: Series management, video retrieval, feedback collection
- **Middleware**: Request logging, error handling, JSON parsing

### Shared Components
- **Schema**: Drizzle schema definitions with Zod validation
- **Type Safety**: Full TypeScript integration across frontend and backend

## Data Flow

1. **Content Browsing**: Users browse video series on the home page
2. **Series Navigation**: Users select a series to view its videos
3. **Video Playback**: Users watch individual videos with embedded players
4. **Feedback Collection**: Users can rate and provide feedback on videos
5. **Data Persistence**: All interactions are stored in PostgreSQL database

### API Endpoints
- `GET /api/series` - Fetch all series
- `GET /api/series/:id` - Fetch specific series
- `GET /api/series/:seriesId/videos` - Fetch videos for a series
- `GET /api/videos/:id` - Fetch specific video
- `GET /api/videos/:videoId/feedback` - Fetch video feedback
- `POST /api/videos/:videoId/feedback` - Submit video feedback

## External Dependencies

### Frontend Dependencies
- **UI Library**: Radix UI primitives for accessible components
- **Icons**: Lucide React and React Icons
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for content sliders
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Validation**: Zod for runtime type checking
- **Session**: connect-pg-simple for PostgreSQL session storage

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Development**: tsx for TypeScript execution, Replit-specific plugins

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR (Hot Module Replacement)
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Neon Database serverless PostgreSQL instance

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Serving**: Express serves built frontend assets in production
4. **Database**: Production uses same Neon Database instance

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Node Environment**: Differentiated development and production modes
- **Asset Serving**: Conditional Vite dev server or static file serving

### Replit Integration
- **Development**: Replit-specific Vite plugins for enhanced development experience
- **Deployment**: Built-in Replit deployment with Node.js runtime
- **Database**: Neon Database integration for serverless PostgreSQL

## Recent Changes (July 30, 2025)

### UI/UX Enhancements
- Removed navbar glass effect for cleaner design
- Simplified footer with social links and centered layout
- Added functional dark/light theme toggle with persistent storage
- Enhanced search functionality with level filtering and sorting options
- Improved mobile responsiveness across all pages
- Fixed card colors to match space theme (removed bluish appearances)
- Centered filter buttons and improved layout consistency
- Added smooth hover animations and transitions

### Advanced Features Added
- Level-based filtering (Beginner, Intermediate, Advanced)
- Sorting options (Popularity, Alphabetical, Duration)
- Enhanced search with real-time filtering
- Mobile-optimized video feedback forms
- Better loading states with themed skeleton components
- Dark mode support throughout the application

## Architecture Decisions

### Monorepo Structure
**Problem**: Managing shared types and schemas between frontend and backend
**Solution**: Shared directory with common TypeScript definitions
**Rationale**: Ensures type safety across the full stack while maintaining code organization

### Storage Abstraction
**Problem**: Flexible data storage options for development and production
**Solution**: IStorage interface with pluggable implementations
**Rationale**: Allows easy switching between in-memory development storage and production database

### Session Management
**Problem**: User session persistence across requests
**Solution**: PostgreSQL-backed sessions using connect-pg-simple
**Rationale**: Leverages existing database infrastructure for scalable session storage

### Form Validation
**Problem**: Type-safe form handling with validation
**Solution**: React Hook Form with Zod schema validation
**Rationale**: Provides excellent developer experience with runtime type checking

### Theme System
**Problem**: Supporting light and dark modes consistently
**Solution**: React Context-based theme provider with localStorage persistence
**Rationale**: Provides seamless theme switching with user preference persistence