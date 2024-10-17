<script lang="ts" setup>
import AppMain from "../layout/AppMain.vue";
import instance from "../api";
import { useRouter } from "vue-router";
import { getCBSUserInfo } from "../api/cbs-users";
import { useToastStore } from "../stores/toast-store";

const router = useRouter();

const toastStore = useToastStore();

if (localStorage.getItem("token") !== null) {
  console.log(localStorage.getItem("token"));
  instance.defaults.headers.common["Authorization"] =
    localStorage.getItem("token");
}

if (instance.defaults.headers.common["Authorization"] === "") {
  router.push("/login");
} else {
  getCBSUserInfo().then((res) => {
    if (res.data.code !== 200) {
      router.push("/login");
    } else {
      toastStore.showToast("欢迎你: " + res.data.data!.nickname, "success");
      router.push("/config");
    }
  });
}
</script>

<template>
  <AppMain></AppMain>
</template>
