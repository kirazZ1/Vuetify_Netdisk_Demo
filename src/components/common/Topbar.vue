<template>
    <v-app-bar
        app
        color="light-blue darken-4"
        dark
    >
      <div class="d-flex align-center">
      <!--logo和产品名字-->
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="../../assets/logo2.png"
            transition="scale-transition"
            width="200"
        />


      </div>

      <v-spacer></v-spacer>


    </v-app-bar>
</template>

<script>
export default {
  name: "Topbar"
}
</script>

<style scoped>

</style>
