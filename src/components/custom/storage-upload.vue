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
          <e-upload ref="upload" v-model="files" :disabeld="disabeld">
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
                  <v-btn icon @click="onDel(item.index)">
                    <v-icon size="18">mdi-trash-can-outline</v-icon>
                  </v-btn>
                  <v-progress-circular
                    size="24"
                    :width="3"
                    color="primary"
                    :value="30"
                  ></v-progress-circular>
                </template>
              </v-data-table>
            </div>
          </e-upload>
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
    disabeld() {
      const { path } = this.$route;
      return /\/storage\/.+/.test(path);
    },
    totalSize() {
      let size = 0;
      this.files.forEach((it) => {
        size += it.size;
      });
      return this.$utils.getFileSize(size);
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
  },
};
</script>
