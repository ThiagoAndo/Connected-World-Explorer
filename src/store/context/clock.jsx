import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { fetchZone, loadTimeZone } from "../../helpers/HTTP";
import { throttle } from "lodash";

const key = import.meta.env.VITE_TIME_ZONE_KEY;

export const ClockContext = createContext({
  timer: null,
  city: null,
  setCode: () => {},
  stop: () => {},
});

let city = null;

export default function ClockProvider({ children }) {
  const [timer, setTimer] = useState(null); // Current time
  const [country, setCountry] = useState(null); // Selected country
  const [change, setChange] = useState(false); // Controls interval
  const timeInter = useRef(); // Holds interval reference

  // Fetch time zone and initialize time
  const loadZoneName = useCallback(async (country) => {
    if (!country) return;
    const resData = await fetchZone(country);
    if (resData) {
      const zone =
        resData.zones.find((zn) => zn.zoneName.includes(country.capital))
          ?.zoneName || resData.zones[0]?.zoneName;

      city = zone?.split("/")[1]?.replace(/[_-]/g, " ") || "Unknown";

      const time = await loadTime(zone);
      return time;
    }
  }, []);

  // Fetch time for a given zone
  async function loadTime(zone) {
    const resData = await loadTimeZone(zone);
    return resData ? new Date(resData.formatted) : null;
  }

  // Start the timer with throttled updates
  const throttledRun = useCallback(
    throttle((initialTime) => {
      setTimer((prevTime) => {
        const updatedTime = new Date(prevTime.getTime() + 1000);
        return updatedTime;
      });
    }, 1000), // Ensure updates happen every second
    []
  );

  const startTimer = useCallback((initialTime) => {
    if (timeInter.current) clearInterval(timeInter.current);
    setTimer(initialTime);
    timeInter.current = setInterval(() => {
      throttledRun();
    }, 1000);
  }, []);

  // Set country and initialize timer
  const setCode = async (cca2, capital) => {
    const newCountry = { cca2, capital };
    setCountry(newCountry);
    setChange(false); // Stop interval
    clearInterval(timeInter.current);
    const initialTime = await loadZoneName(newCountry);
    if (initialTime) {
      setChange(true); // Restart interval
      startTimer(initialTime);
    }
  };

  // Stop the timer
  const stop = () => {
    clearInterval(timeInter.current);
    setTimer(null);
  };

  // Manage interval cleanup
  useEffect(() => {
    return () => {
      clearInterval(timeInter.current); // Cleanup on unmount
    };
  }, []);

  const ctxValue = {
    timer,
    city,
    setCode,
    stop,
  };

  return (
    <ClockContext.Provider value={ctxValue}>{children}</ClockContext.Provider>
  );
}
