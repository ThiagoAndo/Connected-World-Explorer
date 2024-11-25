import { useContext, useEffect } from "react";
import { ClockContext } from "../../../src/store/context/clock";
let hasChanged;
function Clock({ cca2, name, capital, coor }) {
const clockCoor = {lat: coor[0], lng:coor[1]}

  const context = useContext(ClockContext);
  useEffect(() => {
    hasChanged = false;
    setTimeout(() => {
      context.setCode(cca2, capital, clockCoor);
      hasChanged = true;
    }, 1500); // Timer Add to comply with API rate limit
  }, [cca2, capital]);
  return (
    <div className="clock">
      {hasChanged && (
        <>
          <div
            className="hour_hand"
            style={{
              transform: `rotateZ(${
                context.timer != null ? context.timer.getHours() * 30 : 0
              }deg)`,
            }}
          />
          <div
            id="min_hand"
            style={{
              transform: `rotateZ(${
                context.timer != null ? context.timer.getMinutes() * 6 : 0
              }deg)`,
            }}
          />
          <div
            className="sec_hand"
            style={{
              transform: `rotateZ(${
                context.timer != null ? context.timer.getSeconds() * 6 : 0
              }deg)`,
            }}
          />
        </>
      )}
      <span className="twelve">12</span>
      <span className="one">1</span>
      <span className="two">2</span>
      <span className="three">3</span>
      <span className="four">4</span>
      <span className="five">5</span>
      <span className="six">6</span>
      <span className="seven">7</span>
      <span className="eight">8</span>
      <span className="nine">9</span>
      <span className="ten">10</span>
      <span className="eleven">11</span>
      <h3>{context.regionName}</h3>
      <h5>{context.countryName}</h5>
    </div>
  );
}

export default Clock;
