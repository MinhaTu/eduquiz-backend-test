<template>
  <v-app class="bg-black">
    <v-container class="w-25 text-center">
      <v-card>
        <v-card-title>online</v-card-title>
      </v-card>
    </v-container>

    <router-view></router-view>
  </v-app>
</template>

<script>
import { serverTimestamp, doc } from "firebase/firestore";
export default {
  methods: {},
};
</script>
