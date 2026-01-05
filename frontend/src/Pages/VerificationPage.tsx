import { Avatar, Box } from "@mui/material";
import { Colors } from "../Consts/Colors";
import Logo from "../Assets/EDU2 Logo.png";
import FormHeading from "../Components/FormHeading";
import FormBodyText from "../Components/FormBodyText";
import VerificationForm from "../Forms/VerificationForm";
import React from "react";
import { Pages } from "../Consts/Pages";

const VerificationPage = () => {
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
        maxHeight="80vh"
        maxWidth="100%"
        padding={4}
        borderRadius={3}
        boxShadow="0px 6px 18px rgba(0,0,0,0.18)"
        boxSizing="border-box"
        overflow="hidden"
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
              alt="Edu2Job Logo"
              src={Logo}
              sx={{ width: 56, height: 56 }}
              variant="square"
            />
            <FormHeading
              mainTitle="Complete Your Profile"
              subTitle="Add your academic details to get personalized job recommendations."
            />
          </Box>
          <FormBodyText
            text="Already completed verification?"
            linkText="Login Here."
            redirectionPath={Pages.LOGIN}
          />
        </Box>
        <VerificationForm />
      </Box>
    </Box>
  );
};

export default VerificationPage;