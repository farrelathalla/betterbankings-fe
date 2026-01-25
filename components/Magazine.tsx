"use client";

import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import MagazinePage from "./MagazinePage";

interface MagazineProps {
  allPageImages: string[];
}

const Magazine: React.FC<MagazineProps> = ({ allPageImages }) => {
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 424 });
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Load first image to get aspect ratio
  useEffect(() => {
    if (allPageImages?.length > 0) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setImageAspectRatio(ratio);
      };
      img.src = allPageImages[0];
    }
  }, [allPageImages]);

  // Update dimensions based on container and aspect ratio
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && imageAspectRatio) {
        const containerWidth = containerRef.current.offsetWidth;
        const windowWidth = window.innerWidth;

        // Check if mobile
        const mobile = windowWidth < 768;
        setIsMobile(mobile);

        let maxPageWidth: number;

        if (mobile) {
          // On mobile, use more of the available width (90%)
          maxPageWidth = Math.min((containerWidth * 0.9) / 2 - 10, 200);
        } else if (windowWidth < 1024) {
          // Tablet: use 70% of available space
          maxPageWidth = Math.min((containerWidth * 0.7) / 2 - 15, 280);
        } else {
          // Desktop: use 50% of available space, max 350px per page
          maxPageWidth = Math.min((containerWidth * 0.5) / 2 - 20, 350);
        }

        const pageHeight = maxPageWidth / imageAspectRatio;

        setDimensions({
          width: Math.round(maxPageWidth),
          height: Math.round(pageHeight),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [imageAspectRatio]);

  if (!allPageImages?.length) return null;

  const FlipBookComponent = HTMLFlipBook as any;

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center z-10 px-4"
    >
      <div
        className="relative flex justify-center items-center w-full"
        style={{
          minHeight: dimensions.height + 40,
        }}
      >
        {imageAspectRatio && (
          <FlipBookComponent
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            showCover={true}
            mobileScrollSupport={true}
            maxShadowOpacity={isMobile ? 0.3 : 0.45}
            ref={flipBookRef}
            usePortrait={isMobile}
            drawShadow={true}
            flippingTime={isMobile ? 600 : 800}
            useMouseEvents={true}
            swipeDistance={isMobile ? 20 : 30}
            clickEventForward={true}
            startPage={0}
            startZIndex={0}
            autoSize={false}
            showPageCorners={!isMobile}
          >
            {allPageImages.map((src, i) => (
              <MagazinePage key={i} imageSrc={src} />
            ))}
          </FlipBookComponent>
        )}
      </div>
      <p className="text-gray-500 text-sm mt-4 text-center">
        {isMobile
          ? "Swipe to flip pages"
          : "Click or drag the pages to flip through the brochure"}
      </p>
    </div>
  );
};

export default Magazine;
