import axios from "axios";
const WEATHER_KEY = import.meta.env.VITE_WEATHER_SECRETE_KEY;
const TIME_KEY = import.meta.env.VITE_TIME_ZONE_KEY;
// const GEO_KEY = import.meta.env.VITE_GEO_KEY;
const GEOPIFY = import.meta.env.VITE_GEOPIFY;

export async function fetchCountries() {
  let response = null;
  try {
    response = await axios.get("https://restcountries.com/v3.1/all");
  } catch (error) {
    console.log("fetchCountries error: " + error);
  }
  if (response?.status === 200) {
    return response?.data;
  }
}
export async function fetchRegion(region) {
  //API SOURCE:
  // https://restcountries.com/
  let url;
  let response;
  if (region != "all regions")
    url = `https://restcountries.com/v3.1/region/${region}`;
  else url = "https://restcountries.com/v3.1/all";

  try {
    response = await axios.get(url);
  } catch (error) {
    console.log("fetchRegion error: " + error);
  }
  if (response?.status === 200) {
    return response?.data;
  }
}
export async function fetchByCode(code) {
  //API SOURCE:
  // https://restcountries.com/
  let response;
  try {
    response = await axios.get(
      `https://restcountries.com/v3.1/alpha?codes=${code}`
    );
  } catch (error) {
    console.log("fetchRegion error: " + error);
  }
  if (response?.status === 200) {
    return response?.data;
  } else {
    return undefined;
  }
}

export async function loadTimeZone({ lat, lng }) {
  console.log("country");
  console.log(lat + " " + lng);
  // // API SOURCE:
  // // https://timezonedb.com/
  let response;
  try {
    response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${TIME_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`
    );
  } catch (error) {
    console.log("loadTime error: " + error);
  }

  if (response?.ok) {
    const resData = await response?.json();
    return resData;
  } else {
    return undefined;
  }
}
export async function fetchCounty(lat, lon) {
  //API SOURCE:
  // https://www.geoapify.com/
  let response;
  try {
    response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOPIFY}`
    );
  } catch (error) {
    console.log(error);
  }
  if (response?.status === 200) {
    return response;
  } else {
    return undefined;
  }
}
export async function fetchCountyInf() {
  //API SOURCE:
  //https://census2016.geohive.ie/datasets/geohive::population-by-sex-and-marital-status-constituencies-census-2016-theme-1-2-ireland-2016-cso-osi/explore?showTable=true
  let response;
  try {
    response = await axios.get(
      "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Census2016_Theme1Table2_ED/FeatureServer/0/query?where=1%3D1&outFields=ED_ENGLISH,COUNTY,CONTAE,PROVINCE,T1_1AGETT,T1_1AGETF,T1_1AGETM,T1_2SGLF,T1_2SGLM,T1_2SGLT&outSR=4326&f=json"
    );
  } catch (error) {
    console.log(error);
  }
  if (response?.status === 200) {
    return response;
  } else {
    return undefined;
  }
}
export async function fetchWeatherData(lat, lon) {
  //API SOURCE:
  // https://openweathermap.org/
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  try {
    let [weatherPromise, forcastPromise] = await Promise.all([
      fetch(url),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`
      ),
    ]);
    const weatherResponse = await weatherPromise.json();
    const forcastResponse = await forcastPromise.json();
    return [weatherResponse, forcastResponse];
  } catch (error) {
    console.log(error);
  }
}
export async function fetchLocationAnyWay() {
  //API SOURCE:
  // https://www.geoapify.com/
  let response;
  try {
    response = await axios.get(
      `https://api.geoapify.com/v1/ipinfo?&apiKey=${GEOPIFY}`
    );
  } catch (error) {
    console.log(error);
  }
  if (response?.status === 200) {
    return response;
  } else {
    return undefined;
  }
}


/*
export async function fetchSelected(lat, lon) {
  //API SOURCE:
    // https://openweathermap.org/
  let response;
  try {
    response = await axios.get(
      `https: //api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`
    );
  } catch (error) {
    console.log(error);
  }
  if (response?.status === 200) {
    return response;
  } else {
    return undefined;
  }
}
const GEO_API_OPTIONS = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": GEO_KEY,
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};
export async function fetchCities(input) {
  //API SOURCE:
  //https://rapidapi.com/wirefreethought/api/geodb-cities
  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=10000&namePrefix=${input}`,
      GEO_API_OPTIONS
    );

    const data = await response?.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function fetchZone(coutry) {
  //API SOURCE:
  //https://timezonedb.com/
  let response;
  try {
    response = await fetch(
      `https://api.timezonedb.com/v2.1/list-time-zone?key=${TIME_KEY}&format=json&country=${coutry?.cca2}` //https://timezonedb.com/
    );
  } catch (error) {
    console.log("loadZone error: " + error);
  }
  if (response?.ok) {
    const resData = await response?.json();
    return resData;
  } else {
    return undefined;
  }
}
export async function loadTimeZone(zone) {
  //API SOURCE:
  // https://timezonedb.com/
  let response;
  try {
    response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIME_KEY}&format=json&by=zone&zone=${zone}`
    );
  } catch (error) {
    console.log("loadTime error: " + error);
  }

  if (response?.ok) {
    const resData = await response?.json();
    return resData;
  } else {
    return undefined;
  }
}
*/