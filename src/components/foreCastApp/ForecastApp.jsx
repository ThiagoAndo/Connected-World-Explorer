import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Container, Typography } from "@mui/material";
import TodayWeather from "./TodayWeather/TodayWeather";
import { transformDateFormat } from "../../utilities/DatetimeUtils";
import UTCDatetime from "./Reusable/UTCDatetime";
import LoadingBox from "./Reusable/LoadingBox";
import Logo from "../assets/logo.png";
import ErrorBox from "./Reusable/ErrorBox";
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from "../../utilities/DataUtils";
import { ALL_DESCRIPTIONS } from "../../utilities/DateConstants";
import { fetchWeatherData } from "../../helpers/HTTP";
import WeeklyForecast from "./WeeklyForecast/WeeklyForecast";
import { ModeAction } from "../../store/context/mode";
function ForecastApp({ cap, call }) {
  let appContent = null;
  const context = useContext(ModeAction);
  const navigate = useNavigate();
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  function handleTabClick() {
    navigate("weather", { state: cap });
  }
  const searchChangeHandler = async (citiesList) => {
    if (citiesList?.message) {
      setError(true);
      setIsLoading(false);
    } else if (citiesList.data.length === 0) {
      setIsLoading(false);
      setNotFound(true);
    }
    console.log(citiesList?.data[0].name);
    if (citiesList?.data?.length > 0) {
      const dataRet = {
        options: citiesList?.data.map((city) => {
          return {
            value: `${city?.latitude} ${city?.longitude}`,
            label: `${city?.name}, ${city?.countryCode}`,
          };
        }),
      };
      const [latitude, longitude] = dataRet?.options[0]?.value.split(" ");
      setIsLoading(true);
      const currentDate = transformDateFormat();
      const date = new Date();
      let dt_now = Math.floor(date.getTime() / 1000);
      try {
        const [todayWeatherResponse, weekForecastResponse] =
          await fetchWeatherData(latitude, longitude);
        const all_today_forecasts_list = getTodayForecastWeather(
          weekForecastResponse,
          currentDate,
          dt_now
        );
        const all_week_forecasts_list = getWeekForecastWeather(
          weekForecastResponse,
          ALL_DESCRIPTIONS
        );
        setTodayForecast([...all_today_forecasts_list]);
        setTodayWeather({
          city: dataRet?.options[0]?.label,
          ...todayWeatherResponse,
        });
        setWeekForecast({
          city: dataRet.options[0].label,
          list: all_week_forecasts_list,
        });
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    }
  };

  const { data } = cap;
  useEffect(() => {
    searchChangeHandler(cap);
  }, [data[0].name]);

  if (todayWeather && todayForecast && call?.country) {
    appContent = (
      <>
        <TodayContainer>
          <TodayWeather data={todayWeather} />
        </TodayContainer>
        <button
          onClick={handleTabClick}
          className={context.mode ? "btn_weather light" : "btn_weather dark"}
        >
          Full Forecast
        </button>
      </>
    );
  }
  if (todayWeather && todayForecast && call?.full) {
    appContent = (
      <Container
        sx={{
          maxWidth: { xs: "95%", sm: "80%", md: "1100px" },
          width: "100%",
          height: { xs: "fit-content", sm: "fit-content", md: "fit-content" },
          margin: "0 auto",
          padding: "2rem 0 3rem",
          marginTop: "1rem",
          borderRadius: {
            xs: "none",
            sm: "0 0 1rem 1rem",
          },
          boxShadow: {
            xs: "none",
            sm: "rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px",
          },
        }}
      >
        <Grid container columnSpacing={2}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              <Box
                component="img"
                sx={{
                  height: { xs: "16px", sm: "22px", md: "26px" },
                  width: "auto",
                }}
                alt="logo"
                src={Logo}
              />

              <UTCDatetime />
            </Box>
          </Grid>
          <Grid item xs={12} md={todayWeather ? 6 : 12}>
            <Grid item xs={12}>
              <TodayWeather
                data={todayWeather}
                forecastList={todayForecast}
                padding="2rem"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklyForecast data={weekForecast} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }
  if (notFound) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="No weather data found"
        type={"info"}
      />
    );
  }
  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "200px",
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "rgba(255, 255, 255, .8)",
              lineHeight: 1,
              fontFamily: "Poppins",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }
  return appContent;
}
function TodayContainer({ children }) {
  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
            marginBottom: "1rem",
            padding: "1rem .3rem 0rem",
          }}
        >
          <Box
            component="img"
            sx={{
              height: { xs: "9px", sm: "17px", md: "20px" },
              width: "auto",
              marginRight: "10px",
            }}
            alt="logo"
            src={Logo}
          />

          <UTCDatetime />
        </Box>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
}

export default ForecastApp;
