"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt = "Before",
  afterAlt = "After",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    getPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => getPosition(e.clientX);
    const onTouchMove = (e: TouchEvent) => getPosition(e.touches[0].clientX);
    const stop = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
    };
  }, [isDragging, getPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ cursor: isDragging ? "col-resize" : "ew-resize" }}
      // Allow clicking anywhere on the container to jump the divider
      onClick={(e) => getPosition(e.clientX)}
    >
      {/* After image — full width base layer */}
      <div className="relative w-full h-full">
        <Image
          src={afterUrl}
          alt={afterAlt}
          fill
          className="object-cover"
          priority
          draggable={false}
        />
      </div>

      {/* Before image — clipped on the left */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative w-full h-full" style={{ width: `${10000 / position}%` }}>
          <Image
            src={beforeUrl}
            alt={beforeAlt}
            fill
            className="object-cover"
            priority
            draggable={false}
          />
        </div>
      </div>

      {/* Gradient overlay top-to-middle for title text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 z-20"
        style={{ left: `calc(${position}% - 1px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Vertical line */}
        <div className="w-0.5 h-full bg-white/90 shadow-lg" />

        {/* Circular handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center"
          style={{ cursor: "col-resize" }}
        >
          {/* Left arrow */}
          <svg className="w-3 h-3 text-[#8B5E3C] mr-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {/* Right arrow */}
          <svg className="w-3 h-3 text-[#8B5E3C] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* BEFORE label */}
      <div className="absolute bottom-6 left-0 z-10 pointer-events-none"
        style={{ opacity: position > 15 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        <span className="ml-4 bg-black/60 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded backdrop-blur-sm">
          Before
        </span>
      </div>

      {/* AFTER label */}
      <div
        className="absolute bottom-6 right-0 z-10 pointer-events-none"
        style={{ opacity: position < 85 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        <span className="mr-4 bg-[#8B5E3C]/80 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded backdrop-blur-sm">
          After
        </span>
      </div>
    </div>
  );
}
