<template>
  <div v-if="!s3">
    <v-skeleton-loader
      class="mt-2"
      type="article"
      max-width="500"
    ></v-skeleton-loader>
  </div>
  <div v-else>
    <storage-upload
      ref="upload"
      :info="pathInfo"
      @uploaded="getList"
    ></storage-upload>

    <div class="d-flex">
      <div v-show="inBucket">
        <v-btn color="primary" @click="addBucket">
          <v-icon size="15">mdi-folder-multiple-plus</v-icon>
          <span class="ml-1">New Bucket</span>
        </v-btn>
      </div>
      <div v-show="inFile">
        <v-btn
          color="primary"
          :href="fileUrl"
          target="_blank"
          :loading="!fileInfo"
          :download="fileName"
        >
          <v-icon size="15">mdi-cloud-download</v-icon>
          <span class="ml-1">Download</span>
        </v-btn>
        <v-btn
          class="ml-5"
          outlined
          v-clipboard="fileUrl"
          @success="$toast('Copied to clipboard !')"
        >
          <v-icon size="15">mdi-content-copy</v-icon>
          <span class="ml-1">Copy Path</span>
        </v-btn>
      </div>
      <div v-show="inFolder">
        <v-btn color="primary" @click="$refs.upload.showPop = true">
          <v-icon size="15">mdi-cloud-upload</v-icon>
          <span class="ml-1">Upload</span>
        </v-btn>
        <v-btn class="ml-5" outlined @click="addFolder">
          <v-icon size="15">mdi-folder-plus-outline</v-icon>
          <span class="ml-1">New Folder</span>
        </v-btn>
      </div>

      <v-btn
        @click="onDelete"
        :loading="deleting"
        color="error"
        class="ml-5"
        v-show="!inFile && selected.length"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </div>

    <v-breadcrumbs :items="navItems" class="pl-0 mt-3"></v-breadcrumbs>

    <div v-if="inFile">
      <v-card outlined>
        <div class="pd-15-20">
          <span>File Info</span>
        </div>
        <div class="pd-15-20 bdt-1">
          <v-skeleton-loader
            v-if="fileLoading"
            type="article"
            max-width="500"
          ></v-skeleton-loader>
          <div v-else-if="!fileInfo">
            <span class="gray">Not Found</span>
          </div>
          <ul class="ls-none" v-else>
            <li
              class="mt-2 mb-2 fz-14 d-flex"
              v-for="(it, i) in fileInfoList"
              :key="i"
            >
              <span class="d-ib pa-1" style="min-width: 130px"
                >{{ it.label }}:</span
              >
              <div v-if="it.name == 'ipfs'">
                <v-btn
                  rounded
                  text
                  small
                  target="_blank"
                  :href="`https://${it.value}.ipfs.dweb.link`"
                >
                  {{ it.value }}
                </v-btn>
                <v-btn icon small v-clipboard="it.value" @success="onCopied">
                  <v-icon size="15" class="ml-auto">mdi-content-copy</v-icon>
                </v-btn>
              </div>
              <div v-else-if="it.name == 'url'">
                <p v-for="(link, j) in it.value" :key="j">
                  <v-btn
                    rounded
                    text
                    small
                    color="primary"
                    :href="link"
                    target="_blank"
                  >
                    {{ link }}
                  </v-btn>
                  <v-btn icon small v-clipboard="link" @success="onCopied">
                    <v-icon size="15" class="ml-auto">mdi-content-copy</v-icon>
                  </v-btn>
                </p>
              </div>
              <span v-else class="gray pa-1 ml-2">{{ it.value }}</span>
            </li>
          </ul>
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-data-table
        :headers="headers"
        :items="list"
        :loading="tableLoading"
        v-model="selected"
        :show-select="list.length > 0"
        item-key="name"
        hide-default-footer
      >
        <!-- <template v-slot:item.data-table-select="row">
          <v-checkbox v-model="row.isSelected" @input="row.select"></v-checkbox>
        </template> -->
        <template v-slot:item.name="{ item }">
          <v-btn
            :color="inBucket ? 'primary' : '#000'"
            rounded
            text
            small
            :to="path + item.name + (item.isFile ? '' : '/')"
          >
            <v-icon v-if="!item.isFile" size="18" class="mr-2"
              >mdi-{{ inBucket ? "folder-multiple" : "folder" }}</v-icon
            >
            <b>{{ item.name.cutStr(10, 10) }}</b></v-btn
          >
        </template>
        <template v-slot:item.domain="{ item }">
          <div v-if="item.domainInfo">
            <span>{{ item.domainInfo.domain }}</span>

            <e-menu
              :open-on-hover="!asMobile"
              offset-y
              @input="onDomain(item.name, $event)"
            >
              <v-btn
                slot="ref"
                color="primary"
                text
                small
                :to="asMobile ? null : `/domain?bucket=${item.name}`"
              >
                <v-icon size="14">mdi-plus</v-icon>
                <span v-if="item.domainInfo.count > 1">
                  {{ item.domainInfo.count - 1 }}
                </span>
              </v-btn>
              <v-list dense>
                <v-list-item
                  link
                  :to="row.to"
                  v-for="(row, j) in item.domains"
                  :key="j"
                >
                  <v-list-item-title>
                    <v-icon v-if="row.icon" class="mr-1" size="16">{{
                      row.icon
                    }}</v-icon>
                    <span :class="row.valid ? 'color-suc' : ''">{{
                      row.name
                    }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </e-menu>
          </div>
        </template>
        <template v-slot:item.hash="{ item }">
          <v-btn
            rounded
            small
            text
            target="_blank"
            v-if="item.hash"
            :href="`https://${item.hash}.ipfs.dweb.link`"
          >
            {{ item.hash.cutStr(10, 10) }}
          </v-btn>
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
      fileLoading: false,
      fileInfo: null,
      domainsMap: {},
    };
  },
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
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
    fileInfoList() {
      const info = this.fileInfo;
      if (!info) return [];
      return [
        {
          label: "Name",
          value: this.fileName,
        },
        {
          label: "Size",
          value: this.$utils.getFileSize(info.size),
        },
        {
          label: "Last Modified",
          value: info.updateAt.format(),
        },
        {
          label: "IPFS Hash",
          name: "ipfs",
          value: info.hash,
        },
        {
          label: "Object URL",
          name: "url",
          value: this.fileUrls,
        },
      ];
    },
    fileUrls() {
      if (!this.fileInfo || !this.inFile) return [];
      const { Bucket } = this.pathInfo;
      let list = (this.domainsMap[Bucket] || [])
        .filter((it) => it.valid)
        .map((it) => it.name);
      const item = this.domainList.filter((it) => it.bucketName == Bucket)[0];
      if (item) list.push(item.domain);
      const { Key } = this.pathInfo;
      list = list.map((domain) => {
        return (this.$inDev ? "http:" : "https:") + "//" + domain + "/" + Key;
      });
      if (!list.length) list.push(this.fileInfo.url);
      return list;
    },
    fileUrl() {
      return this.fileUrls[0] || "";
    },
  },
  watch: {
    path() {
      if (!this.inStorage) return;
      this.selected = [];
      this.folderList = [];
      this.getList();
      this.checkNew();
    },
    s3() {
      this.getList();
    },
    async bucketList(val) {
      if (!val.length) return;
      const { data } = await this.$http.get("/domains/stat");
      console.log(data);
      this.domainList = data.stats;
      localStorage.domainList = JSON.stringify(this.domainList);
    },
  },
  mounted() {
    this.getList();
    this.checkNew();
  },
  methods: {
    onCopied() {
      this.$toast("Copied to clipboard !");
    },
    async onDomain(bucketName, isOpen) {
      if (!isOpen || this.loadingDomains) return;
      try {
        this.loadingDomains = true;
        const { data } = await this.$http.get("/domains", {
          params: { bucketName },
        });
        this.$set(
          this.domainsMap,
          bucketName,
          data.list.map((it) => {
            return {
              name: it.domain,
              valid: it.valid,
              to: "/domain/" + it.domain,
            };
          })
        );
      } catch (error) {
        //
      }
      this.loadingDomains = false;
    },
    async addFolder() {
      try {
        const { value: name } = await this.$prompt("", "New Folder", {
          icon: "mdi-folder-plus",
          hideIcon: true,
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
        // this.$router.push(this.path + name + "/");
        const { Prefix } = this.pathInfo;
        this.tableLoading = true;
        await this.putObject(Prefix + name + "/");
        this.$toast(`${name} created successfully`);
        await this.getList();
      } catch (error) {
        console.log(error);
        if (error) this.$alert(error.message);
      }
      this.tableLoading = false;
    },
    async putObject(Key) {
      const { Bucket } = this.pathInfo;
      return new Promise((resolve, reject) => {
        this.s3.putObject(
          {
            Bucket,
            Key,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
    },
    async addBucket() {
      try {
        const { value: Bucket } = await this.$prompt("", "New Bucket", {
          icon: "mdi-folder-multiple-plus",
          hideIcon: true,
          inputAttrs: {
            label: "Bucket Name",
            // placeholder: "",
            counter: true,
            maxlength: 48,
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
        this.$loading();
        this.s3.createBucket(
          {
            Bucket,
          },
          async (err) => {
            if (err) return this.onErr(err);
            await this.$sleep(500);
            this.$loading.close();
            this.getBuckets();
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
