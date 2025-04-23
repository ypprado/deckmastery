
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn } from "lucide-react";

interface CardDetailImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

// Restore the ZOOM_SIZE constant
const getDynamicZoomSize = () => {
  const maxSize = Math.min(window.innerWidth, window.innerHeight);
  return Math.floor(maxSize * 0.8); // 80% of screen size
};

const CardDetailImageZoom: React.FC<CardDetailImageZoomProps> = ({
  src,
  alt,
  className = "",
}) => {
  const isMobile = useIsMobile();
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number; size: number } | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (showZoom && isMobile) {
      setShowZoom(false);
    }
  }, [isMobile, showZoom]);

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

  let portalNode: HTMLElement = document.body;
  if (typeof window !== "undefined") {
    const elem = document.getElementById("zoom-portal-root");
    if (elem) portalNode = elem;
  }

  function getZoomPosition(e: React.MouseEvent) {
    const zoomSize = getDynamicZoomSize();
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 100, y: 100, size: getDynamicZoomSize() };
    let x = rect.right + 20;
    let y = rect.top + (rect.height - zoomSize) / 2;
    const windowWidth = window.innerWidth;
    if (x + zoomSize > windowWidth) {
      x = rect.left - zoomSize - 20;
      if (x < 0) x = windowWidth - zoomSize - 20;
    }
    y = Math.max(y, 16);
    if (y + zoomSize > window.innerHeight) {
      y = window.innerHeight - zoomSize - 16;
    }
    return { x, y, size: zoomSize };
  }
  

  function handleMouseEnter(e: React.MouseEvent) {
    setZoomPos(getZoomPosition(e));
    setShowZoom(true);
  }
  function handleMouseMove(e: React.MouseEvent) {
    setZoomPos(getZoomPosition(e));
  }
  function handleMouseLeave() {
    setShowZoom(false);
    setZoomPos(null);
  }

  return (
    <>
      <div
        ref={imageRef}
        className={"relative cursor-zoom-in group " + className}
        tabIndex={0}
        aria-label="Zoom card artwork"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full transition duration-150 group-hover:opacity-75"
          draggable={false}
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 z-10 bg-background/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={20} />
        </span>
      </div>
      {showZoom && zoomPos &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: zoomPos.x,
              top: zoomPos.y,
              width: zoomPos.size,
              height: zoomPos.size,
              zIndex: 1000,
              pointerEvents: "none",
              boxShadow: "none",
              borderRadius: "0",
              background: "transparent",
              overflow: "hidden"
            }}
            className="animate-fade-in"
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
        )
      }
    </>
  );
};

export default CardDetailImageZoom;
