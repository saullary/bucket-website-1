<template>
  <div>
    <storage-upload ref="upload"></storage-upload>

    <e-hcon>
      <template v-if="inBucket">
        <v-btn color="primary" @click="addBucket">
          <v-icon size="15">mdi-folder-multiple-plus</v-icon>
          <span class="ml-1">New Bucket</span>
        </v-btn>
      </template>
      <template v-else-if="isFile">
        <v-btn color="primary">
          <v-icon size="15">mdi-cloud-download</v-icon>
          <span class="ml-1">Download</span>
        </v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" @click="$refs.upload.showPop = true">
          <v-icon size="15">mdi-cloud-upload</v-icon>
          <span class="ml-1">Upload</span>
        </v-btn>
        <v-btn class="ml-5" outlined @click="addFolder">
          <v-icon size="15">mdi-folder-plus-outline</v-icon>
          <span class="ml-1">New Folder</span>
        </v-btn>
      </template>
    </e-hcon>

    <v-breadcrumbs :items="navItems" class="pl-0 mt-3"></v-breadcrumbs>

    <div v-if="isFile">
      <v-card outlined>
        <div class="pd-15-20">
          <span>File Info</span>
        </div>
        <div class="pd-20 bdt-1">
          <ul class="ls-none">
            <li>
              <span class="d-ib" style="min-width: 110px">Name:</span>
              <span class="gray">{{ fileName }}</span>
            </li>
            <li class="mt-2">
              <span class="d-ib" style="min-width: 110px">Size:</span>
              <span class="gray">100KB</span>
            </li>
          </ul>
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-data-table :headers="headers" :items="list" hide-default-footer>
        <template v-slot:item.name="{ item }">
          <v-btn
            :color="inBucket ? 'primary' : '#000'"
            rounded
            text
            small
            :to="path + (inBucket ? '' : '/') + item.name"
          >
            <v-icon v-if="!/\./.test(item.name)" size="18" class="mr-2"
              >mdi-{{ inBucket ? "folder-multiple" : "folder" }}</v-icon
            >
            <b>{{ item.name }}</b></v-btn
          >
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      popUpload: false,
      bucketList: [
        {
          name: "test-bucket1",
          domain: "test.com",
          createAt: "2021-12-13",
        },
        {
          name: "test-bucket2",
          domain: "test.com",
          createAt: "2021-12-13",
        },
      ],
    };
  },
  methods: {
    async addFolder() {
      try {
        const { value: name } = await this.$prompt("", "New Folder", {
          icon: "mdi-folder-plus",
          inputAttrs: {
            label: "Folder Name",
            // placeholder: "",
            counter: true,
            maxlength: 60,
            trim: true,
            rules: [(v) => !!v || "Invalid Name"],
            required: true,
          },
        });
        this.$toast(name);
      } catch (error) {
        console.log(error);
      }
    },
    async addBucket() {
      try {
        const { value: name } = await this.$prompt("", "New Bucket", {
          icon: "mdi-folder-multiple-plus",
          inputAttrs: {
            label: "Bucket Name",
            // placeholder: "",
            counter: true,
            maxlength: 60,
            trim: true,
            rules: [
              (v) => !!v || "Invalid Name",
              (v) =>
                /^[a-z\d-]+$/.test(v) ||
                "Only lowercase letters(a-z), numbers and dash(-) are allowed",
              (v) => !/^-/.test(v) || "To beigin with dash(-) is not allowed",
              (v) =>
                !/--/.test(v) || "Continuous use of dash(-) is not allowed",
              (v) => !/-$/.test(v) || "To end with dash(-) is not allowed",
            ],
            required: true,
          },
        });
        this.bucketList.push({
          name,
          domain: "-",
          createAt: new Date().format(),
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
