import React from "react";
import { Box, SvgIcon, Typography } from "@mui/material";
import AirIcon from "@mui/icons-material/Air";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import { ModeAction } from "../../../store/context/mode";
import { useContext } from "react";
const WeeklyForecastItem = ({ value, type }) => {
  const context = useContext(ModeAction);

  let iconContent;

  if (type === "temperature")
    iconContent = (
      <ThermostatIcon
        sx={{ fontSize: { xs: "15px", sm: "16px", md: "18px" } }}
      />
    );
  else if (type === "wind")
    iconContent = (
      <AirIcon sx={{ fontSize: { xs: "15px", sm: "16px", md: "18px" } }} />
    );
  else if (type === "clouds")
    iconContent = (
      <FilterDramaIcon
        sx={{ fontSize: { xs: "15px", sm: "16px", md: "18px" } }}
      />
    );
  else if (type === "humidity")
    iconContent = (
      <SvgIcon
        component={OpacityIcon}
        inheritViewBox
        sx={{
          fontSize: { xs: "15px", sm: "16px", md: "18px" },
        }}
      />
    );
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "31px",
        color: context.mode ? "black" : "white",
        gap: { xs: "3px", sm: "4px", md: "6px" },
        width: "100%",
      }}
    >
      {iconContent}
      <Typography
        variant="p"
        component="p"
        sx={{
          fontSize: { xs: "12px", sm: "13px" },
          fontWeight: { xs: "400", sm: "600" },
          color: context.mode ? "black" : "white",
          fontFamily: "Poppins",
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default WeeklyForecastItem;
