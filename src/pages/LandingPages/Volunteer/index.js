import { useState } from "react";
import React, { useRef } from "react";

// import emailjs from "@emailjs/browser";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
// import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
// import FormLabel from "@mui/material/FormLabel";

// import Switch from "@mui/material/Switch";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
// import MKAlert from "components/MKAlert";

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
import { FormControl } from "@mui/material";

function Volunteer() {
  //   const [checked, setChecked] = useState(true);

  //   const handleChecked = () => setChecked(!checked);

  const form = useRef();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [error, setError] = useState("Please fill the required ( * ) fields ");

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    if (
      data.name !== "" &&
      data.email !== "" &&
      data.phone.length === 10 &&
      data.phone !== "" &&
      data.address !== "" &&
      data.profile !== "" &&
      data.qualification !== "" &&
      data.interests !== ""
    ) {
      setSuccessMsg(true);
      setErrMsg(false);

      // Sending email
      // emailjs
      //   .sendForm("service_a7f8kvk", "template_kj0zzo9", form.current, {
      //     publicKey: "i1eYRzEru3UMSm8qR",
      //   })
      //   .then(
      //     () => {
      //       console.log("SUCCESS!");
      //       console.log(data);
      //     },
      //     (error) => {
      //       console.log("FAILED...", error.text);
      //     }
      //   );
    } else {
      console.log("required field missing");

      if (data.name !== "" && data.email !== "" && data.address !== "" && data.profile !== "") {
        if (data.phone.length !== 0 && data.phone.length !== 10) {
          setError("Please enter valid phone number");
        }
      }

      setErrMsg(true);
      setSuccessMsg(false);
    }

    // emailjs
    //   .sendForm("service_a7f8kvk", "template_kj0zzo9", form.current, {
    //     publicKey: "i1eYRzEru3UMSm8qR",
    //   })
    //   .then(
    //     () => {
    //       console.log("SUCCESS!");
    //       console.log(data);
    //     },
    //     (error) => {
    //       console.log("FAILED...", error.text);
    //     }
    //   );
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
                  Join us as a volunteer{" "}
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
                  // action={submitAction}
                  ref={form}
                  // onSubmit={handleSubmit}
                  onSubmit={sendEmail}
                >
                  <MKBox p={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MKInput variant="outlined" label="Name *" name="name" fullWidth />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        display="flex"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }} pl={1}>
                          Gender
                        </MKTypography>

                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue={"male"}
                        >
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            name="gender"
                            label={
                              <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                Male
                              </MKTypography>
                            }
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio size={"small"} />}
                            name="gender"
                            label={
                              <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                Female
                              </MKTypography>
                            }
                          />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          type="email"
                          name="email"
                          label="Email *"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          type="tel"
                          name="phone"
                          label="Phone number *"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          name="qualification"
                          label="Qualification *"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          name="occupation"
                          label="Present occupation"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MKInput
                          variant="outlined"
                          label="Address *"
                          name="address"
                          multiline
                          fullWidth
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
                          label="Brief profile *"
                          name="profile"
                          multiline
                          fullWidth
                          rows={5}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                          Areas of interests *
                        </MKTypography>
                        <MKBox
                          mt={2}
                          pl={2}
                          py={1}
                          sx={{ border: "1px solid rgb(73, 80, 87, 0.2)" }}
                          borderRadius="5px"
                        >
                          <FormControl component={"fieldset"}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox defaultChecked name="interests" value="medical" />
                                }
                                label={
                                  <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                    Medical
                                  </MKTypography>
                                }
                                defaultChecked
                              />
                              <FormControlLabel
                                control={<Checkbox name="interests" value="administration" />}
                                label={
                                  <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                    Administration
                                  </MKTypography>
                                }
                              />
                              <FormControlLabel
                                control={<Checkbox name="interests" value="..." />}
                                label={
                                  <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                    ...
                                  </MKTypography>
                                }
                              />
                            </FormGroup>
                          </FormControl>
                        </MKBox>
                      </Grid>
                      <Grid item xs={12}>
                        <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                          Upload photo id
                        </MKTypography>
                        <MKBox
                          mt={2}
                          py={2}
                          pl={2}
                          sx={{ border: "1px solid rgb(73, 80, 87, 0.2)" }}
                          borderRadius="5px"
                          display="flex"
                          alignItems="center"
                        >
                          <input type="file" accept="image/*" name="photoId"></input>
                        </MKBox>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} my={1} pt={1}>
                      {errMsg && (
                        <MKBox
                          border="2px solidrgb(65, 60, 60)"
                          borderRadius="5px"
                          width="100%"
                          pl={2}
                        >
                          <MKTypography color="error" fontSize="1rem">
                            {error}
                          </MKTypography>
                        </MKBox>
                      )}
                    </Grid>
                    <Grid container item xs={12} my={1} pt={1}>
                      {successMsg && (
                        <MKBox border="2px solid #4CAF50" borderRadius="5px" width="100%" pl={2}>
                          <MKTypography color="success" fontSize="1rem">
                            Request sent
                          </MKTypography>
                        </MKBox>
                      )}
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
      </Card>

      {/* Footer */}
      <MKBox pt={2} px={0} mt={1}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </MKBox>
  );
}

export default Volunteer;
