<script lang="ts" setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <RouterView></RouterView>
    </div>
  </div>
</template>
