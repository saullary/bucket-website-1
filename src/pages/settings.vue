<template>
  <div>
    <e-page-title desc="desc" class="mb-4">Settings</e-page-title>
    <e-settings :list="list" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          text: "Billing",
          comp: "st-billing",
        },
        {
          text: "Tokens",
          comp: "st-tokens",
        },
      ],
    };
  },
};
</script>