import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import MKBox from "components/MKBox";

const MAX_RETRIES_PER_SRC = 2;

/**
 * Above-the-fold brand image: retries on flaky networks and falls back to a
 * second URL so users never see a broken-image icon on logos.
 */
export default function CriticalImage({
  src,
  fallbackSrc,
  alt,
  sx,
  eager = true,
  reserveWidth,
  reserveHeight,
  ...rest
}) {
  const imgRef = useRef(null);
  const sources = useMemo(() => [src, fallbackSrc].filter(Boolean), [src, fallbackSrc]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setRetryCount(0);
    setLoaded(false);
    setFailed(false);
  }, [src, fallbackSrc]);

  const activeSrc = sources[sourceIndex];
  const resolvedSrc = useMemo(() => {
    if (!activeSrc || retryCount === 0) return activeSrc;
    const joiner = activeSrc.includes("?") ? "&" : "?";
    return `${activeSrc}${joiner}retry=${retryCount}`;
  }, [activeSrc, retryCount]);

  // Images preloaded in <head> may finish before onLoad is attached.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
      setFailed(false);
    }
  }, [resolvedSrc]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    setFailed(false);
  }, []);

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES_PER_SRC) {
      setRetryCount((count) => count + 1);
      return;
    }
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((index) => index + 1);
      setRetryCount(0);
      return;
    }
    setFailed(true);
  }, [retryCount, sourceIndex, sources.length]);

  if (!resolvedSrc) return null;

  return (
    <MKBox
      ref={imgRef}
      component="img"
      src={resolvedSrc}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      // eslint-disable-next-line react/no-unknown-property
      fetchPriority={eager ? "high" : "auto"}
      onLoad={handleLoad}
      onError={handleError}
      width={reserveWidth}
      height={reserveHeight}
      sx={{
        display: failed ? "none" : "block",
        opacity: loaded ? 1 : 0.01,
        transition: "opacity 0.25s ease",
        objectFit: "contain",
        ...sx,
      }}
      {...rest}
    />
  );
}

CriticalImage.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  sx: PropTypes.object,
  eager: PropTypes.bool,
  reserveWidth: PropTypes.number,
  reserveHeight: PropTypes.number,
};
