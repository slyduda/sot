import { expect, test } from "vitest";
import { matterMachineDict, MatterState } from "../examples/physics";
import { soteria } from "../src";
import { Ref, ref } from "@vue/reactivity";

test("check to see if internal machine setters work", () => {
  const useMatter = () => {
    const state: Ref<MatterState> = ref("liquid");
    return { state };
  };
  const matter = useMatter();
  const matterMachine = soteria(matter, {});
  matterMachine.visualize("svg", () => {});
  expect(Object.keys(matter).length).toBe(1);
});

test("check to see if external machine setters work", () => {
  const useMatter = () => {
    const state: Ref<MatterState> = ref("liquid");
    return { state };
  };
  const matter = useMatter();
  const matterMachine = soteria(matter, {});
  matterMachine["_"] = "svg";
  expect(Object.keys(matter).length).toBe(1);
});
