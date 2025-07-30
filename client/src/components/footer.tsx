import { SiYoutube, SiGithub, SiDiscord, SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand and Credits */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-astro-navy dark:text-lunar-white">CypherDev Repo</span>
            </div>
            <p className="text-sm text-cosmic-gray dark:text-gray-400 text-center md:text-left">
              Built with ❤️ for aspiring developers everywhere
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-cosmic-gray dark:text-gray-400 hover:text-galactic-ember transition-colors">
              <SiX className="w-4 h-4" />
            </a>
            <a href="#" className="text-cosmic-gray dark:text-gray-400 hover:text-galactic-ember transition-colors">
              <SiYoutube className="w-5 h-5" />
            </a>
            <a href="#" className="text-cosmic-gray dark:text-gray-400 hover:text-galactic-ember transition-colors">
              <SiGithub className="w-5 h-5" />
            </a>
            <a href="#" className="text-cosmic-gray dark:text-gray-400 hover:text-galactic-ember transition-colors">
              <SiDiscord className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
          <p className="text-sm text-cosmic-gray dark:text-gray-400">
            &copy; 2024 CypherUni Learn. Launching careers into the coding cosmos.
          </p>
        </div>
      </div>
    </footer>
  );
}
