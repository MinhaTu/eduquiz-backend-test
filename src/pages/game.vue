<template>
  <v-container>
    <v-card>
      <v-card-text class="text-h6 text-center">
        {{ slide.question }}</v-card-text
      >
    </v-card>
  </v-container>
  <div v-if="$store.state.isHost">
    <v-btn
      v-if="!counter"
      class="d-block mx-auto"
      width="300"
      color="white"
      @click="fireNextState"
      >{{ buttonLabel }}</v-btn
    >
    <p class="text-center" v-if="buttonLabel !== 'Resultados Parciais'">
      {{ $store.state.room.results }}
    </p>
  </div>
  <div class="mt-10 text-h5 text-center">{{ (counter / 1000).toFixed(0) }}</div>
  <v-row class="mt-10 w-50 mx-auto">
    <v-col>
      <v-btn
        class="w-100 h-100"
        size="x-large"
        color="red"
        :disabled="buttonsDisabled"
        @click="sendAnswer('optA')"
        >{{ slide.optA }}</v-btn
      >
    </v-col>
    <v-col>
      <v-btn
        class="w-100 h-100"
        size="x-large"
        color="green"
        :disabled="buttonsDisabled"
        @click="sendAnswer('optB')"
        >{{ slide.optB }}</v-btn
      >
    </v-col>
  </v-row>
  <v-row class="w-50 mx-auto">
    <v-col>
      <v-btn
        class="w-100 h-100"
        size="x-large"
        color="blue"
        :disabled="buttonsDisabled"
        @click="sendAnswer('optC')"
        >{{ slide.optC }}</v-btn
      >
    </v-col>
    <v-col>
      <v-btn
        class="w-100 h-100"
        size="x-large"
        color="yellow"
        :disabled="buttonsDisabled"
        @click="sendAnswer('optD')"
        >{{ slide.optD }}</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import {
  push,
  ref,
  onValue,
  serverTimestamp,
  query,
  orderByChild,
} from "firebase/database";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { dbFirestore, dbRtdb } from "@/firebase";
export default {
  data() {
    return {
      counter: 0,
      isAnswerCreated: false,
      buttonsDisabled: false,
      buttonLabel: "Resultados Parciais",
      roomId: "ZnOVxgSeC2T1vSd9k2cQ",
    };
  },
  computed: {
    slide() {
      const slide = this.$store.state.room.currentSlide;
      return slide;
    },
  },
  watch: {
    slide() {
      this.setTimer();
      this.buttonsDisabled = false;
    },
  },
  methods: {
    async sendAnswer(option) {
      debugger;
      const docRef = doc(
        dbFirestore,
        "answers",
        this.$store.state.room.currentSlideId
      );
      if (this.isAnswerCreated) {
        await updateDoc(
          docRef,
          {
            [this.$store.state.currentPlayer]: {
              answer: option,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(
          docRef,
          {
            [this.$store.state.currentPlayer]: {
              answer: option,
            },
          },
          { merge: true }
        );
      }
      this.buttonsDisabled = true;
    },
    async fireNextState() {
      debugger;
      if (this.buttonLabel === "Resultados Parciais") {
        const docRef = doc(dbFirestore, "rooms", this.roomId);
        await updateDoc(docRef, {
          gameState: "result",
        });

        this.buttonLabel = "Continuar";
      } else if (this.buttonLabel === "Continuar") {
        const docRef = doc(dbFirestore, "rooms", this.roomId);
        await updateDoc(docRef, {
          gameState: "next",
        });

        this.buttonLabel = "Resultados Parciais";
      }
    },
    setTimer() {
      let serverTimeOffset = 0;

      const offsetRef = ref(dbRtdb, ".info/serverTimeOffset");
      onValue(offsetRef, (snap) => {
        serverTimeOffset = snap.val();
      });

      const timersRef = ref(
        dbRtdb,
        "timers/" + this.$store.state.room.currentSlideId
      );
      const q = query(timersRef, orderByChild("startAt"));
      onValue(q, (snapshot) => {
        debugger;
        let timers = [];
        const data = snapshot.val();
        for (const id in data) {
          timers.push({
            id: id,
            seconds: data[id].seconds,
            startAt: data[id].startAt,
          });
        }

        console.log("SNAPSHOT TIMERS");
        console.log(timers);

        const seconds = data.seconds;
        const startAt = data.startAt;
        const interval = setInterval(() => {
          this.counter =
            seconds * 1000 - (Date.now() - startAt - serverTimeOffset);
          if (this.counter < 0) {
            clearInterval(interval);
            this.counter = 0;
          } else {
            console.log(
              `${Math.floor(this.counter / 1000)}.${this.counter % 1000}`
            );
          }
        }, 100);
      });
    },
  },
  mounted() {
    this.setTimer();
  },
};
</script>
