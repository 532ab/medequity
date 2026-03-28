"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setTransitioning(true);

      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitioning(false);
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(6px)" : "translateY(0)",
        transition: transitioning
          ? "opacity 0.12s ease-out, transform 0.12s ease-out"
          : "opacity 0.25s ease-out, transform 0.25s ease-out",
      }}
    >
      {displayChildren}
    </div>
  );
}
