import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
// import locales from "./locales";
Vue.config.productionTip = false;

router.beforeEach((to, _, next) => {
  let { title } = to.meta || {};
  const name = "4EVERLAND BUCKET";
  if (title) {
    title += " - " + name;
    for (const key in to.params) {
      title = title.replace(`{${key}}`, to.params[key]);
    }
  } else title = name;
  document.title = title;
  next();
});

new Vue({
  router,
  store,
  vuetify,
  // i18n: locales,
  render: (h) => h(App),
  computed: {
    ...mapState({
      token: (s) => s.token,
      noticeMsg: (s) => s.noticeMsg,
    }),
  },
  mounted() {
    this.onInit();
  },
  watch: {
    "$route.path"() {
      window.scrollTo(0, 0);
      this.$loading.close();
    },
    token(val) {
      if (val) {
        // this.onInit();
      }
    },
    noticeMsg({ name }) {
      if (name == "updateUser") {
        this.getUesrInfo();
      }
    },
  },
  methods: {
    async onInit() {
      const now = Date.now();
      if (this.token) {
        await this.getUesrInfo();
        this.$setState({
          noticeMsg: {
            name: "onInit",
          },
        });
        try {
          if (now - localStorage.refreshAt > 2 * 3600e3) {
            await this.$http.get("/githubapp/refresh");
            localStorage.refreshAt = now;
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    },
    async getUesrInfo() {
      const { data } = await this.$http.get("/user");
      localStorage.userInfo = JSON.stringify(data);
      this.$setState({
        userInfo: data,
      });
    },
  },
}).$mount("#app");
