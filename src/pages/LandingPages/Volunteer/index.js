import { useState } from "react";
import React, { useRef } from "react";

import validator from "validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import "react-international-phone/style.css";

import emailjs from "@emailjs/browser";

// @mui material components
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { MKPhone } from "components/MKPhone";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage2 from "assets/images/mainThemeImages/swargSadanBlack.png";
import bgImage from "assets/images/mainThemeImages/smallBrushstroke2.svg";
import team from "assets/images/aboutPageImages/teamImg.jpg";

function Volunteer() {
  const form = useRef();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [imageFileError, setImageFileError] = useState("");
  const [error, setError] = useState("Please fill the required ( * ) fields ");

  const [emailError, setEmailError] = useState("");
  const validateEmail = (e) => {
    const email = e.target.value;

    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter valid Email!");
    }
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const validatePhone = (inputValue, country) => {
    const countryCode = country.iso2;
    const inputPhone = inputValue;
    const countryDialcode = country.dialCode;

    const phoneNumber = parsePhoneNumberFromString(inputPhone, countryCode);
    if (!phoneNumber || !phoneNumber.isValid()) {
      var code = "+" + countryDialcode;
      if (inputPhone !== code) {
        setPhoneError("Please enter valid number");
      } else {
        setPhoneError("");
      }
      setIsPhoneValid(false);
    } else {
      setPhoneError("");
      setIsPhoneValid(true);
    }
  };

  const [fileValid, setFileValid] = useState(true);

  const handleImageFile = (file) => {
    var fileSizeKb = Math.round(file.target.files[0].size / 1024);

    if (fileSizeKb > 50) {
      setImageFileError(
        "Image size - " + fileSizeKb + "Kb" + " -- Please upload image less than 50kb"
      );
      setFileValid(false);
      setError("Upload valid image");
    } else {
      setImageFileError("");
      setFileValid(true);
      setError("Please fill the required ( * ) fields ");
    }
  };

  const [interestsState, setInterestsState] = React.useState({
    activitiesVolunteer: true,
    medical: false,
    professionals: false,
    management: false,
    prabhujiSeva: false,
    trainer: false,
    counsellor: false,
  });

  const handleChange = (event) => {
    setInterestsState({
      ...interestsState,
      [event.target.name]: event.target.checked,
    });
  };

  const {
    activitiesVolunteer,
    medical,
    professionals,
    management,
    prabhujiSeva,
    trainer,
    counsellor,
  } = interestsState;

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    var interestCheck = Object.values(interestsState).every((item) => item === false);

    if (
      data.name !== "" &&
      data.email !== "" &&
      isPhoneValid &&
      data.qualification !== "" &&
      data.address !== "" &&
      data.profile !== "" &&
      interestCheck !== true &&
      fileValid
    ) {
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
      }, 5000);

      setErrMsg(false);

      // Sending email
      emailjs
        // .send("service_a7f8kvk", "template_kj0zzo9", emailData, { publicKey: "i1eYRzEru3UMSm8qR" })
        .sendForm("service_a7f8kvk", "template_kj0zzo9", form.current, {
          publicKey: "i1eYRzEru3UMSm8qR",
        })
        .then(
          () => {
            console.log(data);
            console.log("SUCCESS!");
          },
          (error) => {
            console.log("FAILED...", error.text);
          }
        );
    } else {
      console.log("required field missing");

      setErrMsg(true);
      setTimeout(() => {
        setErrMsg(false);
      }, 5000);
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
                  mb: { xs: 4, md: 8, lg: 0 },
                }}
              >
                <MKTypography
                  variant="h3"
                  fontSize={{ xs: "1.2rem", sm: "1.5rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  sx={{ letterSpacing: "0.05rem", fontWeight: "500" }}
                  pb={{ xs: 2, sm: 4 }}
                >
                  Join us as a volunteer{" "}
                </MKTypography>
                <MKBox
                  component="img"
                  src={team}
                  alt={"Swarg sadan building image"}
                  borderRadius="xxl"
                  sx={{
                    height: { xs: "90%", sm: "80%", md: "80%", lg: "80%" },
                    width: { xs: "100%", sm: "80%", md: "80%", lg: "100%" },
                  }}
                  fontSize={{ xs: "0.8rem", md: "1rem" }}
                  fontFamily='"Roboto", "Helvetica", "Arial", sans-serif'
                  // sx={{
                  //   letterSpacing: "0.05rem",
                  //   paddingTop: { xs: "40px", sm: "40px", md: "40px", lg: "0px" },
                  // }}
                  my={2}
                ></MKBox>
                <MKTypography variant="body1" fontSize="0.9rem" pt={2}>
                  Aadar foundation provides opportunities not only for homeless, helpless, and
                  destitute individuals but also for those who wish to make a meaningful impact in
                  the lives of others. It serves as a growing platform for volunteers dedicated to
                  service. We are seeking proactive, enthusiastic, and hardworking volunteers to
                  join us. Volunteers have played a vital role in Aadar Foundation’s work, and we
                  always welcome fresh ideas and skills. To ensure the best match between our
                  expectations and yours, we encourage interested individuals to apply and provide
                  the necessary information.
                </MKTypography>
              </Grid>
              <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
                <MKBox
                  width="100%"
                  component="form"
                  method="post"
                  autocomplete="off"
                  minWidth="240px"
                  pt={{ xs: 2, md: 2, lg: 8 }}
                  ref={form}
                  onSubmit={sendEmail}
                >
                  <MKBox py={3} px={0}>
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
                        // justifyContent={"space-around"}
                      >
                        <MKTypography
                          fontSize="0.89rem"
                          sx={{ color: "#6c757d" }}
                          pl={1}
                          pr={{ xs: 2, sm: 3, md: 3, lg: 3 }}
                        >
                          Gender
                        </MKTypography>

                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue={"male"}
                        >
                          <MKBox display="flex">
                            <FormControlLabel
                              value="male"
                              control={<Radio />}
                              name="gender"
                              sx={{ padding: 0.25 }}
                              label={
                                <MKTypography
                                  fontSize={{ xs: "0.75rem", sm: "0.89rem" }}
                                  sx={{ color: "#6c757d" }}
                                >
                                  Male
                                </MKTypography>
                              }
                            />

                            <FormControlLabel
                              value="female"
                              control={<Radio size={"small"} />}
                              name="gender"
                              sx={{ padding: 0.25 }}
                              label={
                                <MKTypography
                                  fontSize={{ xs: "0.75rem", sm: "0.89rem" }}
                                  sx={{ color: "#6c757d" }}
                                >
                                  Female
                                </MKTypography>
                              }
                            />
                          </MKBox>
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          type="email"
                          name="email"
                          label="Email *"
                          onChange={(e) => validateEmail(e)}
                          fullWidth
                        />
                        <Grid item xs={12} md={12} height="0.5rem" pl={1}>
                          <MKTypography color="error" fontSize="0.8rem">
                            {emailError}
                          </MKTypography>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKPhone
                          value={phone}
                          name="phone"
                          onChange={(inputValue, country) => {
                            setPhone(inputValue);
                            validatePhone(inputValue, country);
                          }}
                        />
                        <Grid item xs={12} md={12} height="0.5rem" pl={1}>
                          <MKTypography color="error" fontSize="0.8rem">
                            {phoneError}
                          </MKTypography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          name="age"
                          label="Age"
                          type="number"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          name="qualification"
                          label="Qualification & Year *"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKInput
                          variant="outlined"
                          name="college"
                          label="College / University"
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
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="activitiesVolunteer"
                                  checked={activitiesVolunteer}
                                  onChange={handleChange}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Activities volunteer
                                </MKTypography>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  defaultChecked
                                  name="medical"
                                  onChange={handleChange}
                                  checked={medical}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Medical services
                                </MKTypography>
                              }
                              defaultChecked
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="professionals"
                                  checked={professionals}
                                  onChange={handleChange}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Professionals
                                </MKTypography>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="management"
                                  checked={management}
                                  onChange={handleChange}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Management
                                </MKTypography>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="prabhujiSeva"
                                  checked={prabhujiSeva}
                                  onChange={handleChange}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Prabhuji seva
                                </MKTypography>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="trainer"
                                  checked={trainer}
                                  onChange={handleChange}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Education / Trainer
                                </MKTypography>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="counsellor"
                                  checked={counsellor}
                                  onChange={handleChange}
                                />
                              }
                              label={
                                <MKTypography fontSize="0.89rem" sx={{ color: "#6c757d" }}>
                                  Counsellor
                                </MKTypography>
                              }
                            />
                          </FormGroup>
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
                          overflow="hidden"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            name="photoId"
                            onChange={(e) => handleImageFile(e)}
                          ></input>
                        </MKBox>
                        <Grid item xs={12} md={12} height="0.5rem" pl={1}>
                          <MKTypography color="error" fontSize="0.8rem">
                            {imageFileError}
                          </MKTypography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} my={1} pt={3} minHeight={"60px"}>
                      {errMsg && (
                        <MKBox border="2px solid #F44335" borderRadius="5px" width="100%" pl={2}>
                          <MKTypography color="error" fontSize="1rem">
                            {error}
                          </MKTypography>
                        </MKBox>
                      )}
                      {successMsg && (
                        <MKBox border="2px solid #4CAF50" borderRadius="5px" width="100%" pl={2}>
                          <MKTypography color="success" fontSize="1rem">
                            Request sent
                          </MKTypography>
                        </MKBox>
                      )}
                    </Grid>

                    <Grid container item justifyContent="center" xs={12} my={2} pt={2}>
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
