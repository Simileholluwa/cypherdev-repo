import { useEffect, useRef } from "react";

export default function StardustBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const starCount = 50;

    // Clear existing stars
    container.innerHTML = "";

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.width = Math.random() * 3 + 1 + "px";
      star.style.height = star.style.width;
      star.style.animationDelay = Math.random() * 3 + "s";
      star.style.animationDuration = Math.random() * 3 + 2 + "s";
      container.appendChild(star);
    }
  }, []);

  return <div ref={containerRef} className="stardust-bg" />;
}
