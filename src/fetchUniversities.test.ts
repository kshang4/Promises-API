import assert from "assert";
import { fetchUniversities } from "./fetchUniversities.js";
import { setImplementation, resetImplementation } from "../include/fetch.js";

interface Reject {
  code: number;
  message: string;
}

describe("fetchUniversities", () => {
  it("follows type specification", () => {
    const promise = fetchUniversities("University of Massachusetts at Amherst");

    return promise.then(result => {
      assert(Array.isArray(result)); // Assert the result in an array
      assert(result.every(x => typeof x === "string")); // Assert each element in the array is a string
    });
  });

  it("returns all UMass's", () => {
    const promise = fetchUniversities("University of Massachusetts");

    return promise.then(result => {
      assert(Array.isArray(result));
      assert(result.every(x => typeof x === "string"));
      assert(result.length === 4);
    });
  });

  it("should be an empty array", () => {
    const promise = fetchUniversities("Kevin Shang");

    return promise.then(result => {
      assert(Array.isArray(result));
      assert(result.length === 0);
    });
  });

  it("should reject if query is empty", () => {
    const promise = fetchUniversities("Kevin Shang");

    return promise.catch((result: Reject) => {
      assert(result.message === "No results found for query.");
    });
  });

  it("rejects when fetch fails", () => {
    setImplementation(() => Promise.reject(new Error("Fetch fails")));
    const promise = fetchUniversities("University of Massachusetts");

    return promise.catch((result: Reject) => {
      assert(result.message === "Fetch fails");
    });
  });
  beforeEach(() => resetImplementation());
});
