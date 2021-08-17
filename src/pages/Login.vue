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
            <v-card>
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>
                  <div class="body-1">Login to 3deposit</div>
                </v-toolbar-title>
              </v-toolbar>
                <v-alert 
                  v-if="error"
                  dense
                  type="error"
                  class="ma-4">
                  {{ message }}
                </v-alert>
              <v-card-text>
                <v-form 
                ref="form"
                v-model="valid"
                lazy-validation
                >
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
                    :rules="passwordRules"
                    v-model="password"
                    required
                    @keyup.enter="login"
                    @keypress="error = false"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                    block
                    x-large
                    color="primary" 
                    @click="login"
                    class="mb-2"
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
        passwordRules: [v => !!v || 'Password is required'],
        error: false,
        message: "",
        valid: false
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
          if (this.$refs.form.validate()) {
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
                    console.log('successful login.');
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
}
</script>

<style>

</style>