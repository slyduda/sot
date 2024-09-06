import { expect, test } from "vitest";
import { soter } from "../src";
import { Matter, matterMachineDict, MatterState } from "../examples/physics";

test("check to see if onBeforeTransition works", () => {
  let beforeTransitionState: MatterState | null = null;
  const matter = soter(new Matter("solid", 10), matterMachineDict, {
    onBefore: (plannedState, state, context) => {
      beforeTransitionState = context.state;
    },
  });
  matter.trigger("melt");
  expect(beforeTransitionState).toBe("solid");
});

test("check to see if onTransition works", () => {
  let postTransitionState: MatterState | null = null;
  const matter = soter(new Matter("solid", 10), matterMachineDict, {
    onAfter: (state, oldState, context) => {
      postTransitionState = context.state;
    },
  });
  matter.trigger("melt");
  expect(postTransitionState).toBe("liquid");
});
