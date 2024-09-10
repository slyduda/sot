export type MatterState = "solid" | "liquid" | "gas" | "plasma";
export type MatterTrigger =
  | "melt"
  | "evaporate"
  | "sublimate"
  | "ionize"
  | "freeze"
  | "depose"
  | "condense"
  | "recombine";

const gasPlasma = 1000;
const liquidGas = 100;
const solidLiquid = 40;

export type Matter = {
  state: Ref<MatterState>;
  temperature: Ref<number>;
  canMelt: ComputedRef<boolean>;
  canSublimate: ComputedRef<boolean>;
  canEvaporate: ComputedRef<boolean>;
  canFreeze: ComputedRef<boolean>;
  canIonize: ComputedRef<boolean>;
  canCondense: ComputedRef<boolean>;
  canDepose: ComputedRef<boolean>;
  canRecombine: ComputedRef<boolean>;
};

export const useMatter = (s: MatterState, temp: number = 1): Matter => {
  const temperature = ref(temp);
  const state = ref(s);

  const canMelt = computed(() => {
    return state.value === "solid" && temperature.value > solidLiquid;
  });
  const canSublimate = computed(() => {
    return state.value === "solid" && temperature.value > liquidGas;
  });

  const canEvaporate = computed(() => {
    return state.value === "liquid" && temperature.value > liquidGas;
  });
  const canFreeze = computed(() => {
    return state.value === "liquid" && temperature.value < solidLiquid;
  });

  const canIonize = computed(() => {
    return state.value === "gas" && temperature.value > gasPlasma;
  });
  const canCondense = computed(() => {
    return state.value === "gas" && temperature.value < liquidGas;
  });

  const canDepose = computed(() => {
    return state.value === "gas" && temperature.value < solidLiquid;
  });
  const canRecombine = computed(() => {
    return state.value === "plasma" && temperature.value < gasPlasma;
  });

  return {
    state,
    temperature,
    canMelt,
    canSublimate,
    canEvaporate,
    canFreeze,
    canIonize,
    canCondense,
    canDepose,
    canRecombine,
  };
};
