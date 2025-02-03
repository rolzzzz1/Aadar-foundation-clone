import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// import Carousel from "react-material-ui-carousel";
// import { Paper, Button } from "@mui/material";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";

import event1 from "assets/images/event 1.jpg";
import event2 from "assets/images/event 2.jpg";
import event3 from "assets/images/event 3.jpg";

function Work() {
  // function Example() {
  //   var items = [
  //     {
  //       eventOne: {
  //         name: "Random Name #1",
  //         description: "Probably the most random thing you have ever seen!",
  //       },
  //       eventTwo: {
  //         name: "Random Name #2",
  //         description: "Hello World!",
  //       },
  //       eventThree: {
  //         name: "Random Name #3",
  //         description: "indicator icon, user specified styles Another random thing!",
  //       },
  //     },
  //     {
  //       eventOne: {
  //         name: "Random Name #4",
  //         description: "Probably the most random thing you have ever seen!",
  //       },
  //       eventTwo: {
  //         name: "Random Name #5",
  //         description: "Hello World!",
  //       },
  //       eventThree: {
  //         name: "Random Name #6",
  //         description: "indicator icon, user specified styles Another random thing!",
  //       },
  //     },
  //   ];

  //   return (
  //     <Carousel animation="fade">
  //       {items.map((item, i) => (
  //         <Grid container key={i} spacing={3}>
  //           <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
  //             <TransparentBlogCard
  //               image={event1}
  //               title={item.eventOne.name}
  //               description="With your invaluable support, service work for the homeless and destitute victims is continuing in Ashram Swarg Sadan. "
  //               action={{
  //                 type: "internal",
  //                 route: "",
  //                 color: "info",
  //                 label: "Read More",
  //               }}
  //             />
  //           </Grid>
  //           <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
  //             <TransparentBlogCard
  //               image={event2}
  //               title={item.eventTwo.name}
  //               description="Little children of ecs bagless school came and visited Ashram Swarg Sadan Gwalior"
  //               action={{
  //                 type: "internal",
  //                 route: "",
  //                 color: "info",
  //                 label: "Read More",
  //               }}
  //             />
  //           </Grid>
  //           <Grid
  //             item
  //             xs={12}
  //             lg={4}
  //             sx={{
  //               ml: "auto",
  //               mt: { xs: 3, lg: 0 },
  //             }}
  //           >
  //             <TransparentBlogCard
  //               image={event3}
  //               title={item.eventThree.name}
  //               description="A youth was found in a deranged condition in Sonpura of Hastinapur, whom the police kept in Swarg Sadan Ashram and after 14 days, he left for his country Nepal. "
  //               action={{
  //                 type: "internal",
  //                 route: "",
  //                 color: "info",
  //                 label: "Read More",
  //               }}
  //             />
  //           </Grid>
  //         </Grid>
  //       ))}

  //       {/* {items.map((item, i) => (
  //         <Paper key={i}>
  //           <h2>{item.name}</h2>
  //           <p>{item.description}</p>
  //           <Button className="CheckButton">Check it out!</Button>
  //         </Paper>
  //       ))} */}
  //     </Carousel>
  //   );
  // }

  return (
    // <MKBox
    //   component="section"
    //   variant="gradient"
    //   position="relative"
    //   mt={2}
    //   py={4}
    //   pb={0}
    //   px={{ xs: 2, lg: 0 }}
    //   mx={-2}
    // >
    //   <Container my={0} py={0}>
    //     <Grid container>
    //       <Grid item xs={12} md={12} sx={{ textAlign: "center", mb: 4 }}>
    //         <MKTypography variant="h3" color="darkText">
    //           Our recent posts
    //         </MKTypography>
    //       </Grid>
    //     </Grid>
    //     <Example />
    //   </Container>
    // </MKBox>

    <MKBox
      component="section"
      variant="gradient"
      position="relative"
      mt={2}
      py={4}
      pb={0}
      px={{ xs: 2, lg: 0 }}
      mx={-2}
    >
      <Container my={0} py={0}>
        <Grid container mb={4}>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <MKTypography
              variant="h3"
              sx={{ fontWeight: "500" }}
              fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
              mb={4}
            >
              Our recent posts
            </MKTypography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid
            item
            xs={10}
            md={8}
            lg={4}
            sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}
            mx="auto"
            mb={6}
          >
            <TransparentBlogCard
              image={event1}
              title="Old Newspapers Donation"
              description="With your invaluable support, service work for the homeless and destitute victims is continuing in Ashram Swarg Sadan. "
              action={{
                type: "external",
                route: "https://www.instagram.com/p/CjsCx57v_rL/",
                color: "info",
                label: "Read More",
              }}
            />
          </Grid>
          <Grid
            item
            xs={10}
            md={8}
            lg={4}
            sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}
            mx="auto"
            mb={6}
          >
            <TransparentBlogCard
              image={event2}
              title="ECS Bagless school visit"
              description="Little children of ecs bagless school came and visited Ashram Swarg Sadan Gwalior"
              action={{
                type: "external",
                route: "https://www.instagram.com/reel/DEwauX0vLv-/",
                color: "info",
                label: "Read More",
              }}
            />
          </Grid>
          <Grid
            item
            xs={10}
            md={8}
            lg={4}
            sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}
            mx="auto"
            mb={6}
          >
            <TransparentBlogCard
              image={event3}
              title="Lost young boy went home"
              description="A youth was found in a deranged condition in Sonpura of Hastinapur, whom the police kept in Swarg Sadan Ashram and after 14 days, he left for his country Nepal. "
              action={{
                type: "external",
                route: "https://www.instagram.com/reel/C71hSrStrAP/",
                color: "info",
                label: "Read More",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Work;
