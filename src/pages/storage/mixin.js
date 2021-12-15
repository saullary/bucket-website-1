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
      if (this.inBucket) return this.bucketList;
      const tmp = this.path.split("/").length - 2;
      if (!this.isFile)
        return [
          {
            name: "test-folder" + tmp,
            size: "-",
            hash: "-",
          },
          {
            name: `test${tmp}.png`,
            size: "100k",
            hash: "asdf",
          },
        ];
      return [];
    },
  },
  watch: {
    // path(val) {
    //   console.log(val);
    // },
  },
};
