import assert from "assert";
import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { setImplementation, resetImplementation } from "../include/fetch.js";

interface Reject {
  code: number;
  message: string;
}

describe("fetchGeoCoord", () => {
  it("follows type specification", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
    });
  });

  it("returns correct result", () => {
    const promise = fetchGeoCoord("University of Massachusetts");

    return promise.then(result => {
      assert(result.lon === -72.3596157);
      assert(result.lat === 42.2538509);
    });
  });

  it("rejects for invalid input", () => {
    const promise = fetchGeoCoord("megan wong");

    return promise.catch((result: Reject) => assert(result.message === "No results found for query."));
  });

  it("rejects when fetch fails", () => {
    setImplementation(() => Promise.reject(new Error("Fetch fails")));
    const promise = fetchGeoCoord("University of Massachusetts");

    return promise.catch((result: Reject) => {
      assert(result.message === "Fetch fails");
    });
  });
  beforeEach(() => resetImplementation());
});
