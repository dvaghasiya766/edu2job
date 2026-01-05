import { Avatar, Box } from "@mui/material";
import { Colors } from "../Consts/Colors";
import { Pages } from "../Consts/Pages";
import Logo from "../Assets/EDU2 Logo.png";
import FormHeading from "../Components/FormHeading";
import FormBodyText from "../Components/FormBodyText";
import LogInFrom from "../Forms/LogInFrom";
import React from "react";

const LogInPage = () => {
  return (
    <Box
      height="100dvh"
      maxHeight="100%"
      width="100vw"
      maxWidth="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor={Colors.PrimaryBG}
      px={1}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "center", md: "start" }}
        alignItems="center"
        bgcolor={Colors.SecondaryBG}
        maxHeight="100%"
        maxWidth="100%"
        padding={4}
        borderRadius={3}
        boxShadow="0px 6px 18px rgba(0,0,0,0.18)"
        boxSizing="border-box"
      >
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "start" }}
          height="100%"
          width="100vw"
          maxWidth={600}
          padding={{ xs: 1, md: 3 }}
          boxSizing="border-box"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems={{ xs: "center", md: "flex-start" }}
          >
            <Avatar
              alt="Remy Sharp"
              src={Logo}
              sx={{ width: 56, height: 56 }}
              variant="square"
            />
            <FormHeading
              mainTitle="Secure Login to Edu2Job"
              subTitle="Connecting students with career-ready training and opportunities."
            />
          </Box>
          <FormBodyText
            text="If you don't have an account! Kindly"
            linkText="Register Here."
            redirectionPath={Pages.REGISTER}
          />
        </Box>
        <LogInFrom />
      </Box>
    </Box>
  );
};

export default LogInPage;
