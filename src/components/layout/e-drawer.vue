<style lang="scss">
.e-header {
  background: linear-gradient(160deg, #ffffff 0%, #d7e9ff 50%, #fff1fe 100%);
  box-shadow: 5px 0px 30px 0px rgba(0, 0, 0, 0.1);
  .v-navigation-drawer__border {
    display: none;
  }
}
</style>

<template>
  <v-navigation-drawer class="e-header" v-model="drawer" app>
    <div class="pt-10 pb-3 ta-c">
      <a href="/">
        <img src="img/logo.svg" height="28" />
      </a>
    </div>
    <div class="pa-8">
      <div>
        <v-icon color="#D1DCFC" size="16">mdi-cloud</v-icon>
        <span class="gray fz-14 ml-2">Storage Capacity</span>
      </div>
      <v-progress-linear
        rounded
        height="6"
        value="15"
        class="mt-3"
      ></v-progress-linear>
    </div>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "showDrawer") {
        this.drawer = true;
      }
    },
  },
  data() {
    return {
      drawer: null,
    };
  },
};
</script>