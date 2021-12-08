<template>
  <div>
    <div>
      <v-btn color="primary">
        <v-icon size="15">mdi-cloud-upload</v-icon>
        <span class="ml-1">Upload</span>
      </v-btn>
      <v-btn class="ml-5" outlined>
        <v-icon>mdi-folder-plus-outline</v-icon>
        <span class="ml-1">New Folder</span>
      </v-btn>
    </div>

    <div class="mt-5">
      <v-data-table :headers="headers" :items="list"></v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Size", value: "size" },
        { text: "IPFS Hash", value: "hash" },
        { text: "Last Modified", value: "updateAt" },
      ],
      list: [],
    };
  },
};
</script>