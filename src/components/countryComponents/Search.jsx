import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { ModeAction } from "../../store/context/mode";
import { useContext, useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { locAction } from "../../store/redux/location";
import { useNavigate } from "react-router-dom";
import useThisLocation from "../../hooks/useThisLocation";
import { fRegion } from "../../store/context/fetchRegion";
function Search({ opt, call, holderF, holderS }) {
  let options = [];
  const dispatch = useDispatch();
  const context = useContext(ModeAction);
  const regionctx = useContext(fRegion);
  let districts = useSelector((state) => state.location.disName);
  const { path } = useThisLocation();
  const { countries } = useRouteLoaderData("main");
  const [coutry, sentCountry] = useState();
  const navigate = useNavigate();

  if (districts.length > 0) {
    districts = districts.map((d) => {
      return { ["id"]: d.id, ["name"]: d.name.toLowerCase() };
    });
  }
  if (call === "c") {
    options = opt;
  } else {
    options = [...opt];
    options.unshift("All Counties");
  }
  async function resolveCoutries(con) {
    let count = await con;
    count = count.map((cnt) => {
      const obj = {};
      obj.id = cnt.cca3;
      obj.name = cnt.name.common;
      return obj;
    });
    sentCountry(count);
  }
  useEffect(() => {
    resolveCoutries(countries);
  }, []);

  function formatResult(item) {
    return (
      <div className="result-wrapper">
        <span className="result-span">{item.name}</span>
      </div>
    );
  }
  function handleOnSelect(item) {
    if (path === "/Ireland") {
      dispatch(
        locAction.setFilterDistricts({
          name: item.name.toUpperCase(),
          call: "county",
        })
      );
    } else {
      navigate(`/${item.id}`);
    }
  }
  function handleEvent(e) {
    if (path === "/Ireland") {
      dispatch(
        locAction.setFilterDistricts({ name: e.target.value, call: "state" })
      );
    } else {
      regionctx.changeRegion(e.target.value);
    }
  }
  return (
    <section id="srch" className="marg">
      <div className="src-container">
        <ReactSearchAutocomplete
          className={"form"}
          items={path === "/Ireland" ? districts : coutry}
          onSelect={handleOnSelect}
          formatResult={formatResult}
          onKeyDown={(e) => {
            hadleKey(e);
          }}
          placeholder={holderS}
          autoFocus
          styling={{
            height: "39px",
            border: context.mode ? "1px solid black" : "1px solid white",
            borderRadius: "8px",
            backgroundColor: context.mode ? "#ffffff" : "#202c37",
            hoverBackgroundColor: "#2d5eb8",
            color: context.mode ? "black" : "white",
            fontSize: "20px",
            iconColor: context.mode ? "black" : "white",
            lineColor: context.mode ? "black" : "white",
            placeholderColor: context.mode ? "black" : "white",
            clearIconMargin: "3px 8px 0 0",
            zIndex: "2",
          }}
        />
      </div>
      <form action="/" id="formSelec">
        <select
          onChange={handleEvent}
          name="type"
          className={context.mode ? "light" : "dark"}
          style={
            context.mode
              ? {
                  border: "black solid 1px",
                  boxShadow: "0px 0px 4px 0px #888888",
                }
              : null
          }
          defaultValue={"DEFAULT"}
        >
          <option value="DEFAULT" disabled>
            {holderF}
          </option>
          {options.map((reg) => (
            <option key={reg} value={reg} name={reg}>
              {call === "c"
                ? reg[0].toUpperCase() + reg.slice(1, reg.length)
                : reg}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}

export default Search;
