<script setup lang="ts">
import { Trip, TripsModel } from "@/lib/TripsModel";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronsUpDown } from "lucide-vue-next";
import { computed, ref } from "vue";
import { cn } from "@/lib/utils";
import CellWithActiveMenu from "./CellWithActiveMenu.vue";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import CellWithHiddenMenu from "./CellWithHiddenMenu.vue";

const model = ref(new TripsModel());
const date = ref<Date>();
const fareRef = ref<number>();
const noteRef = ref("");
const timesRef = ref(1);
const isActiveTripsTableOpen = ref(true);
const isHiddenTripsTableOpen = ref(false);

const bestPassCopy = computed(() => model.value.bestPass);
const hasPass = computed(() => model.value.hasPass);
const canAddTrip = computed(
  () =>
    (fareRef.value ?? 0) > 0 &&
    (fareRef.value ?? 0) <= 6 &&
    timesRef.value > 0 &&
    timesRef.value < 100
);
const activeTrips = computed(() => model.value.activeTrips);
const hiddenTrips = computed(() => model.value.hiddenTrips);

function addTrip() {
  let dateString =
    date.value == undefined
      ? "Today"
      : date.value.getMonth() + "/" + date.value.getDate();
  for (let i = 0; i < timesRef.value; i++) {
    model.value.addTrip(
      new Trip(
        model.value.nextId,
        dateString,
        +(fareRef.value ?? 0),
        noteRef.value
      )
    );
  }

  fareRef.value = 0;
  noteRef.value = "";
  timesRef.value = 1;
}

function onDelete(id: number) {
  model.value.deleteTrip(id);
}

function onHide(id: number) {
  model.value.hideTrip(id);
}

function onUnhide(id: number) {
  model.value.unhideTrip(id);
}
</script>

<style scoped>
@import "./trips_panel.css";
</style>

<template>
  <div class="main-column">
    <!-- Info Card -->
    <Card class="main-column-item">
      <CardHeader>
        <CardTitle><span>Best Pass Recommendation</span></CardTitle>
        <CardDescription
          >Based on your riding history, the most cost effective WMATA commuter
          pass will be recommended. Enter trips that fit your riding habits.
          Date and notes are optional, solely for organization and tracking what
          has already been entered.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div class="flex justify-between">
          <span :class="{ 'w-3/4': hasPass }">{{ bestPassCopy }}</span>
          <Button v-if="hasPass" variant="outline">
            <a href="https://www.wmata.com/fares/Monthly-Pass/" target="_blank">
              Buy
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Input Row -->
    <div class="main-column-item input-row">
      <Popover class="flex-inital">
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
      <Input
        class="flex-auto"
        v-model="fareRef"
        placeholder="Fare in $"
        :value="(fareRef ?? 0) > 0 ? fareRef : ''"
      />
      <Input class="flex-auto" v-model="noteRef" placeholder="Notes" />
      <span class="flex flex-row items-center gap-x-2 flex-inital">
        <Label for="times">x</Label>
        <Input id="times" v-model="timesRef" />
      </span>
      <Button class="flex-inital" @click="addTrip()" :disabled="!canAddTrip"
        >Add</Button
      >
    </div>

    <!-- Active Trips Table Card -->
    <div v-if="activeTrips.length > 0" class="main-column-item">
      <Collapsible :defaultOpen="true" v-model="isActiveTripsTableOpen">
        <Card>
          <CardHeader>
            <CardTitle class="flex justify-between">
              <span>Trips</span>
              <CollapsibleTrigger>
                <Button variant="outline" size="sm" class="w-9 p-0">
                  <ChevronsUpDown class="h-4 w-4" />
                  <span class="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </CardTitle>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <Table>
                <TableCaption>Right click a row to edit</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="trip in activeTrips">
                    <CellWithActiveMenu
                      :trip="trip"
                      :body="trip.id.toString()"
                      :onDelete="onDelete"
                      :onHide="onHide"
                    />
                    <CellWithActiveMenu
                      :trip="trip"
                      :body="trip.date"
                      :onDelete="onDelete"
                      :onHide="onHide"
                    />
                    <CellWithActiveMenu
                      :trip="trip"
                      :body="`$${trip.fare}`"
                      :onDelete="onDelete"
                      :onHide="onHide"
                    />
                    <CellWithActiveMenu
                      :trip="trip"
                      :body="trip.note"
                      :onDelete="onDelete"
                      :onHide="onHide"
                    /> </TableRow
                ></TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>

    <!-- Hidden Trips Table Card -->
    <div v-if="hiddenTrips.length > 0" class="main-column-item">
      <Collapsible v-model="isHiddenTripsTableOpen">
        <Card>
          <CardHeader>
            <CardTitle class="flex justify-between">
              <span>Hidden Trips</span>
              <CollapsibleTrigger>
                <Button variant="outline" size="sm" class="w-9 p-0">
                  <ChevronsUpDown class="h-4 w-4" />
                  <span class="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </CardTitle>
            <CardDescription
              >These trips aren't deleted but also are not used in the fare
              calculations for your pass.</CardDescription
            >
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="trip in hiddenTrips">
                    <CellWithHiddenMenu
                      :trip="trip"
                      :body="trip.id.toString()"
                      :onDelete="onDelete"
                      :onUnhide="onUnhide"
                    />
                    <CellWithHiddenMenu
                      :trip="trip"
                      :body="trip.date"
                      :onDelete="onDelete"
                      :onUnhide="onUnhide"
                    />
                    <CellWithHiddenMenu
                      :trip="trip"
                      :body="`$${trip.fare}`"
                      :onDelete="onDelete"
                      :onUnhide="onUnhide"
                    />
                    <CellWithHiddenMenu
                      :trip="trip"
                      :body="trip.note"
                      :onDelete="onDelete"
                      :onUnhide="onUnhide"
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  </div>
</template>
