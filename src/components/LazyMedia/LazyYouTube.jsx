import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { shouldSkipHeavyMedia } from "utils/networkAware";

/**
 * Facade-style YouTube embed.
 *
 * - Shows the lightweight YouTube thumbnail (~10–30 KB) as a poster
 *   instead of loading the ~600 KB player JS on first paint.
 * - The real <iframe> is mounted only after the user clicks Play, OR
 *   when the wrapper scrolls into view AND the connection is not slow.
 * - On Save-Data / 2g / 3g, it stays as a facade until the user
 *   explicitly clicks — saving megabytes for users on weak networks.
 *
 * This pattern follows Google's "lite-youtube-embed" idea but as a
 * tiny dependency-free component matching the project's MUI styling.
 */
function extractVideoId(input) {
  if (!input) return "";
  if (/^[A-Za-z0-9_-]{6,}$/.test(input) && !input.includes("/")) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "");
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIdx = parts.indexOf("embed");
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    return parts[parts.length - 1] || "";
  } catch (e) {
    return input;
  }
}

function LazyYouTube({
  videoId: rawVideoId,
  title = "YouTube video player",
  params = "",
  posterQuality = "hqdefault",
  style,
  className,
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  preconnect = true,
  playWhenInView = true,
  pauseWhenOutOfView = true,
  forceActivateOnView = false,
}) {
  const videoId = extractVideoId(rawVideoId);
  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);
  const [activated, setActivated] = useState(false);
  const [warmHints, setWarmHints] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const lastVisibilityRef = useRef(null);
  const didAutoplayKickRef = useRef(false);

  const activate = useCallback(() => setActivated(true), []);

  // When the facade scrolls into view, optionally auto-activate on
  // good connections so the iframe is ready before the user clicks.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const node = wrapperRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = Boolean(entry.isIntersecting) && (entry.intersectionRatio ?? 0) > 0.12;
          setIsInView(visible);

          if (!visible) return;

          // Warm the connections as soon as the section is near/visible.
          setWarmHints(true);

          // Auto-activate once on good connections.
          if (!activated && (forceActivateOnView || !shouldSkipHeavyMedia())) {
            setActivated(true);
          }
        });
      },
      { rootMargin: "200px", threshold: [0, 0.12, 0.25] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activated]);

  // Pause/play the YouTube player based on viewport visibility.
  // Uses the iframe postMessage API (enablejsapi=1).
  useEffect(() => {
    if (!activated) return;
    if (typeof window === "undefined") return;
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    // Avoid spamming postMessages on re-renders.
    if (lastVisibilityRef.current === isInView) return;
    lastVisibilityRef.current = isInView;

    const post = (func) => {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args: [] }),
          "*"
        );
      } catch (e) {
        // ignore
      }
    };

    if (!isInView && pauseWhenOutOfView) {
      post("pauseVideo");
      return;
    }
    if (isInView && playWhenInView) {
      post("playVideo");
    }
  }, [activated, isInView, pauseWhenOutOfView, playWhenInView]);

  // YouTube sometimes drops the very first play command until the iframe is
  // fully ready. On the first time the user scrolls to the video, we "kick"
  // autoplay a couple times after load (muted + playsinline) so it starts
  // without requiring a click.
  const kickAutoplay = useCallback(() => {
    if (!activated) return;
    if (!playWhenInView) return;
    if (!isInView) return;
    if (didAutoplayKickRef.current) return;
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    didAutoplayKickRef.current = true;
    const post = (func) => {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args: [] }),
          "*"
        );
      } catch (e) {
        // ignore
      }
    };

    // Immediate + a couple delayed retries.
    post("playVideo");
    window.setTimeout(() => post("playVideo"), 350);
    window.setTimeout(() => post("playVideo"), 1200);
  }, [activated, isInView, playWhenInView]);

  if (!videoId) {
    return null;
  }

  const posterSrc = `https://i.ytimg.com/vi/${videoId}/${posterQuality}.jpg`;
  const origin =
    typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1${
    origin ? `&origin=${encodeURIComponent(origin)}` : ""
  }${params ? `&${params}` : ""}`;

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        cursor: activated ? "default" : "pointer",
        ...style,
      }}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
      role={activated ? undefined : "button"}
      tabIndex={activated ? undefined : 0}
      aria-label={activated ? undefined : `Play video: ${title}`}
    >
      {preconnect && warmHints && !activated && (
        <>
          {/* Warm the connections so the click→play feels instant */}
          <link rel="preconnect" href="https://www.youtube-nocookie.com" />
          <link rel="preconnect" href="https://www.google.com" />
          <link rel="preconnect" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://s.ytimg.com" />
        </>
      )}

      {activated ? (
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={iframeSrc}
          title={title}
          frameBorder="0"
          allow={allow}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          onLoad={kickAutoplay}
          style={{
            border: 0,
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <>
          <img
            src={posterSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              // Fall back to a lower-res thumbnail if hqdefault is missing
              if (e.currentTarget.dataset.fallback !== "1") {
                e.currentTarget.dataset.fallback = "1";
                e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/0.jpg`;
              }
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
            }}
          >
            <PlayArrowIcon style={{ color: "#fff", fontSize: 44 }} />
          </div>
        </>
      )}
    </div>
  );
}

LazyYouTube.propTypes = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string,
  params: PropTypes.string,
  posterQuality: PropTypes.oneOf([
    "default",
    "mqdefault",
    "hqdefault",
    "sddefault",
    "maxresdefault",
  ]),
  style: PropTypes.object,
  className: PropTypes.string,
  allow: PropTypes.string,
  preconnect: PropTypes.bool,
  playWhenInView: PropTypes.bool,
  pauseWhenOutOfView: PropTypes.bool,
  forceActivateOnView: PropTypes.bool,
};

export default LazyYouTube;
