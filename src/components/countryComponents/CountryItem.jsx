import { Link } from "react-router-dom";
import { ModeAction } from "../../store/context/mode";
import { useContext } from "react";
import { motion } from "framer-motion";
function CountryItem({ country }) {
  const context = useContext(ModeAction);
  return (
    <Link to={`/${country.cca2}`}>
      <motion.article
        transition={{ type: "spring" }}
        key={country.name.common}
        whileHover={{
          scale: [0.95, 1.3, 1],
          boxShadow: "0px 0px 6px 0px #888888",
        }}
        className={context.mode ? "light" : "dark"}
        style={
          context.mode
            ? {
                border: "black solid 1px",
                boxShadow: "0px 0px 4px 0px #888888",
              }
            : null
        }
        id={country.name.common}
      >
        <div style={{ backgroundImage: `url(${country.flags.png})` }}> </div>
        <div>
          <div>
            <h3>{country.name.common}</h3>
            <p>
              <strong>Population: </strong>
              {country.population}
            </p>
            <p>
              <strong>Region: </strong>
              {country.region}
            </p>
            <p>
              <strong>Capital: </strong>
              {country.capital}
            </p>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default CountryItem;
