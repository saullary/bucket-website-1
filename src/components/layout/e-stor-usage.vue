<template>
  <div>
    <div>
      <v-icon color="#D1DCFC" size="16">mdi-cloud</v-icon>
      <span class="gray fz-14 ml-2">Storage Capacity</span>
    </div>
    <v-progress-linear
      rounded
      height="6"
      :value="usagePerc * 100"
      class="mt-3"
    ></v-progress-linear>
    <div class="mt-3">
      <b class="fz-18">{{ info.usedStorage || "0" }}</b>
      <span class="gray fz-14"> / 1024MB used</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      info: (s) => s.usageInfo,
      noticeMsg: (s) => s.noticeMsg,
      token: (s) => s.token,
    }),
    usagePerc() {
      const { usedStorage, totalStorage } = this.info;
      if (!usedStorage) return 0;
      return usedStorage / totalStorage;
    },
  },
  watch: {
    noticeMsg({ name }) {
      if (name == "updateUsage") {
        this.getInfo();
      }
    },
  },
  created() {
    if (this.token) {
      this.getInfo();
    }
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.get("/user/resource/usage");
        this.$setState({
          usageInfo: {
            totalStorage: parseInt(data.totalStorage / 1024),
            usedStorage: (data.usedStorage / 1024).toFixed(2),
          },
        });
      } catch (error) {
        //
      }
    },
  },
};
</script>