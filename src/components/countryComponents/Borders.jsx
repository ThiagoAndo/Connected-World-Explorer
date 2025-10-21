import { Link } from "react-router-dom";
import { ModeAction } from "../../store/context/mode";
import { useContext } from "react";
import { findBorders } from "../../helpers/prepareData";
import { useState, useEffect } from "react";
function Borders({ borders }) {
  const context = useContext(ModeAction);
  const [bordersArray, setBorderArray] = useState([]);
  useEffect(() => {
    async function fetchBorders() {
      let bds = await findBorders(borders);
      setBorderArray(bds);
    }
    fetchBorders();
  }, []);
  return (
    <div id="border">
      <span id="noBtn">
        <strong>Border countries: </strong>
      </span>
      <div id="btnBor">
        {bordersArray?.length > 0
          ? bordersArray.map((brds, index) => (
              <Link to={`/${borders[index]}`} key={brds} id={brds}>
                <p
                  className={
                    context.mode ? "selectBorder light" : "selectBorder dark"
                  }
                >
                  {brds}
                </p>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
}

export default Borders;
