import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "../view/LoginView.vue";
import MainView from "../view/MainView.vue";
import ConfigView from "../view/ConfigView.vue";

const routes = [
  {
    path: "/",
    component: MainView,
    children: [{ path: "config", component: ConfigView }],
  },
  { path: "/login", component: LoginView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
