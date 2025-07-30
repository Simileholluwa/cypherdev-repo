import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const { user, loading, isAdmin, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-galactic-ember"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="mx-auto h-12 w-12 text-galactic-ember mb-4" />
            <CardTitle className="text-2xl font-bold text-astro-navy">Admin Access Required</CardTitle>
            <p className="text-cosmic-gray">
              You need admin privileges to access this area
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={signInWithGoogle}
              className="w-full bg-galactic-ember hover:bg-solar-orange"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
            {user && !isAdmin && (
              <p className="text-sm text-red-500 mt-4 text-center">
                Your account doesn't have admin privileges
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="bg-galactic-ember text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Admin Panel</span>
            <span className="text-sm opacity-80">Welcome, {user.displayName}</span>
          </div>
          <Button 
            onClick={signOut}
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white hover:text-galactic-ember"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}

export function AdminButton() {
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();

  if (!user) {
    return (
      <Button 
        onClick={signInWithGoogle}
        variant="outline"
        size="sm"
        className="border-galactic-ember text-galactic-ember hover:bg-galactic-ember hover:text-white"
      >
        <Shield className="mr-2 h-4 w-4" />
        Admin
      </Button>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-cosmic-gray">Admin: {user.displayName}</span>
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