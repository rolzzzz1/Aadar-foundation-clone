/* eslint-disable no-param-reassign */
/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function TabsSimple() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabType = (event, newValue) => setActiveTab(newValue);

  return (
    <Container>
      <Grid container item justifyContent="center" xs={12} lg={4} mx="auto">
        <AppBar position="static" sx={{ zIndex: 3 }}>
          <Tabs value={activeTab} onChange={handleTabType}>
            <Tab label="Vision" />
            <Tab label="Mission" />
          </Tabs>
        </AppBar>
      </Grid>
      <MKBox
        sx={{
          backgroundColor: "#f8f9fa",
          padding: "20px 0 40px 0",
          margin: "40px 0",
          borderRadius: "20px",
          minHeight: "270px",
        }}
      >
        {activeTab === 0 ? (
          <MKBox
            component="section"
            // pt={8} my={8}
          >
            <Container>
              <MKBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                padding="0 50px"
              >
                <MKTypography variant={"h4"} py={3}>
                  Vision
                </MKTypography>
                <MKTypography maxWidth="600px" variant="body1" fontSize="0.9rem">
                  To save every helpless hopeless sick person who is in harsh and painful conditions
                  and going towards lingering death due to lack of help and support on roadside,
                  religious and other public places.
                </MKTypography>
              </MKBox>
            </Container>
          </MKBox>
        ) : (
          <MKBox
            component="section"
            // pt={8} my={8}
          >
            <Container>
              <MKBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                padding="0 20px"
              >
                <MKTypography variant={"h4"} py={3}>
                  Mission
                </MKTypography>
                <MKTypography variant="body1" fontSize="0.9rem" maxWidth="800px">
                  To serve the living image of God by helping all those who are facing a hopeless
                  and painful phase in life. The Organization is applying all efforts to save the
                  lives of these persons with the blessing of almighty God. Apna Ghar provides a
                  safe, secure, and homely environment with treatment, shelter, food, clothes and
                  other necessity of life to these homeless helpless deprived sick persons.
                </MKTypography>
              </MKBox>
            </Container>
          </MKBox>
        )}
      </MKBox>
    </Container>
  );
}

export default TabsSimple;
