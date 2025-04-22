
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ZoomIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CardImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ZOOM_SIZE = 250; // px

const CardImageZoom: React.FC<CardImageZoomProps> = ({ src, alt, className }) => {
  const isMobile = useIsMobile();
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  // Only activate on non-mobile devices
  if (isMobile) {
    return (
      <div className={className}>
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
    );
  }

  // Find the portal node for zoom (document.body as fallback)
  let portalNode: HTMLElement;
  if (typeof window !== "undefined") {
    portalNode = document.getElementById("zoom-portal-root") || document.body;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    setShowZoom(true);
    positionZoom(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    positionZoom(e);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomPos(null);
  };

  const positionZoom = (e: React.MouseEvent) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (rect) {
      // Position to the right of the card if room, else left
      const bodyWidth = window.innerWidth;
      let x = rect.right + 16;
      if (x + ZOOM_SIZE > bodyWidth) {
        x = rect.left - ZOOM_SIZE - 16;
        if (x < 0) x = bodyWidth - ZOOM_SIZE - 16;
      }
      let y = Math.max(rect.top, 16);
      if (y + ZOOM_SIZE > window.innerHeight) {
        y = window.innerHeight - ZOOM_SIZE - 16;
      }
      setZoomPos({ x, y });
    }
  };

  return (
    <>
      <div
        ref={imgRef}
        className={`relative group ${className || ""} cursor-zoom-in`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        aria-label="Zoom image preview"
      >
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full transition duration-150 group-hover:opacity-70"
          loading="lazy"
          draggable={false}
        />
        <span className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-background/70 rounded-full p-1.5 transition-opacity">
          <ZoomIn size={20} />
        </span>
      </div>
      {showZoom && zoomPos && createPortal(
        <div
          style={{
            position: "fixed",
            left: zoomPos.x,
            top: zoomPos.y,
            width: ZOOM_SIZE,
            height: ZOOM_SIZE,
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 8px 30px 0 rgba(0,0,0,0.28)",
            borderRadius: "0.5rem",
            background: "white",
            overflow: "hidden",
          }}
          className="animate-fade-in border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
        >
          <img
            src={src}
            alt={alt}
            className="object-contain w-full h-full"
            draggable={false}
            style={{ pointerEvents: "none" }}
          />
        </div>,
        portalNode
      )}
    </>
  );
};

export default CardImageZoom;
