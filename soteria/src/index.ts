import { Ref } from "@vue/reactivity";
import { watch, WatchStopHandle } from "@vue-reactivity/watch";
import { deepUnref } from "./utils";
import { normalizeArray } from "@sot/utils";

import { StateMachine, instructions } from "@olympos/sot";
import type {
  InstructionMap,
  InstructionDict,
  StateList,
  StateMachineOptions,
  InstructionRecord,
  TransitionOptions,
  TransitionResult,
} from "@olympos/sot";

type ReactiveStateful<State> = {
  state: Ref<State>;
};

type DisposableWatcher = {
  transition: InstructionRecord<any, any, any>;
  watcher: WatchStopHandle;
};

function reactiveContextCopier<Context>(context: Context): Context {
  return JSON.parse(JSON.stringify(deepUnref(context)));
}

function reactiveConditionEvaluator<Context>(
  conditionFunction: any,
  context: Context
): boolean {
  if (typeof conditionFunction === "function") {
    return conditionFunction.call(context);
  } else if (
    conditionFunction &&
    typeof conditionFunction === "object" &&
    "value" in conditionFunction
  ) {
    return Boolean(conditionFunction.value);
  } else {
    return Boolean(conditionFunction);
  }
}

function getReactiveState<Context extends ReactiveStateful<State>, State>(
  context: Context,
  key: keyof ReactiveStateful<State>
): State {
  return context[key].value;
}

function setReactiveState<Context extends ReactiveStateful<State>, State>(
  context: Context,
  state: State,
  key: keyof ReactiveStateful<State>
) {
  context[key].value = state;
}

function soteria<
  Context extends ReactiveStateful<State>,
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
    ReactiveStateful<State>,
    "state"
  >,
  watchFn?: any
): Context &
  StateMachine<Context, State, Trigger, ReactiveStateful<State>, "state"> {
  const watchFunction = watchFn ?? watch;

  const generateWatchers = (
    context: Context,
    machine: StateMachine<
      Context,
      State,
      Trigger,
      ReactiveStateful<State>,
      "state"
    >,
    disposables: DisposableWatcher[]
  ) => {
    for (const trigger in machine.transitions) {
      const transitions = normalizeArray(machine.transitions[trigger]);

      for (const transition of transitions) {
        const origins = normalizeArray(transition.origins ?? []);
        if (!origins.includes(context["state"].value)) continue;

        const conditions = normalizeArray(transition.conditions ?? []);
        const conditionFunctions = conditions
          .map((condition) => context[condition as keyof Context]) // TODO DANGEROUS MAYBE CAST AS UNDEFINED
          .filter((condition) => condition !== undefined);

        disposables.push({
          transition: transition,
          watcher: watchFunction([...conditionFunctions], () => {
            const conditionsMet = conditionFunctions.every(
              (conditionFunction) =>
                reactiveConditionEvaluator(conditionFunction, context)
            );

            if (!conditionsMet) return;

            for (const effect of normalizeArray(transition.effects ?? [])) {
              // Define Effect Function
              const effectFunction = context[effect as keyof Context]; // TODO DANGEROUS MAYBE CAST AS UNDEFINED

              // Skip if it isnt a method // TODO: Figure out if this should error
              if (typeof effectFunction !== "function") continue;

              // Call function
              effectFunction.call(context);
            }

            machine.to(transition.destination);
          }),
        });
      }
    }
  };

  const disposables: DisposableWatcher[] = [];

  const onReactiveTransition = (
    state: State,
    oldState: State,
    context: Context,
    machine: StateMachine<Context, State, any, ReactiveStateful<State>, "state"> // Too complicated to type
  ) => {
    // Kill the watchers
    for (const disposable of disposables) {
      disposable.watcher();
    }
    disposables.length = 0;

    // Call the default onTransition
    if (options?.onAfter) options?.onAfter(state, oldState, context, wrapper);

    while (machine.validatedTransitions.length) {
      machine.trigger(machine.validatedTransitions[0].trigger);

      // Call the default onTransition
      if (options?.onAfter) options?.onAfter(state, oldState, context, wrapper);
    }

    // Make more watchers
    generateWatchers(context, machine, disposables);
  };

  const wrapper = new StateMachine<
    Context,
    State,
    Trigger,
    ReactiveStateful<State>,
    "state"
  >(context, instructions, {
    key: "state",
    ...options,
    conditionEvaluator: reactiveConditionEvaluator,
    contextCopier: reactiveContextCopier,
    getState: getReactiveState,
    setState: setReactiveState,
    onAfter: onReactiveTransition,
  }); // Set the condition evaluator to the reactive version

  const proxy = new Proxy(
    context as Context &
      StateMachine<Context, State, Trigger, ReactiveStateful<State>, "state">,
    {
      get(target, prop, receiver) {
        if (prop in wrapper) {
          return Reflect.get(wrapper, prop, receiver);
        }
        return Reflect.get(target, prop, receiver);
      },
    }
  );

  generateWatchers(context, wrapper, disposables);

  return proxy;
}

export {
  soteria,
  instructions,
  InstructionRecord,
  InstructionMap,
  TransitionOptions,
  TransitionResult,
  StateMachineOptions,
};
