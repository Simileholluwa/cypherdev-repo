import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Series from "@/pages/series";
import Video from "@/pages/video";
import NotFound from "@/pages/not-found";
import SignIn from "@/pages/sign-in";
import Admin from "@/pages/admin";
import { queryClient } from "@/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-gradient-to-br from-stellar-void via-cosmic-blue to-deep-space text-lunar-white">
          <Switch>
            <Route path="/sign-in" component={SignIn} />
            <Route path="/admin" component={Admin} />
            <Route path="*">
              <Navigation />
              <main className="flex-1">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/series/:id" component={Series} />
                  <Route path="/video/:id" component={Video} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              <Footer />
            </Route>
          </Switch>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}