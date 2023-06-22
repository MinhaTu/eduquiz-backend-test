import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/Home.vue";
import Room from "../pages/Room.vue";
import Game from "../pages/Game.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/room", component: Room },
    { path: "/game", component: Game },
  ],
});

export default router;
