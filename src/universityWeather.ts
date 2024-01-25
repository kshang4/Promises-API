import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { fetchUniversities } from "./fetchUniversities.js";
import { GeoCoord } from "./fetchGeoCoord.js";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

interface AverageTemperatureResults {
  totalAverage: number;
  [key: string]: number;
}

export function fetchUniversityWeather(
  universityQuery: string,
  transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
  // TODO
  return new Promise<AverageTemperatureResults>((resolve, reject) => {
    fetchUniversities(universityQuery)
      .then((nameArrays: string[]) => {
        if (nameArrays.length === 0) {
          reject(new Error("No results found for query."));
        } else {
          let s = 0;
          const toReturn: AverageTemperatureResults = { totalAverage: 0 };
          const result: string[] = nameArrays.map((x: string) => (transformName ? transformName(x) : x));
          result.forEach((u, index) => {
            fetchGeoCoord(u)
              .then((coords: GeoCoord) => {
                fetchCurrentTemperature(coords)
                  .then((temp: TemperatureReading) => {
                    const total = temp.temperature_2m.reduce((acc, e) => acc + e, 0);
                    const average = total / temp.temperature_2m.length;
                    s = s + average;
                    toReturn[nameArrays[index]] = average;
                    if (index === result.length - 1) {
                      toReturn.totalAverage = s / result.length;
                      resolve(toReturn);
                    }
                  })
                  .catch(err => reject(err));
              })
              .catch(err => reject(err));
          });
        }
      })
      .catch(err => reject(err));
  });
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return fetchUniversityWeather("University of Massachusetts", (s: string) => s.replace(/at /, ""));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return fetchUniversityWeather("University of California");
}
