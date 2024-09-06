import { bench, describe } from "vitest";
import { exampleMachineDict, ExampleObject } from "../examples";
import { soter } from "../src";

describe("state machine initialization", () => {
  bench("no state machine", () => {
    new ExampleObject();
  });

  bench("class based w/ mixin", () => {
    const myObject = new ExampleObject();
    soter(myObject, exampleMachineDict);
  });
});