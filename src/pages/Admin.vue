<template>
  <v-container fluid>
    
    <Users />
    <Orgs />
    <Collections />
    <Items />
    <Entities />
    <Files />

  </v-container>
</template>

<script>
// import { BASE_API_URL } from "../requests/base";
import Orgs from "../components/Orgs";
import Collections from "../components/Collections";
import Items from "../components/Items";
import Users from "../components/Users";
import Files from "../components/Files";
import Entities from "../components/Entities";


export default {
    name: 'Admin',
    components: {
      Orgs,
      Collections,
      Users,
      Items,
      Files,
      Entities
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