import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import MKBox from "components/MKBox";

const MAX_RETRIES_PER_SRC = 2;

/**
 * Resilient image loader: retries + multiple URL fallbacks for slow/flaky networks.
 */
export default function CriticalImage({
  src,
  fallbackSrc,
  alternateSrc,
  alt,
  sx,
  eager = true,
  reserveWidth,
  reserveHeight,
  ...rest
}) {
  const imgRef = useRef(null);
  const sources = useMemo(
    () => [src, fallbackSrc, alternateSrc].filter(Boolean),
    [src, fallbackSrc, alternateSrc]
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setRetryCount(0);
    setLoaded(false);
  }, [src, fallbackSrc, alternateSrc]);

  const activeSrc = sources[sourceIndex];
  const resolvedSrc = useMemo(() => {
    if (!activeSrc || retryCount === 0) return activeSrc;
    const joiner = activeSrc.includes("?") ? "&" : "?";
    return `${activeSrc}${joiner}retry=${retryCount}`;
  }, [activeSrc, retryCount]);

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES_PER_SRC) {
      setRetryCount((count) => count + 1);
      return;
    }
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((index) => index + 1);
      setRetryCount(0);
    }
  }, [retryCount, sourceIndex, sources.length]);

  const handleLoad = useCallback(
    (event) => {
      const img = event?.currentTarget || imgRef.current;
      if (!img || img.naturalWidth === 0) {
        handleError();
        return;
      }
      setLoaded(true);
    },
    [handleError]
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    if (img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    handleError();
  }, [resolvedSrc, handleError]);

  if (!resolvedSrc) return null;

  const allFailed =
    sourceIndex >= sources.length - 1 && retryCount >= MAX_RETRIES_PER_SRC && !loaded;

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
        objectFit: "cover",
        opacity: allFailed ? 0.35 : 1,
        backgroundColor: loaded ? "transparent" : "rgba(240, 242, 245, 0.8)",
        ...sx,
      }}
      {...rest}
    />
  );
}

CriticalImage.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  alternateSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  sx: PropTypes.object,
  eager: PropTypes.bool,
  reserveWidth: PropTypes.number,
  reserveHeight: PropTypes.number,
};
