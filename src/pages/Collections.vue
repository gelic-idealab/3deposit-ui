<template>
  <v-container fluid>
    
    <Orgs />
    <Users />

  </v-container>
</template>

<script>
// import { BASE_API_URL } from "../requests/base";
import Orgs from "../components/Orgs";
import Users from "../components/Users";


export default {
    name: 'Admin',
    components: {
      Orgs,
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