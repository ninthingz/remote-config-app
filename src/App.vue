<script setup lang="ts">
import { useToastStore } from "./stores/toast-store";

const toastStore = useToastStore();
</script>

<template>
  <div
    class="toast toast-center toast-top"
    v-if="toastStore.showInfo || toastStore.showSuccess"
  >
    <div class="alert alert-info" v-if="toastStore.showInfo">
      <span>{{ toastStore.msg }}</span>
    </div>
    <div class="alert alert-success" v-if="toastStore.showSuccess">
      <span>{{ toastStore.msg }}</span>
    </div>
  </div>
  <RouterView class="h-screen" />
</template>

<style scoped></style>
