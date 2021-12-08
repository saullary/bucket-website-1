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
    <div>
      <img src="img/logo.svg" height="30" />
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
    }),
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
      drawer: false,
    };
  },
};
</script>