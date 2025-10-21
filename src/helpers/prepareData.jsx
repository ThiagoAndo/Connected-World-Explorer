import { fetchByCode } from "./HTTP";

export function prepareData(country) {
  let {
    country: [count],
  } = country;
  let crrKey;
  let crr = "No";
  let lag = "No";
  let langKey;
  let subReg = "No";
  let capital = "No";
  let borders = [];

  const {
    capitalInfo: { latlng },
  } = count;
  if (count?.currencies) {
    crrKey = Object.keys(count.currencies)[0];
    crr = count.currencies[crrKey].name;
  }
  if (count?.languages) {
    langKey = Object.keys(count?.languages)[0];
    lag = count?.languages[langKey];
  }
  if (count?.subregion) {
    subReg = count.subregion;
  }
  if (count?.capital) {
    capital = count.capital[0];
  }
  borders = count.borders;
  return [lag, crr, capital, subReg, count.cca2, latlng, borders];
}

export async function findBorders(borders) {
  let i = 0;
  let bordersArray = [];
  let longName = "";
  for (i; i <= borders.length - 1; i++) {
    let name = await fetchByCode(borders[i]);
    if (name[0]?.name?.common?.length > 10) {
      for (let index = 0; index <= 10; index++) {
        if (index <= 7) {
          longName += name[0]?.name?.common[index];
        } else if (index === 8) {
          longName += " ...";
        }
      }
      bordersArray.push(longName);
    } else {
      bordersArray.push(name[0]?.name?.common);
    }
  }

  console.log("bordersArray: " + bordersArray);
  if (bordersArray.length > 0) return bordersArray;
}
