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
      <e-stor-usage></e-stor-usage>
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
      <e-menu offset-x open-on-hover>
        <span slot="ref" class="d-flex al-c pa-2 ml-4 mb-4">
          <v-avatar color="indigo" size="30">
            <v-img :src="userInfo.avatar" v-if="userInfo.avatar"></v-img>
            <v-icon dark v-else> mdi-account </v-icon>
          </v-avatar>
          <span class="ml-3 gray-3">{{ userInfo.username || "Unknown" }}</span>
          <v-icon class="ml-auto" color="#aaa">mdi-chevron-right</v-icon>
        </span>
        <v-list dense>
          <v-list-item link to="/apikey">
            <span>Settings</span>
          </v-list-item>
          <v-list-item link @click="onLogout">
            <span>Logout</span>
          </v-list-item>
        </v-list>
      </e-menu>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

const initFilePath = "/storage/";
const initDomainPath = "/domain";

export default {
  data() {
    return {
      drawer: null,
      filesPath: initFilePath,
      domainPath: initDomainPath,
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
          to: this.path.includes(initDomainPath)
            ? initDomainPath
            : this.domainPath,
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
      } else if (val.includes(initDomainPath)) {
        this.domainPath = val;
      }
    },
  },
  methods: {
    onLogout() {
      localStorage.clear();
      location.href = "index.html";
    },
  },
};
</script>