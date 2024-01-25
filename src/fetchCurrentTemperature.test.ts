import assert from "assert";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { setImplementation, resetImplementation } from "../include/fetch.js";

interface Reject {
  code: number;
  message: string;
}

describe("fetchCurrentTemperature", () => {
  it("follows type specification", () => {
    const promise = fetchCurrentTemperature({ lat: -71.05, lon: 90 });

    return promise.then(result => {
      assert(typeof result === "object"); // Assert the result is an object
      assert(Array.isArray(result.time)); // Assert the result has an array time field
      assert(result.time.every(x => typeof x === "string")); // Assert each element in that time is a sting
      assert(Array.isArray(result.temperature_2m)); // Assert the result as an array temperature_2m field
      assert(result.temperature_2m.every(x => typeof x === "number")); // Assert each element in that time is a number
    });
  });

  it("each time stamp corresponds to each temperature", () => {
    const promise = fetchCurrentTemperature({ lat: 40, lon: 40 });

    return promise.then(result => {
      assert(result.time.length === result.temperature_2m.length);
    });
  });

  it("rejects when provided GeoCoord not in range", () => {
    const promise = fetchCurrentTemperature({ lat: 100, lon: 40 });

    return promise.catch((result: Reject) => {
      assert(result.message === "No results found for query.");
    });
  });

  it("rejects when fetch fails", () => {
    setImplementation(() => Promise.reject(new Error("Fetch fails")));
    const promise = fetchCurrentTemperature({ lat: -10, lon: 90 });

    return promise.catch((result: Reject) => {
      assert(result.message === "Fetch fails");
    });
  });
  beforeEach(() => resetImplementation());
});
