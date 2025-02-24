// @mui material components
// import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

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

// import img15 from "assets/images/galleryImages/paper-clipping3.jpeg";

function Gallery() {
  // var items = [
  //   {
  //     name: "Image 1",
  //     imgUrl: img1,
  //   },
  //   {
  //     name: "Image 2",
  //     imgUrl: img2,
  //   },
  // ];

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
              <MKBox display="flex" justifyContent="left" flexWrap="wrap" gap="20px">
                {/* <MKBox position="relative" width={{ xs: "100%", sm: "50%", md: "50%", lg: "30%" }}>
                  <MKBox
                    component="img"
                    src={img1}
                    // width={{ xs: "100%", sm: "50%", md: "40%", lg: "30%" }}
                    width="100%"
                    // height="30%"
                    maxHeight="280px"
                    borderRadius="7px"
                    objectFit="cover"
                    flex="1"
                  ></MKBox>
                  <MKBox
                    position="absolute"
                    bottom="0px"
                    left="0px"
                    sx={{
                      backgroundColor: "#000000",
                      width: "100%",
                      borderRadius: "0 0 7px 7px",
                    }}
                  >
                    <MKTypography variant="h6" px={1} sx={{ color: "#ffffff", fontWeight: "500" }}>
                      Rescuing a man from roadside.
                    </MKTypography>
                  </MKBox>
                </MKBox> */}
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
                {/* <MKBox
                  component="img"
                  src={img15}
                  width={{ xs: "100%", sm: "50%", md: "40%", lg: "50%" }}
                  maxHeight="280px"
                  borderRadius="7px"
                  objectFit="cover"
                  // flex="1"
                ></MKBox> */}
              </MKBox>
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
