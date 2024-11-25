import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { loadTimeZone } from "../../helpers/HTTP";
import { throttle } from "lodash";

export const ClockContext = createContext({
  timer: null,
  regionName: null,
  countryName: null,
  setCode: () => {},
  stop: () => {},
});
let regionName = null;
let countryName = null;

export default function ClockProvider({ children }) {
  const [timer, setTimer] = useState(null); // Current time
  const timeInter = useRef(); // Holds interval reference
  // Fetches the time zone and initializes time
  const loadZoneName = useCallback(async (country) => {
    if (!country) return;
    const resData = await loadTimeZone({ ...country.coor });
    ({ regionName, countryName } = resData);
    const { formatted } = resData;
    if (formatted) return new Date(formatted);
  }, []);

  // Start the timer with throttled updates
  const throttledRun = useCallback(
    throttle(() => {
      setTimer((prevTime) => {
        const updatedTime = new Date(prevTime.getTime() + 1000);
        return updatedTime;
      });
    }, 1000), // Ensure updates happen every second
    []
  );

  const startTimer = useCallback(
    (initialTime) => {
      if (timeInter.current) clearInterval(timeInter.current);
      setTimer(initialTime);
      timeInter.current = setInterval(() => {
        throttledRun();
      }, 1000);
    },
    [throttledRun]
  );

  // Set country and initialize timer
  const setCode = async (cca2, capital, coor) => {
    const country = { cca2, capital, coor };
    clearInterval(timeInter.current); // Stop previous interval if running
    const initialTime = await loadZoneName(country);
    if (initialTime) {
      startTimer(initialTime); // Start the timer with the fetched time
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
    regionName,
    countryName,
    timer,
    setCode,
    stop,
  };

  return (
    <ClockContext.Provider value={ctxValue}>{children}</ClockContext.Provider>
  );
}
