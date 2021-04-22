<template>
  <v-container fluid>
    
    <Users />

  </v-container>
</template>

<script>
// import { BASE_API_URL } from "../requests/base";
import Users from "../components/Users";

export default {
    name: 'Admin',
    components: {
      Users,
    },
    data: () => ({
        data: {},
    }),
    mounted() {

    },
    methods: {
    }
}
</script>

<style>

</style>