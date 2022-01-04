<template>
  <div v-if="!s3">
    <v-skeleton-loader
      class="mt-2"
      type="article"
      max-width="500"
    ></v-skeleton-loader>
  </div>
  <div v-else>
    <!-- <e-page-title desc="">Domain</e-page-title> -->
    <div>
      <v-btn color="primary" @click="showPop = true">
        <v-icon size="16">mdi-plus-circle-outline</v-icon>
        <span class="ml-1">Add Domain</span>
      </v-btn>
      <v-btn
        @click="onDelete"
        :loading="deleting"
        color="error"
        class="ml-5"
        v-show="selected.length"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </div>
    <div class="mt-4">
      <v-data-table
        :headers="headers"
        :items="list"
        :loading="loading"
        v-model="selected"
        :show-select="list.length > 0"
        item-key="domain"
        hide-default-footer
      >
        <template v-slot:item.domain="{ item }">
          <v-btn :color="item.valid ? 'success' : 'error'" rounded text small>
            <b>{{ item.domain }}</b></v-btn
          >
        </template>
        <template v-slot:item.bucketName="{ item }">
          <v-btn
            color="primary"
            rounded
            text
            small
            :to="`/storage/${item.bucketName}/`"
          >
            <v-icon size="18" class="mr-2">mdi-folder-multiple</v-icon>
            <b>{{ item.bucketName }}</b></v-btn
          >
        </template>
      </v-data-table>
    </div>

    <v-dialog v-model="showPop" max-width="520">
      <div class="pd-30">
        <h3>Add Domain</h3>
        <v-window v-model="curStep">
          <v-window-item :value="0">
            <div class="gray mt-2 fz-14">
              Select a bucket to add your domain to
            </div>
            <div class="bd-1 mt-6">
              <div v-if="!bucketList">
                <v-skeleton-loader type="article" />
              </div>
              <template v-else>
                <div class="d-flex al-c bdb-1">
                  <v-icon class="ml-4">mdi-magnify</v-icon>
                  <input
                    type="text"
                    v-model="keyword"
                    placeholder="Search For Bucket"
                    class="flex-1 pd-10"
                    style="height: 54px; outline: none"
                  />
                </div>
                <div class="ov-a" style="max-height: 40vh">
                  <div
                    class="d-flex al-c pd-15"
                    :class="{
                      'bdt-1': i > 0,
                    }"
                    v-for="(it, i) in bucketList"
                    :key="i"
                  >
                    <v-icon>mdi-folder-outline</v-icon>
                    <span class="ml-2">{{ it.name }}</span>
                    <v-btn
                      small
                      color="primary"
                      class="ml-auto"
                      @click="onSelect(it)"
                      >Select</v-btn
                    >
                  </div>
                </div>
                <div class="d-flex al-c bdt-1 pa-3">
                  <v-btn text small color="primary" to="/storage/?new=bucket">
                    <v-icon size="16">mdi-folder-multiple-plus</v-icon>
                    <span class="ml-1">Create a new bucket</span>
                  </v-btn>
                </div>
              </template>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <div class="mt-5">
              <p><b>Bucket</b>：{{ chooseBucket.name }}</p>
              <p class="gray fz-14">
                Enter the domain that you would like to add:
              </p>
            </div>
            <div class="mt-5">
              <v-text-field
                dense
                outlined
                autofocus
                v-model.trim="domain"
                placeholder="mywebsite.com"
                @keyup.enter="onAdd"
              />
            </div>
          </v-window-item>
        </v-window>

        <div class="ta-c mt-8">
          <v-btn @click="showPop = false" small>Cancel</v-btn>
          <v-btn
            small
            color="primary"
            class="ml-6"
            v-if="curStep > 0"
            :loading="adding"
            @click="onAdd"
          >
            Add
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      s3: (s) => s.s3,
    }),
  },
  data() {
    return {
      headers: [
        { text: "Domain", value: "domain" },
        { text: "Bucket", value: "bucketName" },
        { text: "Nameserver", value: "nameServers" },
        { text: "CreateAt", value: "createAt" },
      ],
      list: [],
      selected: [],
      loading: false,
      showPop: false,
      curStep: 0,
      chooseBucket: {},
      bucketList: null,
      adding: false,
      domain: "",
      deleting: false,
      keyword: "",
    };
  },
  watch: {
    showPop(val) {
      if (val) {
        this.curStep = 0;
        this.getBuckets();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onDelete() {
      try {
        const suffix = this.selected.length > 1 ? "s" : "";
        let html = `The following domain${suffix} will be permanently deleted along with associated <b>aliases</b> and <b>certs</b>. 
          <br>Are you sure you want to continue?`;
        html += '<ul class="mt-5">';
        for (const it of this.selected) {
          html += `<li class="mt-2">${it.domain}</li>`;
        }
        html += "</ul>";
        await this.$confirm(html, `Delete Domain${suffix}`);
        const ids = this.selected.map((it) => it.domain).join(",");
        this.deleting = true;
        await this.$http.delete("/domains/" + ids);
        this.$toast(
          this.selected.length + ` domain${suffix} deleted successfully`
        );
        await this.getList();
        this.selected = [];
      } catch (error) {
        //
      }
      this.deleting = false;
    },
    getBuckets() {
      this.s3.listBuckets({}, (err, data) => {
        if (err) return this.onErr(err);
        this.bucketList = data.Buckets.map((it) => {
          return {
            name: it.Name,
            createAt: it.CreationDate.format(),
          };
        });
      });
    },
    onSelect(it) {
      this.chooseBucket = it;
      this.curStep = 1;
    },
    async onAdd() {
      try {
        if (!this.$regMap.domain.test(this.domain)) {
          return this.$alert(
            `The specified value “${this.domain}” is not a fully qualified domain name.`
          );
        }
        this.adding = true;
        await this.$http.post("/domains", {
          domain: this.domain,
          bucketName: this.chooseBucket.name,
        });
        this.domain = "";
        this.$toast("Added successfully");
        this.showPop = false;
        this.getList();
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get("/domains");
        this.list = data.list.map((it) => {
          it.createAt = new Date(it.createdAt * 1e3).format();
          return it;
        });
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
};
</script>