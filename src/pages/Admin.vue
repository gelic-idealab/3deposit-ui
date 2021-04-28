<template>
  <v-container fluid>
    
    <Orgs />
    <Collections />
    <Users />

  </v-container>
</template>

<script>
// import { BASE_API_URL } from "../requests/base";
import Orgs from "../components/Orgs";
import Collections from "../components/Collections";
import Users from "../components/Users";


export default {
    name: 'Admin',
    components: {
      Orgs,
      Collections,
      Users
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