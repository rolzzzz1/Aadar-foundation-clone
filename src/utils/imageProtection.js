/**
 * Image Protection Utilities
 *
 * Note: Complete image protection is impossible - determined users can always
 * find ways to download images. These measures make it more difficult.
 */

// Prevent common image download methods
export const setupImageProtection = () => {
  if (typeof window === "undefined") return;

  // Prevent right-click context menu on images
  const preventContextMenu = (e) => {
    if (e.target.tagName === "IMG" || e.target.closest("img")) {
      e.preventDefault();
      return false;
    }
  };

  // Prevent drag and drop of images
  const preventDragStart = (e) => {
    if (e.target.tagName === "IMG" || e.target.closest("img")) {
      e.preventDefault();
      return false;
    }
  };

  // Prevent image selection
  const preventSelection = (e) => {
    if (e.target.tagName === "IMG" || e.target.closest("img")) {
      e.preventDefault();
      return false;
    }
  };

  // Prevent keyboard shortcuts (Ctrl+S, Ctrl+A, etc.)
  const preventKeyboardShortcuts = (e) => {
    // Prevent Ctrl+S (Save)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      return false;
    }
    // Prevent Ctrl+A (Select All) on images
    if ((e.ctrlKey || e.metaKey) && e.key === "a" && e.target.tagName === "IMG") {
      e.preventDefault();
      return false;
    }
    // Prevent F12 (Developer Tools) - can be bypassed but adds friction
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }
    // Prevent Ctrl+Shift+I (Developer Tools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
      e.preventDefault();
      return false;
    }
    // Prevent Ctrl+Shift+C (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
      e.preventDefault();
      return false;
    }
  };

  // Prevent image copy
  const preventCopy = (e) => {
    if (e.target.tagName === "IMG" || e.target.closest("img")) {
      e.clipboardData.setData("text/plain", "");
      e.preventDefault();
      return false;
    }
  };

  // Add event listeners
  document.addEventListener("contextmenu", preventContextMenu);
  document.addEventListener("dragstart", preventDragStart);
  document.addEventListener("selectstart", preventSelection);
  document.addEventListener("keydown", preventKeyboardShortcuts);
  document.addEventListener("copy", preventCopy);

  // Return cleanup function
  return () => {
    document.removeEventListener("contextmenu", preventContextMenu);
    document.removeEventListener("dragstart", preventDragStart);
    document.removeEventListener("selectstart", preventSelection);
    document.removeEventListener("keydown", preventKeyboardShortcuts);
    document.removeEventListener("copy", preventCopy);
  };
};

// Add CSS to prevent image selection and dragging
export const addImageProtectionCSS = () => {
  if (typeof document === "undefined") return;

  const styleId = "image-protection-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    /* Prevent image selection */
    img {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }

    /* Prevent image dragging */
    img {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      pointer-events: auto !important;
    }

    /* Prevent text selection on images */
    img::selection {
      background: transparent !important;
    }
    img::-moz-selection {
      background: transparent !important;
    }

    /* Add overlay protection (optional - can be enabled per image) */
    .image-protected {
      position: relative;
    }
    .image-protected::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
};
