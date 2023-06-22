<template>
  <v-layout class="bg-black d-flex justify-center align-center">
    <v-card width="300" class="pa-3">
      <v-list>
        <v-list-item>Escolha seu nickname para jogar</v-list-item>
        <v-container>
          <v-text-field
            variant="outlined"
            type="text"
            label="Nome"
            v-model="nickname"
          ></v-text-field>
          <v-btn @click="redirect">entrar</v-btn>

          <v-checkbox
            v-if="!roomHasHost"
            label="Ser host?"
            v-model="beHost"
          ></v-checkbox>
        </v-container>
      </v-list>
    </v-card>
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
import {
  ref,
  onValue,
  set,
  serverTimestamp,
  onDisconnect,
} from "firebase/database";
import { dbFirestore, dbRtdb } from "@/firebase";
export default {
  data() {
    return {
      roomHasHost: false,
      beHost: false,
      nickname: null,
      roomId: "ZnOVxgSeC2T1vSd9k2cQ",
    };
  },
  methods: {
    amIOnline() {
      var uid = this.nickname;

      var userStatusDatabaseRef = ref(dbRtdb, "/status/" + uid);

      var isOfflineForDatabase = {
        state: "offline",
        last_changed: serverTimestamp(),
      };

      var isOnlineForDatabase = {
        state: "online",
        last_changed: serverTimestamp(),
      };
      var userStatusDatabaseRef = ref(dbRtdb, "/status/" + uid);
      onValue(ref(dbRtdb, ".info/connected"), (snapshot) => {
        if (snapshot.val() == false) {
          return;
        }

        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          });
      });
    },
    verifyRoomHost() {
      const docRef = doc(dbFirestore, "rooms", this.roomId);
      const unsub = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          this.roomHasHost = doc.data().hostId ? true : false;
          console.log(this.roomHasHost);
          console.log("Document data:", doc.data());

          this.$store.state.roomPlayers = doc.data().roomPlayers
            ? doc.data().roomPlayers
            : null;

          this.$store.state.room = doc.data();

          console.log("roomPlayers:", this.$store.state.roomPlayers);
        } else {
          console.log("Document not found");
        }
      });
    },
    updateRoomHost() {
      this.$store.state.isHost = true;
      const docRef = doc(dbFirestore, "rooms", this.roomId);
      updateDoc(docRef, {
        hostId: this.nickname,
      });
    },
    addRoomPlayer() {
      const docRef = doc(dbFirestore, "rooms", this.roomId);
      updateDoc(docRef, {
        roomPlayers: arrayUnion(this.nickname),
      });
    },
    redirect() {
      if (this.beHost) {
        this.updateRoomHost();
      }
      this.$store.state.currentPlayer = this.nickname;
      console.log("Vuex currentPlayer:", this.$store.state.currentPlayer);
      this.addRoomPlayer();
      this.amIOnline();
      this.$router.push("/room");
    },
  },
  beforeMount() {
    this.verifyRoomHost();
  },
};
</script>
