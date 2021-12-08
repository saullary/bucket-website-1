<template>
  <v-app>
    <e-drawer />
    <v-main>
      <e-header />
      <e-wrap>
        <router-view></router-view>
      </e-wrap>
    </v-main>

    <e-alert></e-alert>
  </v-app>
</template>

<script>
export default {};
</script>
