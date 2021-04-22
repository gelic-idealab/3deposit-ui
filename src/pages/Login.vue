<template>
  <div>
    <v-container class="fill-height">
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>3deposit - Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :href="source"
                      icon
                      large
                      target="_blank"
                      v-on="on"
                    >
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip> -->
              </v-toolbar>
                <v-alert 
                  v-if="error"
                  dense
                  type="error">
                  {{ message }}
                </v-alert>
              <v-card-text>
                <v-form>
                  <v-text-field
                    name="email"
                    prepend-icon="mdi-email"
                    type="text"
                    v-model="email"
                    :rules="emailRules"
                    label="email"
                    required
                    @keyup.enter="login"
                    @keypress="error = false"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    required
                    @keyup.enter="login"
                    @keypress="error = false"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    block 
                    color="primary" 
                    @click="login"
                >Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import { BASE_API_URL } from "../requests/base";
import sha1 from "sha1";

export default {
    name: 'Login',

    data: () => ({
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        password: '',
        error: false,
        message: ""
    }),
    mounted() {
      // check if user is already logged in
      let user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.$router.push('/');
      }

    },
    methods: {
        login() {
            this.error = false;
            let form = new FormData();
            form.append('email', this.email);
            form.append('password', sha1(this.password));
            fetch(BASE_API_URL+'/login', {
                body: form,
                method: 'POST',
                mode: 'cors',
            })
            .then(async response => {
                if (response.status == 200) {
                    let res = await response.text();
                    console.log('successful login', res);
                    localStorage.setItem('user', res);
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 500);
                } else {
                    this.error = true;
                    this.message = await response.text();
                }
            });
        }
    }
}
</script>

<style>

</style>