import type { InstructionDict, StateList } from "@olympos/sot";
import { normalizeArray } from "@sot/utils";
import * as dagreD3 from "dagre-d3-es";
import * as d3 from "d3";

export function soterion(selector: string, current: string, machine: any) {
  const g = new dagreD3.graphlib.Graph().setGraph({});
  const svg = d3.select(selector);
  const inner = svg.select("g");

  const states: StateList<string> = machine.states;
  const transitions: InstructionDict<string> = machine.transitions;

  states.forEach((state) => {
    g.setNode(state, {
      label: state,
      style: state === current ? "fill: red;" : "",
    });
  });
  for (const [trigger, trans] of Object.entries(transitions)) {
    normalizeArray(trans).forEach((trans) => {
      const origins = normalizeArray(trans.origins);
      origins.forEach((origin) => {
        g.setEdge(origin, trans.destination, {
          label: trigger,
          curve: d3.curveBasis,
        });
      });
    });
  }

  g.nodes().forEach((v) => {
    const node = g.node(v);
    node.rx = node.ry = 5;
  });

  const render = dagreD3.render();

  render(inner, g);
}
