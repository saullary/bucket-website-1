<template>
  <div class="ta-c mt-15">
    <div class="mb-8 pos-r">
      <img
        src="img/bg/login1.png"
        class="w100p"
        style="max-width: 600px; min-height: 200px"
      />
      <div class="x-center" style="bottom: 30%">
        <v-btn color="primary" large :loading="loading" @click="onLogin">
          <v-icon color="white">mdi-github</v-icon>
          <span class="ml-1">Continue With Github</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import qs from "querystring";

export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState({
      isTouch: (s) => s.isTouch,
      isFocus: (s) => s.isFocus,
      token: (s) => s.token,
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  watch: {
    isFocus(val) {
      if (val && this.isOpen) {
        this.isOpen = false;
        console.log("on focus");
        // this.onInit();
      }
    },
    noticeMsg({ name }) {
      if (name == "login") {
        this.onLogin();
      }
    },
  },
  mounted() {
    this.onInit();
    if (/installation_id/.test(location.href) && !this.isTouch) {
      window.close();
    }
  },
  methods: {
    async onInit() {
      const { code } = qs.parse(location.search.replace("?", ""));
      const { invite } = this.$route.query;
      if (invite) {
        localStorage.inviteBy = invite;
      }
      if (code) {
        try {
          this.$loading();
          const { data } = await this.$http.post(`/auth/${code}`, null, {
            params: {
              _auth: 1,
            },
          });
          console.log(data);
          localStorage.authData = JSON.stringify(data);
          const token = data.accessToken;
          localStorage.token = token;
          localStorage.refreshAt = Date.now();
          let hash = "";
          if (localStorage.loginTo) {
            const storKey = "got_storage_" + token.substr(-5);
            if (localStorage[storKey]) hash = localStorage.loginTo;
            localStorage.loginTo = "";
          }
          location.href = "index.html" + hash;
        } catch (error) {
          console.log(error);
        }
        this.$loading.close();
        return;
      }
      if (localStorage.token) {
        if (this.token != localStorage.token) {
          const data = {
            token: localStorage.token,
          };
          this.$setState(data);
        }
        this.$router.replace("/storage/");
      }
    },
    async onLogin() {
      try {
        this.$loading();
        const params = {
          _auth: 1,
          redirect_url: location.origin,
          platform: "github",
        };
        if (localStorage.inviteBy) {
          params.inviteCode = localStorage.inviteBy;
        }
        const { data } = await this.$http.get("/login", {
          params,
        });
        this.isOpen = true;
        // this.$openWindow(data.url);
        location.href = data.login_url;
      } catch (error) {
        console.log(error);
        this.$loading.close();
      }
    },
  },
};
</script>
