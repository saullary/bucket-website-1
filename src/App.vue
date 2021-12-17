<template>
  <v-app>
    <e-drawer />
    <v-main>
      <e-header />
      <e-wrap>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </e-wrap>
    </v-main>

    <e-alert></e-alert>
  </v-app>
</template>

<script>
export default {};
</script>
