import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// import Carousel from "react-material-ui-carousel";
// import { Paper, Button } from "@mui/material";

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

  var items = [
    {
      id: 1,
      name: "Swarg Sadan Ashram expansion",
      imgUrl: event4,
      description:
        "Swarg Sadan Ashram will be expanded in 4 Bigha, thousands of homeless people will get benefit.",
      postLink: "https://www.instagram.com/p/DFpBg91PI0y/",
    },

    {
      id: 2,
      name: "ECS Bagless school visit",
      imgUrl: event2,
      description:
        "Little children of ecs bagless school came and visited Ashram Swarg Sadan Gwalior.",
      postLink: "https://www.instagram.com/reel/DEwauX0vLv-/",
    },

    {
      id: 3,
      name: "Lost young boy went home",
      imgUrl: event3,
      description:
        "A youth was found in a deranged condition whom the police kept in Swarg Sadan Ashram, left for his country Nepal.",
      postLink: "https://www.instagram.com/reel/C71hSrStrAP/",
    },

    {
      id: 4,
      name: "Old Newspapers Donation",
      imgUrl: event1,
      description:
        "With your invaluable support, service work for the homeless and destitute victims is continuing in Ashram Swarg Sadan.",
      postLink: "https://www.instagram.com/p/CjsCx57v_rL/",
    },

    {
      id: 5,
      name: "Beautiful moment captured",
      imgUrl: event5,
      description:
        "A beautiful moment captured at the ashram where a resident is helping the other with his lunch. ",
      postLink: "https://www.instagram.com/p/C8r98U4oKwy/",
    },
    {
      id: 6,
      name: "Blanket donation",
      imgUrl: event6,
      description: "Blanket distribution to the needy and homeless for this winter.",
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
              Instagram posts
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
