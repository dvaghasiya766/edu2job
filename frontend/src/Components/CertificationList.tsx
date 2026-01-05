import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Colors } from "../Consts/Colors";

interface Certification {
  title: string;
  issuer: string;
  year: number;
}

interface CertificationListProps {
  certifications: Certification[];
}

const CertificationList = ({ certifications }: CertificationListProps) => {
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "background.default" }}>
        {/* Heading */}
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: Colors.LabelText, mb: 1 }}
        >
          Certifications
        </Typography>

        {/* List */}
        <List dense disablePadding>
          {certifications.map((cert, index) => (
            <ListItem key={index} sx={{ px: 0, alignItems: "start" }}>
              <WorkspacePremiumIcon
                sx={{ color: Colors.LabelText, fontSize: 22, mr: 1, mt: "3px" }}
              />

              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                    {cert.title}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: 14, color: Colors.SubTitle }}>
                    {cert.issuer} • {cert.year}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CertificationList;
