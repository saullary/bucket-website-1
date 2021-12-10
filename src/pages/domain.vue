<template>
  <div>
    <e-page-title desc="Use the API key for Storage SDK">Domains</e-page-title>
    <div class="mt-5 d-flex" style="max-width: 500px">
      <v-text-field
        outlined
        dense
        v-model.trim="domain"
        @keyup.enter="onAdd"
        placeholder="mywebsite.com"
      >
      </v-text-field>

      <v-btn color="primary" class="ml-4"> Add </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domain: "",
    };
  },
  methods: {
    onAdd() {},
  },
};
</script>