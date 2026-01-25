"use client";

import React from "react";

interface PageProps {
  imageSrc: string;
  children?: React.ReactNode;
}

const MagazinePage = React.forwardRef<HTMLDivElement, PageProps>(
  ({ imageSrc, children }, ref) => (
    <div ref={ref} className="bg-white">
      <img
        src={imageSrc}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        draggable={false}
      />
      {children}
    </div>
  )
);

MagazinePage.displayName = "MagazinePage";
export default MagazinePage;
