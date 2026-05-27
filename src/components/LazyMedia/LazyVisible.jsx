import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * Mount-gate that only renders its children once the wrapper element
 * scrolls within `rootMargin` of the viewport.
 *
 * Use this around heavy sections (Instagram posts, video embeds,
 * large image carousels) so they do not run their fetch / mount
 * cost during the initial paint, especially on slow connections.
 *
 * It also keeps the children mounted once they have entered — we do
 * not want to re-fetch every time the user scrolls back up.
 */
function LazyVisible({
  children,
  fallback = null,
  rootMargin = "300px",
  minHeight,
  once = true,
  disabled = false,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return undefined;
    }
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, once, disabled]);

  // We keep `minHeight` applied AFTER the section becomes visible too —
  // otherwise the wrapper collapses to 0 while the lazy() chunk is still
  // downloading (Suspense renders `null`), and then expands again once
  // the chunk resolves. That collapse + expand is a major CLS source.
  // Real content taller than `minHeight` naturally grows the wrapper.
  return (
    <div
      ref={ref}
      style={{
        minHeight: minHeight ?? undefined,
        width: "100%",
      }}
    >
      {isVisible ? children : fallback}
    </div>
  );
}

LazyVisible.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  rootMargin: PropTypes.string,
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  once: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default LazyVisible;
