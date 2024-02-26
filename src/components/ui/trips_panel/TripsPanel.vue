<script setup lang="ts">
import { Trip, TripsModel } from "@/lib/TripsModel";
import { format } from "date-fns";
import { computed, ref } from "vue";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const model = ref(new TripsModel());
const bestPassCopy = computed(() => model.value.bestPass);
const date = ref<Date>();
const fareRef = ref(0);
const noteRef = ref("");

function addTrip(date: Date | undefined, fare: number, note: string) {
  let dateString =
    date == undefined ? "Today" : date.getMonth() + "/" + date.getDate();
  model.value.addTrip(new Trip(model.value.nextId, dateString, fare, note));

  fareRef.value = 0;
  noteRef.value = "";
}

function onRemove(id: number) {
  model.value.deleteTrip(id);
}
</script>

<style ref="./trips_panel.css" />

<template>
  <p>{{ bestPassCopy }}</p>

  <Popover>
    <PopoverTrigger as-child>
      <Button
        :variant="'outline'"
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span>{{ date ? format(date, "PPP") : "Pick a date" }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="date" />
    </PopoverContent>
  </Popover>
  <Input v-model="fareRef" placeholder="Fare in $" />
  <Input v-model="noteRef" placeholder="Notes" />

  <Button @click="addTrip(date, fareRef, noteRef)">Add</Button>

  <p v-for="trip in model.trips">
    {{ trip.date + " - " + trip.note + " - " + trip.fare }}
    <Button @click="onRemove(trip.id)">X</Button>
  </p>
</template>
