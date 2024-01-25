import fetch from "../include/fetch.js";

export interface GeoCoord {
  lat: number;
  lon: number;
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
  // TODO
  const home = new URL("https://220.maxkuechen.com/geoCoord/search");
  home.searchParams.append("q", query);

  return new Promise<GeoCoord>((res, rej) => {
    fetch(home)
      .then((res: Response) => (res.ok ? res.json() : Promise.reject(new Error("No results found for query."))))
      .then((data: { lat: string; lon: string }[]) =>
        Array.isArray(data) && data.length > 0
          ? res({ lat: Number.parseFloat(data[0].lat), lon: Number.parseFloat(data[0].lon) })
          : Promise.reject(new Error("No results found for query."))
      )
      .catch(err => rej(err));
  });
}
