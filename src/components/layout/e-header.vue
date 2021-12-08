<template>
  <e-wrap class="pb-0" :class="asMobile ? '' : 'pt-0'">
    <div class="pos-r">
      <v-btn @click="onMenu" icon v-if="asMobile">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <div class="right-0" :class="asMobile ? 'y-center' : 'pos-a top-0 mt-4'">
        <v-text-field
          class="hide-msg"
          dense
          solo
          label="Search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </div>
    </div>
  </e-wrap>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
  methods: {
    onMenu() {
      this.$setState({
        noticeMsg: {
          name: "showDrawer",
        },
      });
    },
  },
};
</script>