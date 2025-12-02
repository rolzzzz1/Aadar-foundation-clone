import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
const InstagramPosts = ({ postsPerSlide = 3, totalPosts = 6, className = "" }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Call the secure Netlify Function instead of Instagram API directly
        const url = `/.netlify/functions/instagram-posts?limit=${totalPosts}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error.message || "Failed to fetch posts");
          setPosts([]);
        } else if (data.data) {
          setPosts(data.data);
        } else {
          setError(
            "No posts found. The account may not have any posts, or the account ID may be incorrect."
          );
          setPosts([]);
        }
      } catch (err) {
        setError(err.message || "Error fetching posts. Please try again later.");
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

  const totalSlides = postsPerSlide > 0 ? Math.ceil(posts.length / postsPerSlide) : 0;

  const nextSlide = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

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
          <p>Loading posts...</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="posts-section">
          <div className="carousel-container">
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={prevSlide}
              aria-label="Previous posts"
            >
              ‹
            </button>

            <div className="carousel-wrapper">
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="carousel-slide">
                    {posts
                      .slice(slideIndex * postsPerSlide, slideIndex * postsPerSlide + postsPerSlide)
                      .map((post) => (
                        <div key={post.id} className="post-card">
                          <div className="post-media">
                            {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
                              <img src={post.media_url} alt={post.caption || "Instagram post"} />
                            ) : post.media_type === "VIDEO" ? (
                              <video controls>
                                <source src={post.media_url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="unsupported-media">Unsupported media type</div>
                            )}
                          </div>
                          <div className="post-content">
                            {post.caption && (
                              <p className="post-caption">
                                {post.caption.length > 150
                                  ? `${post.caption.substring(0, 150)}...`
                                  : post.caption}
                              </p>
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
                                  View on Instagram →
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
              aria-label="Next posts"
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
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="empty-state">
          <p>No posts found</p>
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
