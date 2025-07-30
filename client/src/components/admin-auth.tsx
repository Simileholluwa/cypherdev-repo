import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-galactic-ember mx-auto mb-4"></div>
          <p className="text-cosmic-gray">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/sign-in");
    return null;
  }

  // Check if user is admin (you can customize this logic)
  const isAdmin = user.email?.endsWith("@cypheruni.com");

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-2xl font-bold text-astro-navy dark:text-lunar-white">
              Access Denied
            </CardTitle>
            <p className="text-cosmic-gray dark:text-gray-400">
              You don't have permission to access the admin panel.
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-galactic-ember hover:bg-solar-orange"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}



export function AdminButton() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    return (
      <Button 
        onClick={() => setLocation("/sign-in")}
        variant="outline"
        size="sm"
        className="border-galactic-ember text-galactic-ember hover:bg-galactic-ember hover:text-white"
      >
        <Shield className="mr-2 h-4 w-4" />
        Admin
      </Button>
    );
  }

  const isAdmin = user?.email?.endsWith("@cypheruni.com");
  
  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-cosmic-gray">Admin: {user.email}</span>
        <Button 
          onClick={signOut}
          variant="outline"
          size="sm"
          className="border-galactic-ember text-galactic-ember hover:bg-galactic-ember hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
}