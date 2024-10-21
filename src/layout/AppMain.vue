<script lang="ts" setup>
import { RouterView } from "vue-router";
import Navbar from "./Navbar.vue";
</script>

<template>
  <div data-theme="dark" class="flex h-full">
    <div class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <Navbar></Navbar>
      <RouterView></RouterView>
    </div>
  </div>
</template>
