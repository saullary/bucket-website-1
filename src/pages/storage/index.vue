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

    <e-hcon>
      <template v-if="inBucket">
        <v-btn color="primary" @click="addBucket">
          <v-icon size="15">mdi-folder-multiple-plus</v-icon>
          <span class="ml-1">New Bucket</span>
        </v-btn>
      </template>
      <template v-else-if="inFile">
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
      <v-btn
        @click="onDelete"
        :loading="deleting"
        color="error"
        class="ml-5"
        v-show="!inFile && selected.length"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </e-hcon>

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
          ></v-skeleton-loader>
          <div v-else-if="!fileInfo">
            <span class="gray">Not Found</span>
          </div>
          <ul class="ls-none" v-else>
            <li class="mt-3" v-for="(it, i) in fileInfoList" :key="i">
              <span class="d-ib" style="min-width: 130px">{{ it.label }}:</span>
              <span class="gray">{{ it.value }}</span>
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
            <b>{{ item.name }}</b></v-btn
          >
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
            {{ item.hash }}
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
    };
  },
  computed: {
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
          value: info.hash,
        },
      ];
    },
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
        this.$router.push(this.path + "/" + name);
      } catch (error) {
        console.log(error);
      }
    },
    async addBucket() {
      try {
        const { value: Bucket } = await this.$prompt("", "New Bucket", {
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
        this.$loading();
        this.s3.createBucket(
          {
            Bucket,
          },
          (err) => {
            if (err) return this.onErr(err);
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
