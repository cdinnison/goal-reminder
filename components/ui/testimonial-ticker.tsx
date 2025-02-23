"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  country: string;
  flag: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "These daily reminders kept me consistent with my workout routine for 6 months straight!",
    country: "United States",
    flag: "🇺🇸"
  },
  {
    quote: "Simple yet effective. Helped me build a daily meditation practice.",
    country: "Canada",
    flag: "🇨🇦"
  },
  {
    quote: "Lost 15kg in 4 months thanks to these consistent reminders!",
    country: "United Kingdom",
    flag: "🇬🇧"
  },
  {
    quote: "Finally finished writing my book with daily writing reminders.",
    country: "Germany",
    flag: "🇩🇪"
  },
  {
    quote: "Learned Spanish in 6 months with daily practice reminders!",
    country: "France",
    flag: "🇫🇷"
  },
  {
    quote: "Saved $10k by tracking my expenses daily.",
    country: "India",
    flag: "🇮🇳"
  }
];

export function TestimonialTicker() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const isHoveredRef = useRef(false);
  const currentPositionRef = useRef(0);

  const animate = useCallback(() => {
    if (!scrollerRef.current) return;
    
    const scrollerContent = scrollerRef.current.querySelector('[role="marquee"]') as HTMLDivElement;
    if (!scrollerContent) return;

    if (!isHoveredRef.current) {
      const scrollWidth = scrollerContent.scrollWidth / 2;
      currentPositionRef.current = currentPositionRef.current <= -scrollWidth 
        ? 0 
        : currentPositionRef.current - 0.3;
      
      scrollerContent.style.transform = `translateX(${currentPositionRef.current}px)`;
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!scrollerRef.current) return;

    // Clone testimonials for seamless loop
    const scrollerContent = scrollerRef.current.querySelector('[role="marquee"]') as HTMLDivElement;
    if (!scrollerContent) return;

    const items = Array.from(scrollerContent.children);
    items.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerContent.appendChild(duplicatedItem);
    });

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Event listeners with passive option for better performance
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    const scroller = scrollerRef.current;
    scroller.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    scroller.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scroller.removeEventListener("mouseenter", handleMouseEnter);
      scroller.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animate]);

  return (
    <div 
      ref={scrollerRef}
      className="relative flex w-full overflow-hidden py-3"
      aria-label="Testimonials ticker"
    >
      <div 
        role="marquee"
        className={cn(
          "flex gap-4 whitespace-nowrap will-change-transform",
          "motion-reduce:animate-none" // Respect user's reduced motion preference
        )}
      >
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 bg-white px-4 py-1 text-sm font-normal text-gray-500 font-departure"
            aria-label={`Testimonial from ${testimonial.country}`}
          >
            <span className="text-base" aria-hidden="true">{testimonial.flag}</span>
            <span>{testimonial.quote}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 