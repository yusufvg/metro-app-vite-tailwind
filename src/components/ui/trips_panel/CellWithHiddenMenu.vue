<script setup lang="ts">
import { Trip } from "@/lib/TripsModel";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableCell } from "@/components/ui/table";

defineProps<{
  trip: Trip;
  body: string;
  onDelete: (id: number) => void;
  onUnhide: (id: number) => void;
}>();
</script>

<template>
  <TableCell>
    <ContextMenu>
      <ContextMenuTrigger class="flex-1 p-4">{{ body }}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem @click="onDelete(trip.id)">Delete</ContextMenuItem>
        <ContextMenuItem @click="onUnhide(trip.id)">Unhide</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </TableCell>
</template>
