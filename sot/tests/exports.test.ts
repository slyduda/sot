import { expect, test } from "vitest";
import { StateMachine, instructions, InstructionMap } from "../src";

test("check if StateMachine exports", () => {
  expect(StateMachine).toBeDefined();
});

test("check if InstructionsMap exports", () => {
  expect(InstructionMap).toBeDefined();
});

test("check if instructions exports", () => {
  expect(instructions).toBeDefined();
});
