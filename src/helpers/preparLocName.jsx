
export function preparName(place) {
  let arr;
  const check =
    place.includes("The") ||
    place.includes("Municipal") ||
    place.includes("District") ||
    place.includes("City") ||
    place.includes("North") ||
    place.includes("East") ||
    place.includes("South") ||
    place.includes("West");

  if (check) {
    arr = place.split(" ").filter((lett) => {
      return (
        lett != "The" &&
        lett != "Municipal" &&
        lett != "District" &&
        lett != "of" &&
        lett != "City" &&
        lett != "North" &&
        lett != "East" &&
        lett != "South" &&
        lett != "West"
      );
    });
    const [name] = arr;
    return name;
  }

  return place;
}

// export function totalPopulation(data, place) {
//   {
//     const { features } = data;
//     const total = features
//       .map((obj) => {
//         const { properties } = obj;
//         return properties;
//       })
//       .filter((county) => {
//         return county.COUNTY === place;
//       })
//       .map((conty) => {
//         const { T1_2T } = conty;
//         return T1_2T;
//       })
//       .reduce((total, num) => {
//         return total + num;
//       }, 0);
//     return total;
//   }
// }
