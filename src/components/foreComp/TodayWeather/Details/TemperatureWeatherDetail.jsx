import { Box, Typography } from '@mui/material';
import { ModeAction } from "../../../../store/context/mode";
import { useContext } from "react";

const TemperatureWeatherDetail = (props) => {
  const context = useContext(ModeAction);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontWeight: "600",
          fontSize: { xs: "12px", sm: "17px", md: "17px" },
          color: context.mode ? "black" : "white",
          textTransform: "uppercase",
          lineHeight: 1,
          marginBottom: "8px",
          fontFamily: "Poppins",
        }}
      >
        {Math.round(props.temperature)} °C
      </Typography>
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: "12px", sm: "17px", md: "12px" },
          color: context.mode ? "black" : "white",
          lineHeight: 1,
          letterSpacing: { xs: "1px", sm: "0" },
          fontFamily: "Roboto Condensed",
        }}
      >
        {props.description}
      </Typography>
    </Box>
  );
};

export default TemperatureWeatherDetail;
