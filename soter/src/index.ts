import {
  InstructionMap,
  InstructionDict,
  StateList,
  StateMachineOptions,
  StateMachine,
  instructions,
  InstructionRecord,
  TransitionOptions,
  TransitionResult,
} from "@olympos/sot";

interface SimpleStateful<State> {
  state: State;
}

function defaultGetState<
  Context extends SimpleStateful<State>,
  State,
  K extends keyof SimpleStateful<State>
>(context: Context, key: K): State {
  return context[key];
}

function defaultSetState<
  Context extends SimpleStateful<State>,
  State,
  K extends keyof SimpleStateful<State>
>(context: Context, state: State, key: K) {
  context[key] = state;
}

function soter<
  Context extends SimpleStateful<State>,
  State,
  Trigger extends string
>(
  context: Context,
  instructions:
    | InstructionMap<State, Trigger, Context>
    | InstructionDict<State, Trigger, Context>
    | StateList<State>,
  options?: StateMachineOptions<
    Context,
    State,
    Trigger,
    SimpleStateful<State>,
    "state"
  >
): Context &
  StateMachine<Context, State, Trigger, SimpleStateful<State>, "state"> {
  const wrapper = new StateMachine<
    Context,
    State,
    Trigger,
    SimpleStateful<State>,
    "state"
  >(context, instructions, {
    key: "state",
    ...options,
    getState: defaultGetState,
    setState: defaultSetState,
  });

  const proxy = new Proxy(
    context as Context &
      StateMachine<Context, State, Trigger, SimpleStateful<State>, "state">,
    {
      get(target, prop, receiver) {
        if (prop in wrapper) {
          return Reflect.get(wrapper, prop, receiver);
        }
        return Reflect.get(target, prop, receiver);
      },
    }
  );

  return proxy;
}

export {
  soter,
  instructions,
  InstructionRecord,
  InstructionMap,
  TransitionOptions,
  TransitionResult,
  StateMachineOptions,
};
