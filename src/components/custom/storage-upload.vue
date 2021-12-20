<template>
  <div>
    <v-dialog
      v-model="showPop"
      max-width="550"
      eager
      :persistent="files.length > 0"
    >
      <e-dialog-close @click="showPop = false" />
      <div class="pd-20">
        <h3>Upload</h3>
        <div class="mt-5">
          <e-upload
            ref="upload"
            v-model="files"
            :disabeld="disabeld"
          ></e-upload>
        </div>

        <div class="mt-5 ta-c">
          <v-btn outlined @click="onClear">{{
            files.length ? "Clear" : "Cancel"
          }}</v-btn>
          <v-btn color="primary" class="ml-4" @click="$toast('dev')"
            >Confirm</v-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      showPop: false,
      files: [],
    };
  },
  computed: {
    disabeld() {
      const { path } = this.$route;
      return /\/storage\/.+/.test(path);
    },
  },
  watch: {
    files() {
      this.showPop = true;
    },
  },
  methods: {
    onAdd() {
      this.$refs.upload.onClick();
    },
    onClear() {
      if (!this.files.length) this.showPop = false;
      else this.files = [];
    },
  },
};
</script>
