import { Typography } from "@mui/material";
import React from "react";
import { Colors } from "../Consts/Colors";

interface FormHeadingProps {
  mainTitle: string;
  subTitle?: string;
  alignCenter?: boolean;
}

const FormHeading = ({
  mainTitle,
  subTitle,
  alignCenter,
}: FormHeadingProps) => {
  return (
    <>
      <Typography
        variant="h2"
        fontSize={40}
        marginTop={1.5}
        fontWeight={500}
        fontFamily={"Niconne"}
        color={Colors.GradientBlue}
        textAlign={{ xs: "center", md: alignCenter ? "center" : "start" }}
      >
        {mainTitle}
      </Typography>
      {subTitle && (
        <Typography
          paddingX={{ xs: 1, md: 0 }}
          fontSize={14}
          variant="body1"
          fontFamily="Oswald"
          color={Colors.SubTitle}
          marginBottom={{ xs: 0.5, md: 0 }}
          textAlign={{ xs: "center", md: alignCenter ? "center" : "start" }}
        >
          {subTitle}
        </Typography>
      )}
    </>
  );
};

export default FormHeading;
