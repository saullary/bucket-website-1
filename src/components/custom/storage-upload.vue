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
        <div class="d-flex al-end">
          <h3>Upload</h3>
          <span class="gray ml-3" v-if="files.length > 1">
            {{ files.length }} files Total ({{ totalSize }})
          </span>
        </div>
        <div class="mt-5">
          <e-upload ref="upload" v-model="files" :disabled="disabled">
            <div style="min-height: 190px" v-show="files.length > 0">
              <v-data-table
                class="elevation-1"
                :headers="headers"
                :items="list"
                hide-default-footer
                fixed-header
                :height="files.length > (asMobile ? 2 : 5) ? '50vh' : null"
              >
                <template v-slot:item.action="{ item }">
                  <template v-if="uploading">
                    <v-progress-circular
                      size="24"
                      :width="3"
                      :color="curIdx > item.index ? 'success' : 'primary'"
                      :indeterminate="curIdx < item.index"
                      :value="curIdx > item.index ? 100 : progress"
                    ></v-progress-circular>
                  </template>
                  <template v-else>
                    <v-btn icon @click="onDel(item.index)">
                      <v-icon size="18">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                </template>
              </v-data-table>
            </div>
          </e-upload>
        </div>

        <div class="mt-5 ta-c">
          <v-btn v-if="!uploading" outlined @click="onClear">{{
            files.length ? "Clear" : "Cancel"
          }}</v-btn>
          <v-btn
            v-if="!(uploading && curIdx == files.length - 1)"
            color="primary"
            class="ml-4"
            @click="onConfirm"
            >{{ confirmTxt }}</v-btn
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
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Size",
          value: "size",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      progress: 0,
      curIdx: 0,
      uploading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    list() {
      return this.files.map((it, index) => {
        return {
          name: it.name,
          size: this.$utils.getFileSize(it.size),
          index,
        };
      });
    },
    disabled() {
      const { path } = this.$route;
      return !/\/storage\/.+/.test(path) || this.uploading;
    },
    totalSize() {
      let size = 0;
      this.files.forEach((it) => {
        size += it.size;
      });
      return this.$utils.getFileSize(size);
    },
    confirmTxt() {
      return this.uploading && this.curIdx < this.files.length - 1
        ? "Pause"
        : "Confirm";
    },
  },
  watch: {
    files() {
      this.showPop = true;
    },
  },
  methods: {
    onDel(i) {
      this.files.splice(i, 1);
    },
    onAdd() {
      this.$refs.upload.onClick();
    },
    onClear() {
      if (!this.files.length) this.showPop = false;
      else this.files = [];
    },
    async onConfirm() {
      this.uploading = true;
      this.curIdx = 0;
      this.progress = 0;
      while (this.progress < 100) {
        await this.$sleep(200);
        this.progress = Math.min(100, this.progress + Math.random() * 50);
        if (this.progress == 100) {
          if (this.curIdx == this.files.length - 1) this.uploading = false;
          else {
            this.curIdx += 1;
            this.progress = 0;
          }
        }
      }
      // for (const file of this.files) {
      // }
    },
  },
};
</script>
