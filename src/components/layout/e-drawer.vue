<style lang="scss">
.e-drawer {
  background: linear-gradient(160deg, #ffffff 0%, #d7e9ff 50%, #fff1fe 100%);
  box-shadow: 5px 0px 30px 0px rgba(0, 0, 0, 0.1);
  .v-navigation-drawer__border {
    display: none;
  }
}
</style>

<template>
  <v-navigation-drawer class="e-drawer" v-model="drawer" app>
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
      <div class="mt-3">
        <b class="fz-18">20</b>
        <span class="gray fz-14"> / 1024MB used</span>
      </div>
    </div>

    <v-divider></v-divider>

    <div class="pa-8">
      <div class="mb-4" v-for="(it, i) in list" :key="i">
        <v-btn
          class="menu-btn"
          rounded
          plain
          block
          :to="it.to"
          :href="it.href"
          :target="it.href ? '_blank' : ''"
        >
          <v-icon size="16">mdi-{{ it.icon }}</v-icon>
          <span class="ml-1" style="min-width: 65px">{{ it.label }}</span>
        </v-btn>
      </div>
    </div>

    <div class="pos-btm">
      <a href="/" class="d-flex al-c pa-2 ml-4 mb-4 hover-1">
        <v-avatar color="indigo" size="30">
          <v-img :src="userInfo.avatar" v-if="userInfo.avatar"></v-img>
          <v-icon dark v-else> mdi-account </v-icon>
        </v-avatar>
        <span class="ml-3 gray-3">{{ userInfo.username || "Unknown" }}</span>
        <v-icon class="ml-auto" color="#aaa">mdi-chevron-right</v-icon>
      </a>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

const initFilePath = "/storage/";

export default {
  data() {
    return {
      drawer: null,
      filesPath: initFilePath,
    };
  },
  computed: {
    ...mapState({
      noticeMsg: (s) => s.noticeMsg,
      userInfo: (s) => s.userInfo,
    }),
    path() {
      return this.$route.path;
    },
    list() {
      return [
        {
          label: "Files",
          to: this.path.includes(initFilePath) ? initFilePath : this.filesPath,
          icon: "file-multiple",
        },
        {
          label: "Domains",
          to: "/domain",
          icon: "wan",
        },
        {
          label: "Billing",
          to: "/billing",
          icon: "credit-card-outline",
        },
        // {
        //   label: "Settings",
        //   to: "/settings",
        //   icon: "cog-outline",
        // },
        {
          label: "Docs",
          href: "https://bucket-docs.4everland.org",
          icon: "file-document-outline",
        },
      ];
    },
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "showDrawer") {
        this.drawer = true;
      }
    },
    path(val) {
      if (val.includes(initFilePath)) {
        this.filesPath = val;
      }
    },
  },
};
</script>