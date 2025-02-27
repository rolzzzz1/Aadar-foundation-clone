// import { useState } from "react";
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import Switch from "@mui/material/Switch";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import team from "assets/images/aboutPageImages/teamImg.jpg";

function Volunteer() {
  //   const [checked, setChecked] = useState(true);

  //   const handleChecked = () => setChecked(!checked);

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    // console.log(data);

    emailjs
      .sendForm("service_a7f8kvk", "template_kj0zzo9", form.current, {
        publicKey: "i1eYRzEru3UMSm8qR",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          console.log(data);
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  // const handleSubmit = (event) => {
  //   const formData = new FormData(event.target);
  //   const data = Object.fromEntries(formData.entries());
  //   // const result = registerUserSchema.safeParse(data);

  //   // if (!result.success) {
  //   //   event.preventDefault();
  //   //   // handle errors here.
  //   // }

  //   event.preventDefault();
  //   console.log("submitted");
  //   console.log(data);
  //   // console.log(formData.get("email"));
  // };

  // const handleSubmitAction = (formData) => {
  //   console.log(formData.entries);
  // };

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
            Get Involved
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
        <MKBox component="section" my={4}>
          <Container>
            <Grid container alignItems="flex-start">
              <Grid
                item
                md={12}
                lg={4}
                sx={{
                  // ml: { xs: 0, lg: 3 },
                  mb: { xs: 8, md: 8, lg: 0 },
                }}
              >
                {/* <Container> */}
                <MKTypography variant="h4" sx={{ fontWeight: "500" }} pb={4}>
                  Join us as a volunteer
                </MKTypography>
                <MKBox
                  component="img"
                  src={team}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  // width="100%"
                  sx={{
                    height: { xs: "90%", sm: "80%", md: "80%", lg: "80%" },
                    width: { xs: "80%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  // height="90%"
                  my={2}
                ></MKBox>
                <MKTypography variant="body1" fontSize="0.9rem" pt={2}>
                  Aadar foundation provides opportunities not only for homeless, helpless, and
                  destitute individuals but also for those who wish to make a meaningful impact in
                  the lives of others. It serves as a growing platform for volunteers dedicated to
                  service.
                  <b>( areas where volunteers are required, what they can expect - come here )</b>
                  We are seeking proactive, enthusiastic, and hardworking volunteers to join us.
                  Volunteers have played a vital role in Aadar Foundation’s work, and we always
                  welcome fresh ideas and skills. To ensure the best match between our expectations
                  and yours, we encourage interested individuals to apply and provide the necessary
                  information.
                </MKTypography>
              </Grid>
              <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
                <MKBox
                  width="100%"
                  component="form"
                  method="post"
                  autocomplete="off"
                  pt={8}
                  // action={handleSubmitAction}
                  ref={form}
                  // onSubmit={handleSubmit}
                  onSubmit={sendEmail}
                >
                  <MKBox p={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          label="Name"
                          name="name"
                          fullWidth
                          required={true}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput variant="outlined" label="Gender" name="gender" fullWidth />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          type="number"
                          name="age"
                          label="Age"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          type="email"
                          name="email"
                          label="Email Address"
                          fullWidth
                          required={true}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          type="tel"
                          name="phone"
                          label="Phone number"
                          fullWidth
                          required={true}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          name="occupation"
                          label="Occupation"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MKInput
                          variant="outlined"
                          label="Address"
                          name="address"
                          multiline
                          fullWidth
                          required={true}
                          rows={3}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput variant="outlined" name="city" label="City" fullWidth />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput variant="outlined" name="state" label="State" fullWidth />
                      </Grid>
                      <Grid item xs={12}>
                        <MKInput
                          variant="outlined"
                          label="Brief profile"
                          name="profile"
                          multiline
                          fullWidth
                          required={true}
                          rows={5}
                        />
                      </Grid>
                      {/* <Grid item xs={12} alignItems="center" ml={-1}>
                        <Switch checked={checked} onChange={handleChecked} />
                        <MKTypography
                          variant="button"
                          fontWeight="regular"
                          color="text"
                          ml={-1}
                          sx={{ cursor: "pointer", userSelect: "none" }}
                          onClick={handleChecked}
                        >
                          &nbsp;&nbsp;I agree the&nbsp;
                        </MKTypography>
                        <MKTypography
                          component="a"
                          href="#"
                          variant="button"
                          fontWeight="regular"
                          color="dark"
                        >
                          Terms and Conditions
                        </MKTypography>
                      </Grid> */}
                    </Grid>
                    <Grid container item justifyContent="center" xs={12} my={2} pt={4}>
                      <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                        Submit
                      </MKButton>
                    </Grid>
                  </MKBox>
                </MKBox>
              </Grid>
            </Grid>
          </Container>
        </MKBox>

        {/* <MKBox component="section" py={12}>
          <Container>
            <Grid
              container
              item
              justifyContent="center"
              xs={10}
              lg={7}
              mx="auto"
              textAlign="center"
            >
              <MKTypography variant="h4" sx={{ fontWeight: "500" }} pb={4}>
                Join us as a volunteer
              </MKTypography>
              <MKTypography
                fontSize={{ xs: "0.8rem", md: "1rem" }}
                mx="auto"
                paddingTop="20px"
                sx={{ letterSpacing: "0.05rem" }}
              >
                The organization provides opportunities not only for homeless, helpless, and
                destitute individuals but also for those who wish to make a meaningful impact in the
                lives of others. It serves as a growing platform for volunteers dedicated to
                service.
                <b>( areas where volunteers are required, what they can expect - come here )</b>
                We are seeking proactive, enthusiastic, and hardworking volunteers to join us.
                Volunteers have played a vital role in Aadar Foundation’s work, and we always
                welcome fresh ideas and skills. To ensure the best match between our expectations
                and yours, we encourage interested individuals to apply and provide the necessary
                information.
              </MKTypography>
              <MKTypography variant="h4" sx={{ fontWeight: "500" }} pb={4} pt={8}>
                New volunteer
              </MKTypography>
            </Grid>
            <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
              <MKBox width="100%" component="form" method="post" autocomplete="off">
                <MKBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MKInput variant="standard" label="First Name" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MKInput variant="standard" label="Last Name" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                      <MKInput variant="standard" type="email" label="Email Address" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                      <MKInput
                        variant="standard"
                        label="Your Message"
                        multiline
                        fullWidth
                        rows={6}
                      />
                    </Grid>
                    <Grid item xs={12} alignItems="center" ml={-1}>
                      <Switch checked={checked} onChange={handleChecked} />
                      <MKTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        ml={-1}
                        sx={{ cursor: "pointer", userSelect: "none" }}
                        onClick={handleChecked}
                      >
                        &nbsp;&nbsp;I agree the&nbsp;
                      </MKTypography>
                      <MKTypography
                        component="a"
                        href="#"
                        variant="button"
                        fontWeight="regular"
                        color="dark"
                      >
                        Terms and Conditions
                      </MKTypography>
                    </Grid>
                  </Grid>
                  <Grid container item justifyContent="center" xs={12} my={2}>
                    <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                      Send Message
                    </MKButton>
                  </Grid>
                </MKBox>
              </MKBox>
            </Grid>
          </Container>
        </MKBox> */}
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Volunteer;
