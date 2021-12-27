import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
import AWS from "aws-sdk";
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
        this.onInit();
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
      if (this.token) {
        await this.getUesrInfo();
        this.$setState({
          noticeMsg: {
            name: "onInit",
          },
        });
      }
    },
    async getUesrInfo() {
      const { data } = await this.$http.get("/user");
      localStorage.userInfo = JSON.stringify(data);
      const { accessKey, secretKey } = data;
      const credentials = new AWS.Credentials({
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });
      const s3 = (this.$s3 = new AWS.S3({
        endpoint: "s3gw.foreverland.xyz",
        credentials,
        // sslEnabled: false,
        signatureVersion: "v2",
      }));
      window.s3 = s3;
      console.log("s3", s3);
      this.$setState({
        userInfo: data,
        s3,
      });
    },
  },
}).$mount("#app");
