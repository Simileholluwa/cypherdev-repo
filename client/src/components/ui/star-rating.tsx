import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
}

export default function StarRating({ value, onChange, className }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div 
      className={cn("flex gap-1", className)}
      onMouseLeave={() => setHoveredRating(0)}
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={cn(
            "text-2xl transition-colors",
            (hoveredRating >= rating || value >= rating)
              ? "text-galactic-ember"
              : "text-gray-300 hover:text-galactic-ember"
          )}
          onMouseEnter={() => setHoveredRating(rating)}
          onClick={() => onChange(rating)}
        >
          <Star className="w-6 h-6 fill-current" />
        </button>
      ))}
    </div>
  );
}
