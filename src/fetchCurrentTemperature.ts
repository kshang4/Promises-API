import { GeoCoord } from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

interface TempReport {
  hourly: TemperatureReading;
  [key: string]: unknown;
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  // TODO
  const searchURL = new URL("https://220.maxkuechen.com/currentTemperature/forecast");

  searchURL.searchParams.append("latitude", coords.lat.toString());
  searchURL.searchParams.append("longitude", coords.lon.toString());
  searchURL.searchParams.append("hourly", "temperature_2m");
  searchURL.searchParams.append("temperature_unit", "fahrenheit");

  return new Promise<TemperatureReading>((resolve, reject) => {
    fetch(searchURL.toString())
      .then((res: Response) => (res.ok ? res.json() : Promise.reject(new Error("No results found for query."))))
      .then((data: TempReport) => resolve(data.hourly))
      .catch(error => reject(error));
  });
}
