// @mui material components
// import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import "./styles.css";

import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
// import MKCarousel from "components/MKCarousel";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

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

function Gallery() {
  const images = [
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
  ];

  function renderGallery() {
    const onInit = () => {
      console.log("lightGallery has been initialized");
    };
    return (
      <div className="App">
        <LightGallery onInit={onInit} speed={500} plugins={[lgThumbnail, lgZoom]}>
          {images.map((image, index) => {
            return (
              <a href={image.src} key={index}>
                <img alt={image.alt} src={image.src} className="galleryImgs" />
              </a>
            );
          })}
        </LightGallery>
      </div>
    );
  }

  return (
    <MKBox minWidth="320px">
      {/* Navbar component */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "Donate Now",
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
            fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
            fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
            mb={{ xs: 1, sm: 0 }}
          >
            Gallery
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
          {/* <Container> */}
          <Grid container alignItems="center" display="flex" justifyContent={"center"}>
            <MKBox component="section" my={1}>
              {/* <MKTypography variant="h3" fontSize={{ xs: "1.3rem", lg: "1.875rem" }}>
                  Our gallery is coming soon ...
                </MKTypography> */}
              <MKTypography variant="h4" sx={{ fontWeight: "500" }} pb={6}>
                Photo Gallery
              </MKTypography>
              {renderGallery()}
              {/* <MKBox display="flex" justifyContent="left" flexWrap="wrap" gap="20px">
                <MKBox
                  component="img"
                  src={img1}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  height="30%"
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img2}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  height="30%"
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img3}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  height="30%"
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img4}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img5}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1 "
                ></MKBox>

                <MKBox
                  component="img"
                  src={img6}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img7}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img8}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img9}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img10}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img11}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img12}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img13}
                  width={{ xs: "100%", sm: "50%", md: "30%", lg: "40%" }}
                  maxHeight="280px"
                  border="1px solid #000000"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
                <MKBox
                  component="img"
                  src={img14}
                  width={{ xs: "100%", sm: "50%", md: "30%", lg: "40%" }}
                  maxHeight="280px"
                  border="1px solid #000000"
                  borderRadius="7px"
                  objectFit="cover"
                  flex="1"
                ></MKBox>
              </MKBox> */}
            </MKBox>
          </Grid>
          {/* </Container> */}
          {/* <MKBox pt={4}>
            <MKCarousel item={items} />
          </MKBox> */}
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

// // Material Kit 2 React examples
// import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import DefaultFooter from "examples/Footers/DefaultFooter";

// // Material Kit 2 React components
// import MKBox from "components/MKBox";

// // Routes
// import routes from "routes";
// import footerRoutes from "footer.routes";

// import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
// import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
// import MKTypography from "components/MKTypography";

// function Gallery() {
//   return (
//     <MKBox minWidth="320px">
//       {/* Navbar component */}
//       <DefaultNavbar
//         routes={routes}
//         action={{
//           type: "external",
//           route: "https://www.creative-tim.com/product/material-kit-react",
//           label: "Donate Now",
//           color: "success",
//         }}
//         sticky
//       />

//       {/* Main image part */}
//       <MKBox
//         minHeight="80vh"
//         width="100%"
//         sx={{
//           backgroundImage: `url(${bgImage2})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "left",
//           display: "flex",
//           justifyContent: "end",
//           alignItems: "end",
//         }}
//       >
//         <MKBox
//           color="white"
//           display="flex"
//           flexDirection="column"
//           justifyContent="center"
//           alignItems="center"
//           sx={{
//             backgroundImage: `url(${bgImage})`,
//             backgroundSize: "contain",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             width: "40%",
//             minHeight: "40vh",
//           }}
//         >
//           <MKTypography
//             variant="h3"
//             color="white"
//             textAlign="center"
//             ml={-2}
//             fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
//             fontSize={{ xs: "1.2rem", sm: "1.875rem" }}
//             mb={{ xs: 1, sm: 0 }}
//           >
//             Gallery
//           </MKTypography>
//         </MKBox>
//       </MKBox>

//       <MKBox
//         component="section"
//         // pt={14}
//         my={4}
//         display="flex"
//         justifyContent={"center"}
//       >
//         <MKTypography variant="h3" fontSize={{ xs: "1.3rem", lg: "1.875rem" }}>
//           Our gallery is coming soon ...
//         </MKTypography>
//       </MKBox>

//       {/* Footer */}
//       <MKBox px={0}>
//         <DefaultFooter content={footerRoutes} />
//       </MKBox>
//     </MKBox>
//   );
// }

// export default Gallery;
