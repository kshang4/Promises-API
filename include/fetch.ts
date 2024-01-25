//import fetch from "cross-fetch";

import * as fetch_import from "cross-fetch";


type Fetch = (url: string | URL) => Promise<Response>;

export let fetchImplementation: Fetch = fetch_import.fetch;

export function resetImplementation() {
  fetchImplementation = fetch_import.fetch;
}

export function setImplementation(impl: Fetch) {
  fetchImplementation = impl;
}

function fetch(url: string | URL) {
  return fetchImplementation(url);
}

export default fetch;