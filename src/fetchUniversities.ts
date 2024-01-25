import fetch from "../include/fetch.js";

export function fetchUniversities(query: string): Promise<string[]> {
  // TODO
  const url = new URL("http://220.maxkuechen.com/universities/search");
  url.searchParams.append("name", query);

  return new Promise<string[]>((resolve, reject) => {
    fetch(url.toString())
      .then((response: Response) => (response.ok ? response.json() : Promise.reject("No results found for query.")))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const uniNames: string[] = data.map((university: { name: string }) => university.name);
          resolve(uniNames);
        } else {
          resolve([]);
        }
      })
      .catch(err => reject(err));
  });
}
