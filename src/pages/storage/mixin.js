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
      this.folderList = [];
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
      this.tableLoading = true;
      const { Prefix } = this.pathInfo;
      const filterFn = (it) => {
        return (it.Prefix || it.Key).indexOf(this.pathInfo.Prefix) == 0;
      };
      this.s3.listObjectsV2(this.pathInfo, (err, data) => {
        this.tableLoading = false;
        if (err) return this.onErr(err);
        // console.log(data, Prefix);
        this.folderList = [
          ...(data.CommonPrefixes || []).filter(filterFn).map((it) => {
            return {
              name: it.Prefix.replace(Prefix, "").replace("/", ""),
            };
          }),
          ...(data.Contents || []).filter(filterFn).map((it) => {
            return {
              Key: it.Key,
              name: it.Key.replace(Prefix, ""),
              updateAt: it.LastModified.format(),
              size: this.$utils.getFileSize(it.Size),
              hash: it.ETag.replace(/"/g, ""),
              isFile: true,
              isSelectable: true,
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
            isSelectable: true,
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
    delObjects(Objects) {
      const { Bucket } = this.pathInfo;
      const params = {
        Bucket,
        Delete: {
          Objects,
          Quiet: false,
        },
      };
      return new Promise((resolve, reject) => {
        this.s3.deleteObjects(params, (err, data) => {
          console.log(err, data);
          if (err) reject(err);
          else resolve(data);
        });
      });
    },
    async onDelete() {
      try {
        const arr = await this.getSelectedObjects();
        const suffix = arr.length > 1 ? "s" : "";
        const target = this.inBucket ? "Bucket" : "File";
        let html = `The following ${target}${suffix} will be permanently deleted. Are you sure you want to continue?<ul class='mt-4'>`;
        for (const row of arr) {
          html += "<li>" + row.name + "</li>";
        }
        html += "</ul>";
        await this.$confirm(html, `Remove ${target}${suffix}`);
        this.deleting = true;
        if (this.inBucket) {
          for (const row of arr) {
            await this.delBucket(row.name);
          }
        } else {
          await this.delObjects(
            arr.map((it) => {
              return { Key: it.Key };
            })
          );
        }
      } catch (err) {
        if (err) this.onErr(err);
      }
      this.selected = [];
      this.deleting = false;
      this.getList();
    },
    async getSelectedObjects() {
      if (this.inBucket) return this.selected;
      let arr = [];
      const { Prefix } = this.pathInfo;
      for (const it of this.selected) {
        if (it.isFile) arr.push(it);
        else {
          const objArr = await this.getSubObjects(it.name);
          arr = arr.concat(
            objArr.map((sub) => {
              return {
                Key: sub.Key,
                name: sub.Key.replace(Prefix, ""),
              };
            })
          );
        }
      }
      return arr;
    },
    async getSubObjects(folder) {
      const { Bucket, Prefix } = this.pathInfo;
      const params = {
        Bucket,
        Prefix: Prefix + folder + "/",
      };
      return new Promise((resolve, reject) => {
        this.$loading();
        this.s3.listObjectsV2(params, (err, data) => {
          this.$loading.close();
          if (err) reject(err);
          else resolve(data.Contents || []);
        });
      });
    },
  },
};
