<template>
  <div>
    <e-hcon>
      <template v-if="inBucket">
        <v-btn color="primary">
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
        <v-btn color="primary">
          <v-icon size="15">mdi-cloud-upload</v-icon>
          <span class="ml-1">Upload</span>
        </v-btn>
        <v-btn class="ml-5" outlined>
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
export default {
  data() {
    return {
      // isFile: false,
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    inBucket() {
      return this.path == "/storage/";
    },
    isFile() {
      return /\./.test(this.path);
    },
    isFolder() {
      return !this.inBucket && !this.isFile;
    },
    fileName() {
      const arr = this.path.split("/");
      return arr[arr.length - 1];
    },
    navItems() {
      let to = "/storage/";
      const items = [
        {
          text: "Storage",
          to,
          exact: true,
        },
      ];
      const arr = this.path.replace(to, "").split("/");
      for (const text of arr) {
        to += text;
        items.push({
          text,
          to,
          exact: true,
        });
        to += "/";
      }
      return items;
    },
    headers() {
      if (this.inBucket)
        return [
          { text: "Bucket Name", value: "name" },
          { text: "Domain", value: "domain" },
          { text: "CreateAt", value: "createAt" },
        ];
      return [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "IPFS Hash", value: "hash" },
        { text: "Last Modified", value: "updateAt" },
      ];
    },
    list() {
      if (this.inBucket)
        return [
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
        ];
      if (!this.isFile)
        return [
          {
            name: "test-folder" + (this.path.split("/").length - 2),
            size: "-",
            hash: "-",
          },
          {
            name: "test.png" + (this.path.split("/").length - 2),
            size: "100k",
            hash: "asdf",
          },
        ];
      return [];
    },
  },
  watch: {
    path(val) {
      console.log(val);
      // this.isFile = /\./.test(val);
    },
  },
};
</script>