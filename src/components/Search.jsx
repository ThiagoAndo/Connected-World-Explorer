import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { ModeAction } from "../store/context/mode";
import { useContext, useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fRegion } from "../store/context/fetchRegion";

function Search() {
  const context = useContext(ModeAction);
  const regionctx = useContext(fRegion);
  const { countries } = useRouteLoaderData("main");
  const [coutry, sentCountry] = useState();
  const navigate = useNavigate();
  async function resolveCoutries(con) {
    let count = await con;

    count = count.map((cnt) => {
      const obj = {};
      obj.id = cnt.altSpellings[0];
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
    navigate(`/${item.name}`);
    console.log(item.name);
  }

  function handleEvent(e) {
    console.log(e.target.value);
    regionctx.changeRegion(e.target.value);
  }

  return (
    <section id="srch" className="marg">
      <ReactSearchAutocomplete
        className={"form"}
        items={coutry}
        onSelect={handleOnSelect}
        formatResult={formatResult}
        onKeyDown={(e) => {
          hadleKey(e);
        }}
        placeholder={"Search for a country..."}
        autoFocus
        styling={{
          height: "39px",
          border: context.mode ? "1px solid black" : "1px solid white",
          borderRadius: "8px",
          backgroundColor: context.mode ? "#ffffff" : "#202c37",
          hoverBackgroundColor: "#ff9b05",
          color: context.mode ? "black" : "white",
          fontSize: "20px",
          iconColor: context.mode ? "black" : "white",
          lineColor: "#f9b241",
          placeholderColor: context.mode ? "black" : "white",
          clearIconMargin: "3px 8px 0 0",
          zIndex: "2",
        }}
      />

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
            Filter by Region
          </option>
          <option value="africa" name="reg">
            Africa
          </option>
          <option value="americas" name="reg">
            America
          </option>
          <option value="asia" name="reg">
            Asia
          </option>
          <option value="europe" name="reg">
            Europe
          </option>
          <option value="oceania" name="reg">
            Oceania
          </option>
          <option value="all" name="all">
            All Countries
          </option>
        </select>
      </form>
    </section>
  );
}

export default Search;
