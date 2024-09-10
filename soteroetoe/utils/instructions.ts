import { instructions } from "@olympos/soteria";

export const matterInstructions = instructions<
  MatterState,
  MatterTrigger,
  Matter
>({
  sublimate: [
    { origins: "solid", destination: "gas", conditions: "canSublimate" },
  ],
  melt: [
    {
      origins: "solid",
      destination: "liquid",
      effects: "setEnvironment",
      conditions: "canMelt",
    },
  ],
  evaporate: [
    { origins: "liquid", destination: "gas", conditions: "canEvaporate" },
  ],
  ionize: [{ origins: "gas", destination: "plasma", conditions: "canIonize" }],
  freeze: [
    { origins: "liquid", destination: "solid", conditions: "canFreeze" },
  ],
  depose: [{ origins: "gas", destination: "solid", conditions: "canDepose" }],
  condense: [
    { origins: "gas", destination: "liquid", conditions: "canCondense" },
  ],
  recombine: [
    { origins: "plasma", destination: "gas", conditions: "canRecombine" },
  ],
});
