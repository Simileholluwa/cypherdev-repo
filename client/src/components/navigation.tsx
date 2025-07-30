import { useLocation } from "wouter";
import { Link } from "wouter";
import { Rocket, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { AdminButton } from "./admin-auth";

export default function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const getBreadcrumb = () => {
    if (location === "/") return "Home";
    if (location.startsWith("/series/")) return "Home › Series";
    if (location.startsWith("/video/")) return "Home › Series › Video";
    return "Home";
  };

  return (
    <nav className="bg-lunar-white border-b border-gray-200 sticky top-0 z-50 shadow-sm dark:bg-astro-navy dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold text-astro-navy dark:text-lunar-white">CypherUni Learn</h1>
          </Link>
          
          {/* Breadcrumb Navigation */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-cosmic-gray dark:text-gray-400">{getBreadcrumb()}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Admin Button */}
            <AdminButton />
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-lunar-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors border-0 shadow-sm"
            >
              {theme === "light" ? (
                <Moon className="text-cosmic-gray w-5 h-5" />
              ) : (
                <Sun className="text-yellow-500 w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
