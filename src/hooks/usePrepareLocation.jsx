// All commented code is used for testing different cenarios, whether a user allows the use 
// of their positon or if user is in  an remote county in Ireland or if they are in an abroad 
// country.
import { useDispatch, useSelector } from "react-redux";
import { locAction } from "../store/redux/location";
import { preparName } from "../helpers/preparLocName";
import { useRef } from "react";
import {
  fetchCounty,
  fetchCountyInf,
  fetchLocationAnyWay,
} from "../helpers/HTTP";
let haveIt = null;
let myObj = {};
export async function usePrepareLocation() {
  const geoResp = useRef();
  const refPosition = useRef();
  const count = useSelector((state) => state?.location?.count);
  const loc = useSelector((state) => state?.location?.loc);
  const locDetail = useSelector((state) => state?.location?.locDetail);
  const dispatch = useDispatch();
  let censusResp = null;
  let location = null;
  let place = null;
  if (count >= 1 && count <= 2 && loc.name === null) {
    if (refPosition.current === "ok") {
      switch (count) {
        case 1:
          place = geoResp.current?.city ? geoResp.current.city : "Ireland";
          break;
        case 2:
          place = geoResp.current?.state ? geoResp.current.state : "Ireland";
          break;
        default:
          "";
          break;
      }

      setIrelandData({
        country: geoResp.current.country_code.toUpperCase(),
        lat: geoResp.current.lat,
        lon: geoResp.current.lon,
        name: place,
      });
    } else {
      setCountry();
    }
  }
  if (locDetail.name === null) {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => showPosition(position),
        positionRefused
      );
    }
  }
  async function showPosition(position) {
    refPosition.current = "ok";
    location = position?.coords;
    // const { latitude: lat, longitude: lon } = position?.coords;
    // Cordintation Test Espain (Vaència city):(
    const lat = 39.45104033807325;
    const lon = -0.35980224609375006;
    //                                         )

    // Cordintation Test Ireland county(Naas):(
    // const lat = 53.21960194869829
    // const lon =-6.654281616210938
    //                                   )

    const {
      data: {
        features: [properties],
      },
    } = await fetchCounty(lat, lon);
    const content = properties["properties"];

    for (let key in content) {
      if (content.hasOwnProperty(key)) {
        if (typeof content[key] != "object") {
          var value = content[key];
          myObj[key] = value;
        }
      }
    }
    myObj.country_code = myObj.country_code.toUpperCase();
    geoResp.current = myObj;
    dispatch(locAction?.setFullLoc({ ...myObj }));
    let preparPlace = null;
    // const n = myObj.country_code;
    const n = "ES";
    if (n === "IE") {
      if (myObj?.district) {
        preparPlace = myObj.district;
      } else if (myObj?.state) {
        preparPlace = myObj.state;
      } else {
        preparPlace = myObj.country;
      }
      setIrelandData({
        country: myObj.country_code.toUpperCase(),
        lat: myObj.lat,
        lon: myObj.lon,
        name: preparPlace,
      });
    } else {
      if (myObj?.city) {
        preparPlace = myObj.city;
      } else if (myObj?.state) {
        preparPlace = myObj.state;
      }
      dispatch(
        locAction?.setLoc({
          country: n,
          lat: myObj.lat,
          lon: myObj.lon,
          name: myObj.city,
        })
      );
      setCountry();
    }
  }

  async function positionRefused() {
    refPosition.current = "no";
    haveIt = await fetchLocationAnyWay();
    let myObj = null;
    const place = haveIt?.data?.country?.iso_code;
    // const place = "ESP";
    if (place === "IE") {
      myObj = {
        country: haveIt?.data?.country?.iso_code,
        lat: haveIt?.data?.location?.latitude,
        lon: haveIt?.data?.location?.longitude,
        name: haveIt?.data?.city?.name,
      };
      dispatch(locAction?.setFullLoc({ ...myObj }));
      setIrelandData({ ...myObj });
    } else {
      const fakeResp = {
        country: haveIt?.data?.country?.iso_code,
        lat: haveIt?.data?.location?.latitude,
        lon: haveIt?.data?.location?.longitude,
        name: haveIt?.data?.city?.name,
        city: haveIt?.data?.city?.name,
      };
      // Cordintation Test Espain(Palencia city):(
      // const fakeResp = {
      //   country: "ESP",
      //   lat: 41.95131994679697,
      //   lon: -4.526367187500001,
      //   name: "Valencia",
      //   city: "Valencia",
      // };
      //
      //                                         )
      dispatch(locAction.setLoc(fakeResp));
      dispatch(locAction?.setFullLoc({ ...fakeResp }));
    }
    setCountry();
  }
  function setCountry(
    country = "IE",
    lat = 53.350551318399916,
    lon = -6.328125000000001,
    name = "Dublin"
  ) {
    setIrelandData({ country, lat, lon, name });
  }
  async function setIrelandData(weatherResp) {
    const data = weatherResp;
    data.name = preparName(data.name);
    censusResp = await fetchCountyInf();
    if (censusResp?.status === 200) {
      dispatch(locAction?.setData(censusResp?.data?.features));
      dispatch(locAction?.setSearchValues());
      dispatch(locAction?.findDistrict(data));
    }
  }
}
