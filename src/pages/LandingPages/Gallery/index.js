// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// React hooks
import { useMemo, useState, useEffect, useRef } from "react";

// i18next imports
import { useTranslation } from "react-i18next";

// customised styles
import "./styles.css";

// imported lightGallery package
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import lgVideo from "lightgallery/plugins/video";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Routes
import getRoutes from "routes1";
import getFooterRoutes from "footer.routes1";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import img1 from "assets/images/galleryImages/resque1.jpg";
import img2 from "assets/images/galleryImages/resque2.jpg";
import img3 from "assets/images/galleryImages/resque3.jpg";
import img4 from "assets/images/galleryImages/resque4.jpeg";
import img5 from "assets/images/galleryImages/resque5.jpeg";
import img6 from "assets/images/galleryImages/movie-time.jpg";
import img7 from "assets/images/galleryImages/holi-dahan.jpeg";
import img8 from "assets/images/galleryImages/holi-celebration.jpeg";
import img9 from "assets/images/galleryImages/games1.jpg";
import img10 from "assets/images/galleryImages/diwali.jpg";
import img11 from "assets/images/galleryImages/before-after-female.png";
import img12 from "assets/images/galleryImages/before-after-male.png";
import img13 from "assets/images/galleryImages/paper-clipping1.jpg";
import img14 from "assets/images/galleryImages/paper-clipping2.jpg";
import img15 from "assets/images/galleryImages/path-award.jpg";
import img16 from "assets/images/galleryImages/swarg-sadan.jpg";
import img17 from "assets/images/galleryImages/raddi-donation.jpg";
import img18 from "assets/images/galleryImages/swargSadan.webp";
import img19 from "assets/images/galleryImages/residents.webp";
import img20 from "assets/images/galleryImages/diwali1.jpg";
// import video1 from "assets/images/video1.mp4";

// Including videos in gallery using light gallery

// const VideoGallery = () => {
//   return (
//     <div className="video-gallery">
//       <LightGallery speed={500} plugins={[lgVideo]} mode="lg-fade">
//         {/* YouTube video */}
//         <a
//           data-lg-size="1280-720"
//           data-lg-video='{"source": [{"src":"https://www.youtube.com/watch?v=et_pTB-Vfs4", "type":"youtube"}]}'
//           href="https://www.youtube.com/watch?v=et_pTB-Vfs4"
//         >
//           <img src="https://img.youtube.com/vi/et_pTB-Vfs4/mqdefault.jpg" alt="YouTube Video" />
//         </a>

//         <a
//           data-lg-size="1280-720"
//           data-lg-video='{"source": [{"src":"https://www.youtube.com/watch?v=DKBrEuCffcQ", "type":"youtube"}]}'
//           href="https://www.youtube.com/watch?v=DKBrEuCffcQ"
//         >
//           <img src="https://img.youtube.com/vi/DKBrEuCffcQ/mqdefault.jpg" alt="YouTube Video" />
//         </a>
//         <a
//           data-lg-size="1280-720"
//           data-lg-video='{"source": [{"src":"https://www.youtube.com/watch?v=T2Zc4nc4nAc", "type":"youtube"}]}'
//           href="https://www.youtube.com/watch?v=T2Zc4nc4nAc"
//         >
//           <img src="https://img.youtube.com/vi/T2Zc4nc4nAc/mqdefault.jpg" alt="YouTube Video" />
//         </a>

//         {/* Vimeo video */}
//         {/* <a
//           data-lg-size="1280-720"
//           data-lg-video='{"source": [{"src":"https://vimeo.com/1084537", "type":"vimeo"}]}'
//           href="https://vimeo.com/1084537"
//         >
//           <img src="https://i.vimeocdn.com/video/1084537_295x166.jpg" alt="Vimeo Video" />
//         </a> */}

//         {/* HTML5 video */}
//         {/* <a
//           data-lg-size="1280-720"
//           data-lg-video='{"source": [{"src":"assets/images/video1.mp4", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}'
//           href={video1}
//         >
//           <img src="https://i.vimeocdn.com/video/1084537_295x166.jpg" alt="HTML5 Video" />
//         </a> */}
//       </LightGallery>
//     </div>
//   );
// };

function Gallery() {
  // Memoize images array to prevent recreation on every render
  const images = useMemo(
    () => [
      { src: img1, alt: "1" },
      { src: img2, alt: "2" },
      { src: img3, alt: "3" },
      { src: img4, alt: "4" },
      { src: img5, alt: "5" },
      { src: img6, alt: "6" },
      { src: img7, alt: "7" },
      { src: img8, alt: "8" },
      { src: img9, alt: "9" },
      { src: img10, alt: "10" },
      { src: img11, alt: "11" },
      { src: img12, alt: "12" },
      { src: img13, alt: "13" },
      { src: img14, alt: "14" },
      { src: img15, alt: "15" },
      { src: img16, alt: "16" },
      { src: img17, alt: "17" },
      { src: img18, alt: "18" },
      { src: img19, alt: "19" },
      { src: img20, alt: "20" },
    ],
    []
  );

  // Track which images are visible for optimized loading
  const [visibleImages, setVisibleImages] = useState(new Set());
  const galleryRef = useRef(null);

  // Track loading state - show loading until first 6 images (above fold) are loaded
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Use Intersection Observer for efficient lazy loading
  useEffect(() => {
    if (!galleryRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            setVisibleImages((prev) => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "100px", // Start loading 100px before image enters viewport
        threshold: 0.01,
      }
    );

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const imageElements = galleryRef.current?.querySelectorAll("[data-index]");
      if (imageElements) {
        imageElements.forEach((el) => observer.observe(el));
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const imageElements = galleryRef.current?.querySelectorAll("[data-index]");
      if (imageElements) {
        imageElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, [images.length]);

  // Hide loading once ALL images are loaded
  useEffect(() => {
    const totalImages = images.length;
    const loadedCount = loadedImages.size;

    if (loadedCount >= totalImages && isLoading) {
      // Add a small delay for smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loadedImages, images.length, isLoading]);

  function renderGallery() {
    const onInit = () => {
      console.log("lightGallery has been initialized");
    };
    return (
      <div className="App" ref={galleryRef}>
        <LightGallery onInit={onInit} speed={500} plugins={[lgThumbnail, lgZoom, lgVideo]}>
          {images.map((image, index) => {
            const isVisible = visibleImages.has(index);
            const isAboveFold = index < 6; // First 6 images are above the fold
            const shouldLoad = isVisible || isAboveFold;

            return (
              <a href={image.src} key={index}>
                <img
                  alt={image.alt}
                  src={shouldLoad ? image.src : undefined}
                  data-src={image.src}
                  data-index={index}
                  className="galleryImgs"
                  loading={isAboveFold ? "eager" : "lazy"}
                  decoding="async"
                  {...(isAboveFold && index < 3 ? { fetchpriority: "high" } : {})}
                  style={{
                    backgroundColor: "#f0f0f0",
                    minHeight: "200px",
                    transition: "opacity 0.3s ease-in-out",
                    opacity: shouldLoad ? 1 : 0.3,
                  }}
                  onLoad={(e) => {
                    // Fade in when image loads
                    e.target.style.opacity = "1";
                    // Track loaded images
                    setLoadedImages((prev) => {
                      const newSet = new Set(prev);
                      newSet.add(index);
                      return newSet;
                    });
                  }}
                  onError={(e) => {
                    // Handle image load errors
                    e.target.style.opacity = "0.5";
                    setLoadedImages((prev) => {
                      const newSet = new Set(prev);
                      newSet.add(index);
                      return newSet;
                    });
                  }}
                />
              </a>
            );
          })}
        </LightGallery>
      </div>
    );
  }

  const { t } = useTranslation();
  // Memoize routes to prevent recreation on every render
  const routes = useMemo(() => getRoutes(t), [t]);
  const footerRoutes = useMemo(() => getFooterRoutes(t), [t]);
  const donateBtn = t("navbar.donateBtn");
  const galleryPage = t("galleryPage");

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/pages/landing-pages/donate",
          label: donateBtn,
          color: "success",
        }}
        sticky
      />

      {/* Main Image and text */}
      <MKBox
        minHeight="80vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left",
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
        }}
      >
        <MKBox
          color="white"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "40%",
            minHeight: "40vh",
          }}
        >
          <MKTypography
            variant="h3"
            color="white"
            textAlign="center"
            ml={-2}
            fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
            fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
            mb={{ xs: 1, sm: 0 }}
          >
            {galleryPage.tagLine}
          </MKTypography>
        </MKBox>
      </MKBox>

      {/* Contact section */}
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -2,
          mb: 4,
          backgroundColor: "#f0f2f5",
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <MKBox component="section" my={3} mx={5}>
          <Grid container alignItems="center" display="flex" justifyContent={"center"}>
            <MKBox component="section" my={1}>
              <MKTypography
                variant="h4"
                fontSize={{ xs: "1.5rem", sm: "1.75rem", md: "1.875rem", lg: "1.875rem" }}
                fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                sx={{ fontWeight: "500" }}
                pb={6}
              >
                {galleryPage.title}
              </MKTypography>
              {isLoading && (
                <MKBox
                  position="relative"
                  minHeight="400px"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "400px",
                      gap: 2,
                    }}
                  >
                    <CircularProgress
                      size={60}
                      thickness={4}
                      sx={{
                        color: "#4FA953",
                      }}
                    />
                    <MKTypography
                      variant="h6"
                      color="text"
                      fontFamily='"Pacifico", "Flix", "Lato", "Helvetica", "Arial", sans-serif'
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      {galleryPage.loadingMessage || "Loading beautiful memories..."}
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      color="text"
                      sx={{
                        fontSize: { xs: "0.85rem", sm: "0.9rem" },
                        opacity: 0.7,
                        textAlign: "center",
                      }}
                    >
                      {galleryPage.loadingSubMessage || "Please wait while we prepare the gallery"}
                    </MKTypography>
                  </Box>
                </MKBox>
              )}
              {!isLoading && (
                <MKBox
                  sx={{
                    animation: "fadeIn 0.5s ease-in-out",
                    "@keyframes fadeIn": {
                      from: {
                        opacity: 0,
                      },
                      to: {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {renderGallery()}
                </MKBox>
              )}
            </MKBox>
          </Grid>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Gallery;
