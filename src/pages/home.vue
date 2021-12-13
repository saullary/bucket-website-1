<template>
  <div>
    <e-hcon>
      <v-btn color="primary">
        <v-icon size="15">mdi-cloud-upload</v-icon>
        <span class="ml-1">Upload</span>
      </v-btn>
      <v-btn class="ml-5" outlined>
        <v-icon>mdi-folder-plus-outline</v-icon>
        <span class="ml-1">New Folder</span>
      </v-btn>
    </e-hcon>

    <v-breadcrumbs :items="navItems" class="pl-0 mt-3"></v-breadcrumbs>

    <div>
      <v-data-table
        :headers="headers"
        :items="list"
        hide-default-footer
      ></v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFile: false,
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    inBucket() {
      return this.path == "/storage/";
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
            name: "test-bucket",
            domain: "test.com",
            createAt: "2021-12-13",
          },
        ];
      if (!this.isFile)
        return [
          {
            name: "test-dir",
            size: "-",
            hash: "-",
          },
        ];
      return [];
    },
  },
  watch: {
    path(val) {
      // console.log(val);
      if (/\./.test(val)) this.isFile = true;
    },
  },
};
</script>