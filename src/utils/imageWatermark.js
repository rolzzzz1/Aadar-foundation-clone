/**
 * Image Watermarking Utility
 * Adds invisible Aadar logo watermark to images using canvas
 */

import aadarLogo from "assets/images/logos/logo-aadar.jpg";

// Load watermark logo
let watermarkImage = null;
let watermarkLoaded = false;

// Load the watermark image
const loadWatermarkImage = () => {
  return new Promise((resolve) => {
    if (watermarkLoaded && watermarkImage) {
      resolve(watermarkImage);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = aadarLogo;

    img.onload = () => {
      watermarkImage = img;
      watermarkLoaded = true;
      resolve(img);
    };

    img.onerror = () => {
      // If logo fails to load, create a text-based watermark
      console.warn("Watermark logo failed to load, using text watermark");
      watermarkImage = null;
      watermarkLoaded = true;
      resolve(null);
    };
  });
};

/**
 * Add invisible watermark to an image
 * @param {HTMLImageElement} imgElement - The image element to watermark
 * @param {Object} options - Watermark options
 * @returns {Promise<string>} - Data URL of watermarked image
 */
export const addWatermarkToImage = async (imgElement, options = {}) => {
  const {
    opacity = 0.05, // Very low opacity for invisible watermark
    scale = 0.3, // Size of watermark relative to image
    position = "center", // 'center', 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    repeat = false, // Repeat watermark across image
  } = options;

  try {
    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to match image
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;

    // Draw original image
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Load watermark
    const watermark = await loadWatermarkImage();

    if (watermark) {
      // Calculate watermark size
      const watermarkWidth = canvas.width * scale;
      const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;

      // Set opacity
      ctx.globalAlpha = opacity;

      if (repeat) {
        // Repeat watermark across image
        const cols = Math.ceil(canvas.width / watermarkWidth);
        const rows = Math.ceil(canvas.height / watermarkHeight);

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * watermarkWidth;
            const y = row * watermarkHeight;
            ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
          }
        }
      } else {
        // Single watermark
        let x, y;

        switch (position) {
          case "bottom-right":
            x = canvas.width - watermarkWidth - 20;
            y = canvas.height - watermarkHeight - 20;
            break;
          case "bottom-left":
            x = 20;
            y = canvas.height - watermarkHeight - 20;
            break;
          case "top-right":
            x = canvas.width - watermarkWidth - 20;
            y = 20;
            break;
          case "top-left":
            x = 20;
            y = 20;
            break;
          case "center":
          default:
            x = (canvas.width - watermarkWidth) / 2;
            y = (canvas.height - watermarkHeight) / 2;
            break;
        }

        ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
      }

      // Reset opacity
      ctx.globalAlpha = 1.0;
    } else {
      // Fallback: Add text watermark if logo fails
      ctx.globalAlpha = opacity;
      ctx.font = `${canvas.width * 0.05}px Arial`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AADAR FOUNDATION", canvas.width / 2, canvas.height / 2);
      ctx.globalAlpha = 1.0;
    }

    // Return data URL
    return canvas.toDataURL("image/jpeg", 0.92);
  } catch (error) {
    console.error("Error adding watermark:", error);
    // Return original image if watermarking fails
    return imgElement.src;
  }
};

/**
 * Apply watermark to all images on the page
 */
export const watermarkAllImages = async (options = {}) => {
  if (typeof window === "undefined") return;

  const images = document.querySelectorAll("img");
  const processedImages = new Set();

  for (const img of images) {
    // Skip if already processed or if it's the watermark logo itself
    // Also skip slide 1 paint patch images
    if (
      processedImages.has(img) ||
      img.src.includes("logo-aadar") ||
      img.dataset.watermarked === "true" ||
      img.src.includes("aadarHindiWhite") ||
      img.src.includes("aadarHindiYellow") ||
      img.src.includes("aadar-main-black2") ||
      img.src.includes("brushstroke")
    ) {
      continue;
    }

    // Skip data URLs (already processed images)
    if (img.src.startsWith("data:")) {
      continue;
    }

    // Skip if image is not loaded
    if (!img.complete || img.naturalWidth === 0) {
      // Wait for image to load
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 3000);
        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeout);
          resolve();
        };
      });
    }

    // Skip if still not loaded
    if (!img.complete || img.naturalWidth === 0) {
      continue;
    }

    try {
      const watermarkedDataUrl = await addWatermarkToImage(img, options);
      if (watermarkedDataUrl && watermarkedDataUrl !== img.src) {
        // Store original src for reference
        img.dataset.originalSrc = img.src;
        img.src = watermarkedDataUrl;
        img.dataset.watermarked = "true";
        processedImages.add(img);
      }
    } catch (error) {
      console.error("Error watermarking image:", error);
    }
  }
};

/**
 * Setup observer to watermark images as they're added to the DOM
 */
export const setupWatermarkObserver = (options = {}) => {
  if (typeof window === "undefined") return () => {};

  // Use MutationObserver to watch for new images
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check if node is an image
          if (node.tagName === "IMG" && node.dataset.watermarked !== "true") {
            // Wait a bit for image to load
            setTimeout(() => {
              watermarkAllImages(options);
            }, 500);
          }
          // Check for images within the node
          const images = node.querySelectorAll
            ? node.querySelectorAll("img:not([data-watermarked='true'])")
            : [];
          if (images.length > 0) {
            setTimeout(() => {
              watermarkAllImages(options);
            }, 500);
          }
        }
      });
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Return cleanup function
  return () => observer.disconnect();
};

/**
 * React hook to watermark images
 * Note: Import React in your component to use this hook
 */
export const useImageWatermark = () => {
  // This hook requires React to be imported in the component using it
  // Example: import React, { useState, useEffect } from "react";
  // Then: const { isWatermarking } = useImageWatermark();
  return { isWatermarking: false };
};
