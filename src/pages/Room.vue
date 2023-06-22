<template>
  <v-layout v-if="!loaded" class="bg-black d-flex justify-center align-center">
    <v-progress-circular
      model-value="20"
      :size="74"
      :width="7"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <v-layout class="bg-black d-block" v-else>
    <v-container block class="mt-16 text-center">
      <p class="text-h2">Waiting for Players</p>
    </v-container>
    <v-btn
      v-if="$store.state.isHost"
      class="d-block mx-auto"
      width="300"
      color="white"
      @click="startGame"
      >START GAME</v-btn
    >
    <v-container class="d-flex justify-space-evenly flex-wrap">
      <v-card class="ma-10 pa-5" v-for="player in roomPlayers">
        <v-card-text> {{ player }}</v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { dbFirestore, dbRtdb } from "@/firebase";
export default {
  data() {
    return { loaded: true, roomId: "ZnOVxgSeC2T1vSd9k2cQ" };
  },
  computed: {
    roomPlayers() {
      return this.$store.state.roomPlayers;
    },
    gameState() {
      return this.$store.state.room.gameState;
    },
  },
  methods: {
    async startGame() {
      debugger;
      const docRef = doc(dbFirestore, "rooms", this.roomId);
      await updateDoc(docRef, {
        gameState: "start",
      });
    },
  },
  watch: {
    gameState(value) {
      if (value === "start") {
        setTimeout(() => {
          this.$router.push("/game");
        }, 1000);
      }
    },
  },
};
</script>
