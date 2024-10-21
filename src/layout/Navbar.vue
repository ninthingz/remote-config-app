<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = ()=>{
  localStorage.removeItem("token");
  router.push("/login")
}
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <span class="btn btn-ghost text-xl">SWtest云配置</span>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <button class="btn btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-5 w-5 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
      </button>
        <ul
          tabindex="0"
          class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li><a @click="logout">登出</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
