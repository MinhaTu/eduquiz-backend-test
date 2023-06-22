import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/Home.vue";
import Room from "../pages/Room.vue";
import Game from "../pages/Game.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/eduquiz-backend-test/", component: Home },
    { path: "/eduquiz-backend-test/room", component: Room },
    { path: "/eduquiz-backend-test/game", component: Game },
  ],
});

export default router;
