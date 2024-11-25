import { useRouteLoaderData, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Clock from "../clock/Clock";
import Borders from "./Borders";
import ForecastApp from "../foreCastApp/ForecastApp";
import { Triangle } from "react-loader-spinner";
import { ModeAction } from "../../store/context/mode";
import { prepareData, findBorders } from "../../helpers/prepareData";
import { useSelector } from "react-redux";
import Leaflet from "../ui/Leaflet";

function CountryDetailed({ country }) {
  const hasPosition = useLocation().state;
  const url = useLocation().pathname;
  const locDetail = useSelector((state) => state?.location?.locDetail);
  const location = useSelector((state) => state.location.loc.country);
  const context = useContext(ModeAction);
  const { countries } = useRouteLoaderData("main");
  const [thisCountries, setCoutries] = useState();
  let code = locDetail.country_code || locDetail.country;
  let {
    country: [count],
  } = country;
  let [lag, crr, capital, subReg, cca2, latlng] = prepareData(country);

  if (hasPosition && url === "/" + code) {
    latlng = [locDetail.lat, locDetail.lon];
  }
  let bordersArray = [];
  if (count.borders && thisCountries) {
    bordersArray = findBorders(count, thisCountries);
  }
  let controlers = (
    <Link to={"/"} className={context.mode ? "btnExp light" : "btnExp dark"}>
      <span>⬅ </span>
      <span>Back</span>
    </Link>
  );
  if (location != "IE" && url === "/IRL") {
    controlers = (
      <>
        <Link
          to={"/"}
          className={context.mode ? "btnExp light" : "btnExp dark"}
        >
          <span>⬅ </span>
          <span>Back</span>
        </Link>
        <Link
          to={"/Ireland"}
          className={context.mode ? "btn_ie light" : "btn_ie dark "}
        >
          <span>Irland Counties</span>
        </Link>
      </>
    );
  }
  useEffect(() => {
    if (!thisCountries) {
      async function parse() {
        const data = await countries;
        setCoutries(data);
      }
      parse();
    }
  }, []);

  useEffect(() => {
console.log("COMPONET MONTED")

return ()=>{
console.log("COMPONET UNMONTED");

}


  }, []);

  if (thisCountries === null) {
    return (
      <div id="loading">
        <Triangle
          visible={true}
          height="300"
          width="300"
          color="#4fa94d"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  } else {
    return (
      <section id="expand">
        <div>
          <div className="btn_control">{controlers}</div>
          <div id="contExp">
            <div className="flag_map">
              <div
                id="flag"
                style={{ backgroundImage: `url(${count.flags.png})` }}
              ></div>
              <Leaflet
                key={capital}
                coordinates={latlng}
                capital={hasPosition ? locDetail?.city : capital}
              />
            </div>
            <div id="holdInf">
              <div className="inf">
                <h1>{count.name.common}</h1>
                <p>
                  <strong>Population: </strong>
                  {count.population}
                </p>
                <p>
                  <strong>Region: </strong>
                  {count.region}
                </p>
                <p>
                  <strong>subregion: </strong>
                  {subReg}
                </p>
                <p>
                  <strong>Capital: </strong>
                  {capital}
                </p>
              </div>
              <div className="inf">
                <h1 style={{ color: "transparent" }}>asdfsadf </h1>
                <p>
                  <strong>Top Level Domain: </strong>
                  {count.tld}
                </p>
                <p>
                  <strong>Currencies: </strong>
                  {crr}
                </p>
                <p>
                  <strong>Languages: </strong>
                  {lag}
                </p>
              </div>
              {bordersArray?.length > 0 ? (
                <div id="border">
                  <span id="noBtn">
                    <strong>Border countries: </strong>
                  </span>
                  <div id="btnBor">
                    {bordersArray.map((brds) => (
                      <Borders key={brds.id} id={brds.id} name={brds.name} />
                    ))}
                  </div>
                </div>
              ) : null}
              <ThisForeApp
                cca2={cca2}
                capital={capital}
                hasPosition={hasPosition}
                locDetail={locDetail}
                coordinates={latlng}
              />
              <Clock
                cca2={count.cca2}
                name={count.name.common}
                capital={hasPosition ? locDetail?.city : null}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
function ThisForeApp({ capital, hasPosition, locDetail, cca2, coordinates }) {
  const countryObj = { data: [] };

  if (hasPosition) {
    countryObj.data[0] = {
      latitude: locDetail.lat,
      longitude: locDetail.lon,
      name: locDetail.city,
      countryCode: locDetail?.country_code || locDetail?.country,
    };
  } else {
    if (coordinates) {
      countryObj.data[0] = {
        latitude: coordinates[0],
        longitude: coordinates[1],
        name: capital,
        countryCode: cca2,
      };
    }
  }

  return (
    <div className="weather_cont">
      <ForecastApp cap={{ ...countryObj }} call={{ country: true }} />
    </div>
  );
}

export default CountryDetailed;
