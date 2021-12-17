<template>
  <div>
    <v-dialog v-model="showPop" max-width="550" eager>
      <e-dialog-close @click="showPop = false" />
      <div class="pd-20">
        <h3>Upload</h3>
        <div class="mt-5">
          <e-upload ref="upload" @input="onInput"></e-upload>
        </div>

        <div class="mt-5 ta-c">
          <!-- <v-btn outlined @click="onAdd">Add Files</v-btn> -->
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
    };
  },
  methods: {
    onAdd() {
      this.$refs.upload.onClick();
    },
    onInput() {
      const { path } = this.$route;
      if (!/\/storage\/.+/.test(path)) return;
      this.showPop = true;
    },
    readImg(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.imgList.push({
          src: e.target.result,
          size: file.size,
        });
      };
    },
  },
};
</script>
