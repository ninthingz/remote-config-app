<script lang="ts" setup>
import { ref } from "vue";
import { cbsLogin } from "../api/cbs-users";
import instance from "../api";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");

function login() {
  cbsLogin({
    username: username.value,
    password: password.value,
    source: "SMC",
  }).then((res) => {
    if (res.data.code == 200) {
      const token = res.data.data!.tokenHead + res.data.data!.token;
      instance.defaults.headers.common["Authorization"] = token;
      localStorage.setItem("token", token);
      router.push("/config");
    }
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="mb-2 text-3xl font-bold">SWtest云配置</h1>
    <label
      class="input input-bordered mb-2 flex w-full max-w-xs items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
      >
        <path
          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
        />
      </svg>
      <input type="text" class="grow" placeholder="用户名" v-model="username" />
    </label>
    <label
      class="input input-bordered mb-2 flex w-full max-w-xs items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
      >
        <path
          fill-rule="evenodd"
          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        type="password"
        class="grow"
        placeholder="密码"
        v-model="password"
      />
    </label>
    <button
      @click="login"
      class="btn btn-primary flex w-full max-w-xs items-center gap-2"
    >
      登录
    </button>
  </div>
</template>
