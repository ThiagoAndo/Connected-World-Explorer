import { Suspense } from "react";
import { useRouteLoaderData, Await } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ClockContext } from "../store/context/clock";
import CountryList from "../components/countryComponents/CountryList";
import { Triangle } from "react-loader-spinner";
import RegionProvider from "../store/context/fetchRegion";
import { fetchCountries } from "../helpers/HTTP";
import { usePrepareLocation } from "../hooks/usePrepareLocation";
function HomePage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const context = useContext(ClockContext);
  const { countries } = useRouteLoaderData("main");

  usePrepareLocation();
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    let timer1 = setTimeout(
      () => {
        localStorage.setItem("position", scrollPosition);
      },

      200
    );
    return () => {
      clearTimeout(timer1);
    };
  }, [scrollPosition]);

  useEffect(() => {
    context.stop();
    let position = localStorage.getItem("position");
    if (!position) {
      position = window.scrollY;
    }
    window.scrollTo({
      top: position,
    });
    localStorage.removeItem("position");
    setInterval(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Suspense
      fallback={
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
      }
    >
      <Await resolve={countries}>
        {(loadedEvents) => (
          <RegionProvider>
            <CountryList countries={loadedEvents} />
          </RegionProvider>
        )}
      </Await>
    </Suspense>
  
  );
}

export default HomePage;

export async function loader() {
  return {
    countries: fetchCountries(),
  };
}
