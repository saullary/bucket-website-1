import { mapState } from "vuex";

export default {
  data() {
    return {
      // isFile: false,
      tableLoading: false,
      bucketList: [],
      folderList: [],
      selected: [],
      deleting: false,
    };
  },
  computed: {
    ...mapState({
      s3: (s) => s.s3,
    }),
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
      if (!this.isFile) return this.folderList;
      return [];
    },
    pathInfo() {
      if (this.inBucket) return {};
      const arr = this.path.split("/").slice(2);
      let Prefix = arr.slice(1).join("/");
      if (Prefix) Prefix += "/";
      return {
        Bucket: arr[0],
        Prefix,
        Delimiter: "/",
      };
    },
  },
  watch: {
    path() {
      this.selected = [];
      this.getList();
    },
    s3() {
      this.getList();
    },
  },
  methods: {
    onErr(err) {
      this.$alert(err.message);
    },
    getList() {
      if (this.inBucket) {
        this.getBuckets();
      } else {
        this.getObjects();
      }
    },
    getObjects() {
      this.folderList = [];
      this.tableLoading = true;
      const { Prefix } = this.pathInfo;
      this.s3.listObjectsV2(this.pathInfo, (err, data) => {
        this.tableLoading = false;
        if (err) return this.onErr(err);
        this.folderList = [
          ...data.CommonPrefixes.map((it) => {
            return {
              name: it.Prefix.replace(Prefix, "").replace("/", ""),
            };
          }),
          ...data.Contents.map((it) => {
            return {
              name: it.Key.replace(Prefix, ""),
              updateAt: it.LastModified.format(),
              size: this.$utils.getFileSize(it.Size),
              isFile: true,
            };
          }),
        ];
      });
    },
    getBuckets() {
      this.tableLoading = true;
      this.s3.listBuckets({}, (err, data) => {
        this.tableLoading = false;
        if (err) return this.onErr(err);
        this.bucketList = data.Buckets.map((it) => {
          return {
            name: it.Name,
            createAt: it.CreationDate.format(),
          };
        });
      });
    },
    delBucket(Bucket) {
      return new Promise((resolve, reject) => {
        this.s3.deleteBucket(
          {
            Bucket,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    },
    async onDelete() {
      try {
        const suffix = this.selected.length > 1 ? "s" : "";
        const target = this.inBucket ? "Bucket" : "Folder(or File)";
        let html = `The following ${target}${suffix} will be permanently deleted. Are you sure you want to continue?<ul class='mt-4'>`;
        for (const row of this.selected) {
          html += "<li>" + row.name + "</li>";
        }
        html += "</ul>";
        await this.$confirm(html, `Remove ${target}${suffix}`);
        this.deleting = true;
        for (const row of this.selected) {
          await this.delBucket(row.name);
        }
      } catch (err) {
        if (err) this.onErr(err);
      }
      this.selected = [];
      this.deleting = false;
      this.getList();
    },
  },
};
