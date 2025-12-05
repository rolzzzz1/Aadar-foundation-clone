import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "./InstagramPosts.css";

/**
 * InstagramPosts Component
 *
 * A reusable React component that displays Instagram posts in a carousel format.
 * The component calls a secure Netlify Function that handles Instagram API requests.
 *
 * @param {Object} props - Component props
 * @param {number} props.postsPerSlide - Number of posts to show per slide (default: 3)
 * @param {number} props.totalPosts - Total number of posts to fetch (default: 6)
 * @param {string} props.className - Additional CSS class name for the container
 *
 * @example
 * <InstagramPosts
 *   postsPerSlide={3}
 *   totalPosts={6}
 * />
 */
const InstagramPosts = ({ postsPerSlide: propPostsPerSlide, className = "" }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicPostsPerSlide, setDynamicPostsPerSlide] = useState(3);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  // Always fetch 6 posts
  const totalPosts = 6;

  // Calculate posts per slide based on screen size
  useEffect(() => {
    const calculatePostsPerSlide = () => {
      const width = window.innerWidth;
      let newPostsPerSlide;
      if (width < 768) {
        // Very small screens: 1 post per slide
        newPostsPerSlide = 1;
      } else if (width < 1025) {
        // Middle screens: 2 posts per slide
        newPostsPerSlide = 2;
      } else {
        // Large screens: 3 posts per slide
        newPostsPerSlide = 3;
      }

      setDynamicPostsPerSlide((prev) => {
        // Reset to first slide when posts per slide changes
        if (prev !== newPostsPerSlide) {
          setCurrentIndex(0);
        }
        return newPostsPerSlide;
      });
    };

    // Calculate on mount
    calculatePostsPerSlide();

    // Add resize listener
    window.addEventListener("resize", calculatePostsPerSlide);
    return () => window.removeEventListener("resize", calculatePostsPerSlide);
  }, []);

  // Use prop if provided, otherwise use dynamic value
  const postsPerSlide = propPostsPerSlide !== undefined ? propPostsPerSlide : dynamicPostsPerSlide;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Determine the correct function URL based on environment
        // In local dev: http://localhost:3000/api/instagram-posts (if using Vercel dev)
        // In production: /api/instagram-posts
        const isLocalDev =
          window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const functionUrl = isLocalDev
          ? `http://localhost:3000/api/instagram-posts?limit=${totalPosts}`
          : `/api/instagram-posts?limit=${totalPosts}`;

        const response = await fetch(functionUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        // Check if response is actually JSON (not HTML error page)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          await response.text(); // Consume the response to avoid memory leaks
          throw new Error(
            "Function not available. Please ensure the API route is deployed or check your deployment."
          );
        }

        const data = await response.json();

        if (data.error) {
          // Show more detailed error information
          const errorMsg = data.error.message || t("homePage.postsSection.failedToFetchPosts");
          const errorDetails = data.error.details
            ? ` (Error Code: ${data.error.code || "unknown"})`
            : "";
          setError(`${errorMsg}${errorDetails}`);
          console.error("Instagram API Error:", data.error);
          setPosts([]);
        } else if (data.data) {
          setPosts(data.data);
        } else {
          setError(t("homePage.postsSection.noPostsFound"));
          setPosts([]);
        }
      } catch (err) {
        setError(err.message || t("homePage.postsSection.failedToFetchPosts"));
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [totalPosts]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format caption: bold text before @ and # terms
  const formatCaption = (caption) => {
    if (!caption) return "";

    // Truncate if needed
    const truncated = caption.length > 150 ? `${caption.substring(0, 150)}...` : caption;

    // Find the first occurrence of @ or #
    const atIndex = truncated.indexOf("@");
    const hashIndex = truncated.indexOf("#");

    // Find the earliest occurrence
    let splitIndex = -1;
    if (atIndex !== -1 && hashIndex !== -1) {
      splitIndex = Math.min(atIndex, hashIndex);
    } else if (atIndex !== -1) {
      splitIndex = atIndex;
    } else if (hashIndex !== -1) {
      splitIndex = hashIndex;
    }

    // If no @ or # found, bold everything
    if (splitIndex === -1) {
      return <strong>{truncated}</strong>;
    }

    // Split at the first @ or #
    const beforeText = truncated.substring(0, splitIndex).trim();
    const afterText = truncated.substring(splitIndex);

    return (
      <>
        {beforeText && <strong>{beforeText}</strong>}
        {afterText}
      </>
    );
  };

  const totalSlides = postsPerSlide > 0 ? Math.ceil(posts.length / postsPerSlide) : 0;

  const nextSlide = () => {
    if (totalSlides === 0) return;
    setIsAutoPlayPaused(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlayPaused(false), 3000);
  };

  const prevSlide = () => {
    if (totalSlides === 0) return;
    setIsAutoPlayPaused(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlayPaused(false), 3000);
  };

  const goToSlide = (index) => {
    setIsAutoPlayPaused(true);
    setCurrentIndex(index);
    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlayPaused(false), 3000);
  };

  // Auto-play carousel with 4-6 second interval
  useEffect(() => {
    if (totalSlides <= 1 || isAutoPlayPaused) return;

    let timeoutId;

    const scheduleNextSlide = () => {
      // Random interval between 4000ms (4s) and 6000ms (6s)
      const randomInterval = Math.floor(Math.random() * 2000) + 4000;

      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        scheduleNextSlide(); // Schedule the next slide
      }, randomInterval);
    };

    scheduleNextSlide();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [totalSlides, isAutoPlayPaused, currentIndex]);

  return (
    <div className={`instagram-posts-container ${className}`}>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>{t("homePage.postsSection.loadingPosts")}</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="posts-section">
          <div className="carousel-container">
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={prevSlide}
              aria-label={t("homePage.postsSection.previousPosts")}
            >
              ‹
            </button>

            <div
              className="carousel-wrapper"
              onMouseEnter={() => setIsAutoPlayPaused(true)}
              onMouseLeave={() => setIsAutoPlayPaused(false)}
            >
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="carousel-slide"
                    style={{ gridTemplateColumns: `repeat(${postsPerSlide}, 1fr)` }}
                  >
                    {posts
                      .slice(slideIndex * postsPerSlide, slideIndex * postsPerSlide + postsPerSlide)
                      .map((post) => (
                        <div key={post.id} className="post-card">
                          <div className="post-media">
                            {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
                              <img
                                src={post.media_url}
                                alt={post.caption || "Instagram post"}
                                onContextMenu={(e) => e.preventDefault()}
                                draggable="false"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : post.media_type === "VIDEO" ? (
                              <video
                                controls
                                controlsList="nodownload"
                                preload="metadata"
                                loading="lazy"
                              >
                                <source src={post.media_url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="unsupported-media">Unsupported media type</div>
                            )}
                          </div>
                          <div className="post-content">
                            {post.caption && (
                              <p className="post-caption">{formatCaption(post.caption)}</p>
                            )}
                            <div className="post-meta">
                              <span className="post-date">{formatDate(post.timestamp)}</span>
                              {post.permalink && (
                                <a
                                  href={post.permalink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="post-link"
                                >
                                  {t("homePage.postsSection.viewOnInstagram")} →
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="carousel-btn carousel-btn-next"
              onClick={nextSlide}
              aria-label={t("homePage.postsSection.nextPosts")}
            >
              ›
            </button>
          </div>

          {totalSlides > 1 && (
            <div className="carousel-indicators">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`${t("homePage.postsSection.goToSlide")} ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="empty-state">
          <p>{t("homePage.postsSection.noPostsFound")}</p>
        </div>
      )}
    </div>
  );
};

InstagramPosts.propTypes = {
  postsPerSlide: PropTypes.number,
  totalPosts: PropTypes.number,
  className: PropTypes.string,
};

export default InstagramPosts;
