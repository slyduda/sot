<template>
  <div>
    <svg class="svg-content" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
      <g></g>
    </svg>

    <h2>Available Triggers</h2>
    <ul style="display: flex; list-style-type: none;">
      <li v-for="transition in available" :key="transition.trigger">
        <BaseButton @click="trigger(transition.trigger)">{{ transition.trigger }}: {{ transition.destination }}
        </BaseButton>
      </li>
    </ul>

    <h2>Context</h2>
    <input v-model="temperature" type="number">
    <pre>{{ matter }}</pre>
    <pre>{{ matter.state }}</pre>
    <h2>History</h2>
    <pre>{{ machine.history }}</pre>
  </div>
</template>

<script setup lang="ts">
import { soteria } from "@olympos/soteria"
import { soterion } from "@olympos/soterion"

// Merge composable instance with state machine
const matter = useMatter("solid");
const machine = soteria<Matter, MatterState, MatterTrigger>(matter, matterInstructions, { verbose: true }, watch);

const { temperature, state } = matter

const available = computed(() => {
  return machine.validatedTransitions
})

const trigger = (trigger: MatterTrigger) => {
  machine.trigger(trigger)
}

onMounted(() => {
  machine.visualize("svg", soterion)
})

</script>


<style>
.node rect {
  stroke: #333;
  fill: #fff;
}

.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
</style>