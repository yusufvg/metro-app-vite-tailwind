<script setup lang="ts">
// import "@/assets/index.css";
import { TestModel } from "@/lib/TestModel";
import { computed, ref } from "vue";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const model = ref(new TestModel());
const copy = computed(() => model.value.copy);
const trip = ref(0);

function onAdd(value: number) {
  if (value > 0) {
    model.value.addTrip(value);
  }
}

function onClear() {
  trip.value = 0;
  model.value.clearTrip();
}
</script>

<template>
  <div class="test-column">
    <Card class="test-column-item">
      <CardHeader>
        <CardTitle>Best Pass Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{{ copy }}</p>
      </CardContent>
    </Card>
    <div class="test-column-item input-row">
      <Input
        v-model="trip"
        type="number"
        :value="trip > 0 ? trip : ''"
        placeholder="Enter the trip fare amount in $"
        class="w-1/2 mr-auto"
      />
      <Button @click="onAdd(trip)">Add</Button>
      <Button @click="onClear()">Clear</Button>
    </div>
  </div>
</template>
