import { useRouteLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Clock from "../clock/Clock";
import Borders from "./Borders";
import ForecastApp from "../foreCastApp/ForecastApp";
import { Triangle } from "react-loader-spinner";
import { ModeAction } from "../../store/context/mode";
import { prepareData, findBorders } from "../../helpers/prepareData";
function CountryDetailed({ country }) {
  const hasPosition = useLocation().state;
  const context = useContext(ModeAction);
  const { countries } = useRouteLoaderData("main");
  const [thisCountries, setCoutries] = useState();

  function handleTabClick(id) {
    if (id === "Weather") {
      navigate("weather", { state: attributes });
    }
    setTabActive(id);
  }
  let {
    country: [count],
  } = country;
  const [lag, crr, capital, subReg] = prepareData(country);
  let bordersArray = [];

  if (count.borders && thisCountries) {
    bordersArray = findBorders(count, thisCountries);
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

  if (thisCountries === null) {
    return (
      <div id="loading">
        <Triangle
          visible={true}
          height="300"
          width="300"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  } else {
    return (
      <section id="expand">
        <div>
          <div>
            <Link
              to={"/"}
              className={context.mode ? "btnExp light" : "btnExp dark"}
            >
              <span>⬅ </span>
              <span>Back</span>
            </Link>
          </div>
          <div id="contExp">
            <div
              id="flag"
              style={{ backgroundImage: `url(${count.flags.png})` }}
            ></div>
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
                <h1> </h1>
                <h1> </h1>
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
              {bordersArray.length > 0 ? (
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
              <div className="weather_cont">
                <ForecastApp
                  cap={hasPosition ? hasPosition : capital}
                  call={{ country: true }}
                />
              
              </div>
              <Clock
                cca2={count.cca2}
                name={count.name.common}
                capital={
                  hasPosition ? hasPosition : capital[0].replace(" ", "_")
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CountryDetailed;
