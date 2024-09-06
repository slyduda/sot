import { expect, test } from "vitest";
import {
  matterMachineDict,
  MatterState,
  MatterTrigger,
  useMatter,
  Matter,
} from "../examples/physics";
import { soteria } from "../src";

import { ref } from "@vue/reactivity";
import { watch } from "@vue-reactivity/watch";

test("check to see reactive state machine works", () => {
  const matter = useMatter("solid");
  const matterReactiveMachine = soteria<Matter, MatterState, MatterTrigger>(
    matter,
    matterMachineDict
  );
  const { temperature } = matterReactiveMachine;
  temperature.value = 50;
  expect(matterReactiveMachine.state.value).toBe("liquid");
});

test("check to see reactivity works", () => {
  const count = ref(1);
  const effected = ref(false);

  const stopWatch = watch(count, (newValue) => {
    effected.value = true;
  });

  count.value += 1;
  expect(effected.value).toBe(true);
  stopWatch();
});