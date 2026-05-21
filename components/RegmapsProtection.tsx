"use client";

import { useEffect } from "react";

export default function RegmapsProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => e.preventDefault();
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("copy", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return (
    <div className="select-none" onCopy={(e) => e.preventDefault()}>
      {children}
    </div>
  );
}
