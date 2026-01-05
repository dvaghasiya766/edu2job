import { Link, Typography } from "@mui/material";
import { Colors } from "../Consts/Colors";
import React from "react";

interface FormBodyTextProps {
  text: string;
  redirectionPath?: string;
  linkText?: string;
  textAlign?: any;
  fullWidth?: boolean;
}

const FormBodyText = ({
  text,
  linkText,
  redirectionPath,
  textAlign,
  fullWidth = false,
}: FormBodyTextProps) => {
  return (
    <Typography
      variant="body1"
      color={Colors.SubTitle}
      fontSize={14}
      textAlign={textAlign ?? { xs: "center", md: "start" }}
      padding={0}
      marginBottom={{ xs: 1, md: 0 }}
      width={fullWidth ? "100%" : "auto"}
    >
      {text}{" "}
      <Link href={redirectionPath} fontWeight={700} color={Colors.GradientBlue}>
        {linkText}
      </Link>
    </Typography>
  );
};

export default FormBodyText;
