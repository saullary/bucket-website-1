import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { mapState } from "vuex";
import vuetify from "./plugins/vuetify";
import "./setup";
import { endpoint } from "./api";
// import AWS from "aws-sdk";
import { S3 } from "@aws-sdk/client-s3";
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
      } else if (this.$route.path != "/") {
        this.$router.replace("/");
      }
    },
    async getUesrInfo() {
      const { data } = await this.$http.get("/user");
      localStorage.userInfo = JSON.stringify(data);
      this.$setState({
        userInfo: data,
      });
      this.initS3();
    },
    async initS3() {
      let stsData = JSON.parse(localStorage.stsData || "null");
      if (!stsData || Date.now() >= (stsData.expiredAt - 3600) * 1000) {
        const { data } = await this.$http.get("/user/sts/assume-role");
        stsData = data;
        localStorage.stsData = JSON.stringify(data);
      }
      const { accessKey, secretKey, sessionToken } = stsData;
      const s3 = new S3({
        endpoint,
        signatureVersion: "v2",
        s3ForcePathStyle: true,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
          sessionToken,
        },
        region: "eu-west-2",
      });
      window.s3 = Vue.prototype.$s3 = s3;
      console.log("s3", s3);
      // window.ss3 = Vue.prototype.$ss3 = new AWS.S3({
      //   endpoint,
      //   signatureVersion: "v2",
      //   s3ForcePathStyle: true,
      //   accessKeyId: accessKey,
      //   secretAccessKey: secretKey,
      // });
      this.$setState({
        s3,
      });
    },
  },
}).$mount("#app");
