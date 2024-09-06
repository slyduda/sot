# Soter - Finite State Machine

`Soter` is a lightweight, object-oriented finite state machine implementation in Javascript. `Soter` has zero-dependencies and is useful for both frontend and backend applications.

`Soter`'s API will be changing over time. It is likely that there will be breaking changes among minor releases (0.1.0 -> 0.2.0 etc) because we are gathering input from others who find the package helpful. An example of one of the largest forseeable breaks is the soter() API and allowing it to be called without an object where merge() or another more detailed API will substitute the existing soter() API. Though it is probably that we will be able to leverage Typescript in supporting the use of soter() for both use cases.

## Installation

```
npm install @olympos/soter
```

## Quickstart

Here is a simple example of how to leverage `Soter`:

```ts
const matterMachine = soter(
  {
    state: "solid",
  },
  {
    melt: { origins: "solid", destination: "liquid" },
    evaporate: { origins: "liquid", destination: "gas" },
  }
);
console.log(matterMachine.state); // solid
matterMachine.trigger("melt"); // Trigger the melt transition
console.log(matterMachine.state); // liquid
```

Here is a class based approach with better type safety:

```ts
type MatterState = "solid" | "liquid" | "gas" | "plasma";
type MatterTrigger =
  | "melt"
  | "evaporate"
  | "sublimate"
  | "ionize"
  | "freeze"
  | "depose"
  | "condense"
  | "recombine";

class Matter {
  state: MatterState;

  constructor(state: MatterState) {
    this.state = state;
  }
}

const matterMachineDict: InstructionDict<MatterState, MatterTrigger, Matter> = {
  melt: { origins: "solid", destination: "liquid" },
  evaporate: { origins: "liquid", destination: "gas" },
  sublimate: { origins: "solid", destination: "gas" },
  ionize: { origins: "gas", destination: "plasma" },
};

// Initialize a Matter object and attach a state machine to it
const matter = soter(new Matter("solid"), matterMachineDict);
console.log(matter.state); // solid
matter.trigger("melt"); // Trigger the melt transition
console.log(matter.state); // liquid
```

## Concepts

A state machine is a model of behavior composed of a finite number of states and transitions between those states. Within each state and transition some action can be performed. A state machine needs to start at some initial state. Below, we will look at some core concepts and how to work with them.

- `State`: A condition or stage in a state machine. A `State` can describe a phase in a process or a mode of behavior.

- `Transition`: A process or event that causes the state machine to change from one state to another.

- `Model`: An entity that gets updated during transitions. It may also define actions that will be executed during transitions. This is also described as context.

- `Machine`: An entity that manages and controls the model, states, transitions, and actions.

- `Trigger`: An event that initiates a transition, the method that sends the signal to start a transition.

- `Action`: An operation or task that is performed when a certain state is entered, exited, or during a transition.

### Basics

In order to create an object with a state machine, it must be `Stateful`, or having a `.state` property that the machine can reference. Some examples of this are:

```js
// Simple object untyped approach
const matter = {
  state: "solid",
};
```

```ts
// Class based typed approach
type MatterState = "solid" | "liquid" | "gas" | "plasma";
class Matter {
  state: MatterState;

  constructor(state: MatterState) {
    this.state = state;
  }
}
const matter = new Matter("solid");
```

You can create a very simple working state machine bound to `matter` like this:

```ts
import { soter } from "@olympos/soter";

const matterMachine = soter(matter, ["solid", "liquid"]);
```

You can now transition your state machine to any destination listed in the list above:

```ts
matterMachine.to("liquid");
console.log(matterMachine.state); // liquid
```

Calling `machine` on `matter` creates `matterMachine` which includes all of the base object's properties and methods while also attaching various state machine methods.

## Transitions

In order to get the benefit of `Soter` with your objects local state. It is imperative to use `Soter`'s builtin functionality to call all conditions, effects, and callbacks within your instance. Changing the state of the object directly will not have any effect on `Soter` because it explicity avoids adding any functionality on top of the already existing object.

### .to(state: State, options?: TransitionOptions)

The `.to()` method is helpful for simple state transitions as demonstrated in the last example. Simply supply a state and if it exists transition to it without any checks or side effects.

```ts
const matter = soter(
  {
    state: "solid",
  }, // The object
  ["solid", "liquid"] // The available states
);

console.log(matter.state); // solid
matter.to("liquid");
console.log(matter.state); // liquid
```

### .trigger(trigger: Trigger, props: any, options?: TransitionOptions)

In most use cases where finite state machines are needed, it is often helpful to have additional logic that happens before, during, and after transitions. This is where the `.trigger()` method is helpful.

```ts
import { InstructionDict } from "@olympos/soter";

type HeroState = "idle" | "sleeping";
type HeroTrigger = "patrol" | "sleep";

class Hero {
  state: HeroState;
  energy: number;

  constructor(state: HeroState) {
    this.state = state;
    this.energy = 1;
  }

  work() {
    console.log("The hero is expending energy!");
    this.energy--;
  }

  hasEnergy() {
    return this.energy > 0;
  }
}

const InstructionDict: InstructionDict<HeroState, HeroTrigger, Hero> = {
  patrol: {
    origins: "idle",
    destination: "idle",
    conditions: "hasEnergy",
    effects: "work",
  },
  sleep: {
    origins: "idle",
    destination: "sleeping",
  },
};

const hero = soter(new Hero("idle"), InstructionDict);
hero.trigger("patrol");
// The hero is expending energy!
hero.trigger("patrol"); // No log because condition is not met so the hero does not work
```

### Passing Data

Data can be passed from the initial trigger function into all methods being called during the transition:

```ts
export class Matter {
  state: MatterState;
  temperature: number;
  pressure: number;

  constructor(state: MatterState, temperature?: number, pressure?: number) {
    this.state = state;
    this.temperature = temperature ?? 0;
    this.pressure = pressure ?? 101.325;
  }

  setEnvironment(props?: { temperature: number; pressure: number }) {
    const { temperature = 0, pressure = 101.325 } = props ?? {};
    this.temperature = temperature;
    this.pressure = pressure;
  }
}

export const matterMachineDict: InstructionDict<
  MatterState,
  MatterTrigger,
  Matter
> = {
  melt: [
    { origins: "solid", destination: "liquid", effects: "setEnvironment" },
  ],
  evaporate: [{ origins: "liquid", destination: "gas" }],
  sublimate: [{ origins: "solid", destination: "gas" }],
  ionize: [{ origins: "gas", destination: "plasma" }],
};
```

If we pass any props into the second argument of the trigger function, they will be passed to all conditions and all effects:

```ts
matterMachine.trigger("melt", { temperature: 20 });
```

One caveat is that we don't get type inference on the props, but you may cast them.

### Configuration

The initial state machine may be configured with any of the following options like so:

```ts
const matter = soter(new Matter(), matterTransitionInstructions, {
  verbosity: false,
  throwExceptions: false,
  strictOrigins: false,
});
```

Further configuration in individual transitions may be changed and take priority:

```ts
matter.triggerWithOptions("evaporate", {
  throwExceptions: true,
});
```

More configuration options will come as `Soter` grows

## Advanced

Debugging State Transitions is notoriously difficult. It is for this reason that each transition returns a structured object of the history of the context throughout the transition.

```ts
export class ExampleObject {
  state: ExampleObjectState;
  speed: number;
  energy: number;

  constructor(energy?: number) {
    this.state = "stopped";
    this.energy = energy ?? 1;
    this.speed = 0;
  }

  speedUp() {
    this.speed = 1;
    this.energy--;
  }

  slowDown() {
    this.speed = 0;
  }

  hasEnergy(): boolean {
    return this.energy > 0;
  }
}

export const exampleMachineDict: InstructionDict<
  ExampleObjectState,
  ExampleObjectTrigger,
  ExampleObject
> = {
  walk: {
    origins: ["stopped"],
    destination: "walking",
    effects: ["speedUp"],
    conditions: ["hasEnergy"],
  },
  stop: {
    origins: ["walking"],
    destination: "stopped",
  },
};

const myObject = new ExampleObject(1);
const objectMachine = soter(myObject, exampleMachineDict);
objectMachine.trigger("walk");
objectMachine.trigger("stop");
const response = objectMachine.trigger("walk"); // Will fail

console.log(response);

// {
//   success: false,
//   failure: {
//     type: "ConditionValue",
//     undefined: false,
//     trigger: "walk",
//     method: "hasEnergy",
//     context: { state: "stopped", speed: 1, energy: 0 },
//   },
//   initial: "stopped",
//   current: "stopped",
//   attempts: [
//     {
//       name: "walk",
//       success: false,
//       failure: {
//         type: "ConditionValue",
//         undefined: false,
//         trigger: "walk",
//         method: "hasEnergy",
//         context: { state: "stopped", speed: 1, energy: 0 },
//       },
//       conditions: [
//         {
//           name: "hasEnergy",
//           success: false,
//           context: { state: "stopped", speed: 1, energy: 0 },
//         },
//       ],
//       effects: [],
//       transition: {
//         origins: ["stopped"],
//         destination: "walking",
//         effects: ["speedUp"],
//         conditions: ["hasEnergy"],
//       },
//       context: { state: "stopped", speed: 1, energy: 0 },
//     },
//   ],
//   precontext: { state: "stopped", speed: 1, energy: 0 },
//   context: { state: "stopped", speed: 1, energy: 0 },
// };
```

Destructured for simpler design:

```ts
const { success, failure } = objectMachine.trigger("walk");
```

## TODO

- Update Readme with the new API: soter vs addStateMachine, instructions, etc
- Add better lifecycles for StateMachine, TransitionRecords, and Lifecycles
  - [ ] ~~state.onExit~~
  - [ ] ~~state.onEnter~~
- Allow separate lifecycle events for FSM and transitions?
- Allow soter() to remove Context from first param
  - Doable by making instructions not have the state key and requiring Context to have the state key
  - Might make refactor to use any property for state more difficult in the future (if it ever happens)
- Configurable .state key? .status, .otherState, etc
  - Might be too difficult to do with TS
- Hiearchical State Machine
- Visualization Tool
- Some Absctraction
  - Trigger Function Abstraction for Errors
  - Instruction Initialization
