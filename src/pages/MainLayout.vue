<template>
  <div v-if="user">
    <v-app-bar
      app
      color="primary"
      dark
      flat
      dense
    >
      <v-app-bar-nav-icon @click="toggleNav"></v-app-bar-nav-icon>
      <v-toolbar-title>3deposit</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-col :cols=3>
        <v-text-field
          clearable
          dense
          hide-details
          append-outer-icon="mdi-magnify"
          single-line
          v-model="search"
        ></v-text-field>
      </v-col>
    </v-app-bar>

    <v-navigation-drawer 
      app
      :mini-variant="showNav"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ user.firstName + " " + user.lastName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.role }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item link @click="redirect('/')">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="redirect('/deposits')">
          <v-list-item-icon>
            <v-icon>mdi-file-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deposits</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="redirect('/create')">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Create</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="redirect('/metadata')">
          <v-list-item-icon>
            <v-icon>mdi-code-tags</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Metadata</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.role === `admin`" link @click="redirect('/admin')">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      <template v-slot:append>
        <v-list-item link @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

    </v-navigation-drawer>
    <router-view></router-view> 
  </div>
</template>

<script>

export default {
    name: 'MainLayout',

    data: () => ({
        user: {},
        showNav: true,
        search: ""
    }),
    mounted() {
      // this.$vuetify.theme.dark = true;

      this.user = JSON.parse(localStorage.getItem('user'));
      if (!this.user) {
        // if no user data, log off the user
        this.logout();
      }
    },
    methods: {
      toggleNav() {
        this.showNav = !this.showNav;
      },
      redirect(path) {
        this.$router.push(path).catch(err => {
          if (err.name != "NavigationDuplicated") {
            console.log(err);
          }
        });
      },
      logout() {
        // purge user data from localStorage
        localStorage.removeItem('user'); 
        setTimeout(() => {
          this.$router.push('/login');
        }, 500);
      }
    }
}
</script>

<style>

</style>