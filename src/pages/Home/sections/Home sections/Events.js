import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// import Carousel from "react-material-ui-carousel";
// import { Paper, Button } from "@mui/material";

import { useTranslation } from "react-i18next";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKCarousel1 from "components/MKCarousel1";

// import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";

import event1 from "assets/images/eventImages/event 1.jpg";
import event2 from "assets/images/eventImages/event 2.jpg";
import event3 from "assets/images/eventImages/event 3.jpg";
import event4 from "assets/images/eventImages/event 4.jpg";
import event5 from "assets/images/eventImages/event 5.jpg";
import event6 from "assets/images/eventImages/event 6.jpg";

function Work() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { t } = useTranslation();
  const postsSection = t("homePage.postsSection");

  var items = [
    {
      id: 1,
      name: `${postsSection.post1.title}`,
      imgUrl: event4,
      description: `${postsSection.post1.description}`,
      postLink: "https://www.instagram.com/p/DFpBg91PI0y/",
    },

    {
      id: 2,
      name: `${postsSection.post2.title}`,
      imgUrl: event2,
      description: `${postsSection.post2.description}`,
      postLink: "https://www.instagram.com/reel/DEwauX0vLv-/",
    },

    {
      id: 3,
      name: `${postsSection.post3.title}`,
      imgUrl: event3,
      description: `${postsSection.post3.description}`,
      postLink: "https://www.instagram.com/reel/C71hSrStrAP/",
    },

    {
      id: 4,
      name: `${postsSection.post4.title}`,
      imgUrl: event1,
      description: `${postsSection.post4.description}`,
      postLink: "https://www.instagram.com/p/CjsCx57v_rL/",
    },

    {
      id: 5,
      name: `${postsSection.post5.title}`,
      imgUrl: event5,
      description: `${postsSection.post5.description}`,
      postLink: "https://www.instagram.com/p/C8r98U4oKwy/",
    },
    {
      id: 6,
      name: `${postsSection.post6.title}`,
      imgUrl: event6,
      description: `${postsSection.post6.description}`,
      postLink: "https://www.instagram.com/p/DEh-adYyD7C/",
    },
    // {
    //   id: 6,
    //   name: "Blanket donation",
    //   imgUrl: event6,
    //   description: "Blanket distribution to the needy and homeless for this winter.",
    //   postLink: "https://www.instagram.com/p/DEh-adYyD7C/",
    // },
  ];

  var groupsCreatedOne = [];
  var groupsCreatedTwo = [];

  items.map((item, i) => {
    if (i % 2 === 0) {
      if (i !== items.length - 1) {
        groupsCreatedOne.push([item, items[i + 1]]);
      } else {
        groupsCreatedOne.push([item]);
      }
    }
    groupsCreatedTwo.push([item]);
  });

  return (
    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      mt={2}
      py={4}
      pb={2}
      // px={{ xs: 2, lg: 0 }}
      sx={{ backgroundColor: "#f0f2f5" }}
      borderRadius={"10px"}
      mx={-2}
    >
      <Container my={0} py={0}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              textAlign: "center",
              pb: 2,
              pt: 3,
            }}
          >
            <MKTypography
              variant="h3"
              sx={{ fontWeight: "500" }}
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              fontSize={{ xs: "1.5rem", sm: "1.5rem", md: "1.75rem", lg: "1.875rem" }}
            >
              <b>{postsSection.title}</b>
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container lg={12}>
          {width < 768 ? (
            <MKBox pt={1} width="100%">
              <MKCarousel1 item={groupsCreatedTwo} navButtons={true} />
            </MKBox>
          ) : (
            <MKBox pt={1} width="100%">
              <MKCarousel1 item={groupsCreatedOne} navButtons={true} />
            </MKBox>
          )}
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
