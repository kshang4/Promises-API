import assert from "assert";
import { setImplementation, resetImplementation } from "../include/fetch.js";
import { fetchUCalWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";

interface Reject {
  code: number;
  message: string;
}

// 1000ms
const SECOND = 1000;
// 30 second timeout
jest.setTimeout(30 * SECOND);

describe("fetchUCalWeather", () => {
  it("follows type specification", () => {
    const promise = fetchUCalWeather();

    return promise.then(result => {
      assert(typeof result === "object");
      assert(Object.keys(result).every(x => typeof x === "string"));
      assert(Object.values(result).every(x => typeof x === "number"));
    });
  });
});

describe("fetchUMassWeather", () => {
  it("follows type specification", () => {
    const promise = fetchUMassWeather();

    return promise.then(result => {
      assert(typeof result === "object");
      assert(Object.keys(result).every(x => typeof x === "string"));
      assert(Object.values(result).every(x => typeof x === "number"));
    });
  });
});

describe("fetchUniversityWeather", () => {
  it("should reject when fetchUniversities returns empty array", () => {
    const promise = fetchUniversityWeather("Kevin Shang");

    return promise.catch((result: Reject) => {
      assert(result.message === "No results found for query.");
    });
  });

  it("rejects when fetchGeoCoord fails", () => {
    const promise = fetchUniversityWeather("University of Massachusetts at Amherst");

    return promise.catch((result: Reject) => {
      assert(result.message === "No results found for query.");
    });
  });

  it("rejects when fetchUniversities fails", () => {
    setImplementation(() => Promise.reject(new Error("Fetch fails")));
    const promise = fetchUniversityWeather("University of Massachusetts");

    return promise.catch((result: Reject) => {
      assert(result.message === "Fetch fails");
    });
  });
  beforeEach(() => resetImplementation());
});
