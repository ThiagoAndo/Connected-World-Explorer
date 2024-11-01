import { ModeAction } from "../../store/context/mode";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import CardNav from "./districtItemHeader";
import Panel from "./distridtItemBody";
import { useNavigate } from "react-router-dom";
import { prepareCountyName } from "../../helpers/preparLocName";
export default function DistrictItem({ county }) {
  const [tabActive, setTabActive] = useState("Description");
  const context = useContext(ModeAction);
  const navigate = useNavigate();
  const { attributes } = county;
  const {
    geometry: { rings },
  } = county;
  function handleTabClick(id) {
    if (id === "Weather") {
      const county = prepareCountyName(attributes.ED_ENGLISH);
      navigate("weather", {
        state: {
          data: [
            {
              latitude: rings[0][0][1],
              longitude: rings[0][0][0],
              name: county,
              countryCode: "IE",
            },
          ],
        },
      });
    }

    setTabActive(id);
  }

  return (
    <motion.div className="card">
      <div className={context.mode ? "card-header" : "card-header dark"}>
        <ul
          className="nav nav-tabs card-header-tabs"
          id="bologna-list"
          role="tablist"
        >
          {["Description", "Population", "Map", "Weather"].map((tab) => (
            <CardNav
              key={tab}
              id={tab}
              active={tabActive}
              mode={context.mode}
              handleAction={handleTabClick}
            />
          ))}
        </ul>
      </div>
      <div
        className={
          context.mode ? "card-body  active" : "card-body  active-dark"
        }
      >
        <Panel data={county} rings={rings} id={tabActive.slice(0, 3)} />
      </div>
    </motion.div>
  );
}
