import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Series from "./pages/series";
import Video from "./pages/video";
import Admin from "./pages/admin";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import StardustBackground from "./components/stardust-background";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/series/:seriesId" component={Series} />
      <Route path="/video/:videoId" component={Video} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StardustBackground />
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              <Router />
            </main>
            <Footer />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
