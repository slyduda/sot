import { expect, test } from "vitest";
import { soter } from "@olympos/soter";
import { soterion } from "@olympos/soterion";
// This test initializes the ExampleObject
// We trigger the walk transition which by default transitions the object to walking state
test("check to see if state machine can transition", () => {
  const matterMachine = soter(
    {
      state: "solid",
    },
    {
      melt: { origins: "solid", destination: "liquid" },
      evaporate: { origins: "liquid", destination: "gas" },
    }
  );
  matterMachine.visualize("svg", soterion);
});
