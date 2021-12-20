<style lang="scss">
.e-upload {
  margin: 20px 0 30px;
  .add-img {
    padding: 40px 0;
    border: 3px dashed #ddd;
  }
}
</style>

<template>
  <div>
    <div class="e-upload">
      <div style="min-height: 150px" v-show="files.length > 0">
        <v-data-table
          class="elevation-1"
          :headers="headers"
          :items="list"
          hide-default-footer
        >
          <template v-slot:item.action="{ item }">
            <v-btn icon @click="onDel(item.index)">
              <v-icon size="18">mdi-trash-can-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>

      <div class="add-img pos-r bdrs-10" v-ripple v-show="files.length == 0">
        <div class="ta-c">
          <p>
            <v-icon size="60" color="#bbb">mdi-cloud-upload-outline</v-icon>
          </p>
        </div>
        <input
          ref="file"
          multiple
          type="file"
          :accept="accept"
          class="pos-mask op-0 z--1"
          @input="onInput"
        />
      </div>
      <p class="ta-c mt-5">
        <v-btn text @click="onClick">
          <span class="gray">
            Drag, Paste or <span class="color-1">click to upload files</span>
          </span>
        </v-btn>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: "*", //image/*
    },
    limit: {
      type: Number,
      default: 5,
    },
    value: Array,
  },
  data() {
    return {
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
    list() {
      const mb = Math.pow(1024, 2);
      return this.files.map((it, index) => {
        let size = it.size + " B";
        if (it.size > mb) size = (it.size / mb).toFixed(2) + " MB";
        else if (it.size > 1024) size = (it.size / 1024).toFixed(2) + " KB";
        return {
          name: it.name,
          size,
          index,
        };
      });
    },
  },
  watch: {
    value(val) {
      if (!val || val.length == 0) {
        this.files = [];
      }
    },
  },
  mounted() {
    document.ondragover = (ev) => ev.preventDefault();
    document.ondrop = (ev) => {
      ev.preventDefault();
      this.getFiles(ev.dataTransfer);
    };
    document.onpaste = (ev) => {
      this.getFiles(ev.clipboardData);
    };
  },
  methods: {
    onInput(e) {
      this.getFiles(e.target);
      this.$refs.file.value = null;
    },
    onClick() {
      this.$refs.file.click();
    },
    getFiles(data) {
      if (!data) return;
      const { files = [] } = data;
      for (const file of files) {
        console.log(file);
        if (this.limit && this.files.length >= this.limit) break;
        // if (!/image/.test(file.type)) continue;
        // if (!file.type) continue;
        if (file.size > Math.pow(1024, 2) * 30) {
          this.$toast(`${file.name} is too larg (over 30MB)`);
          continue;
        }
        const isRepeat =
          this.files.filter((it) => {
            return (
              it.name == file.name &&
              it.size == file.size &&
              it.lastModified == file.lastModified
            );
          }).length > 0;
        if (isRepeat) continue;
        this.files.push(file);
      }
      if (this.files.length) {
        this.$setState({
          noticeMsg: {
            name: "file-upload",
          },
        });
      }
      this.emitInput();
    },
    emitInput() {
      this.$emit("input", this.files);
    },
    onDel(i) {
      this.files.splice(i, 1);
      this.emitInput();
    },
  },
};
</script>