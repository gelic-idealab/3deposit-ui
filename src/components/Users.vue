<template>
    <v-container fluid>
        Users      
        <v-data-table
        :headers="headers"
        :items="data"
        :sort-by="['id']"
        >
        <!-- <template v-slot:item.upload_at="{ item }">
           <span>{{ new Date(item.upload_at*1000).toLocaleString() }}</span>
         </template> -->
        <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-spacer></v-spacer>
                <v-dialog
                v-model="dialog"
                max-width="500px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >
                    Add User
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                    <v-container>
                        <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                        >
                            <v-row>
                            <v-col cols="12">
                                <v-text-field
                                v-model="editedItem.email"
                                label="Email"
                                required
                                :rules="rules"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                v-model="editedItem.password"
                                label="Set Password"
                                type="password"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                v-model="editedItem.passwordConfirm"
                                label="Confirm Password"
                                type="password"
                                :rules="passwordRules"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                v-model="editedItem.firstName"
                                label="First Name"
                                required
                                :rules="rules"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                v-model="editedItem.lastName"
                                label="Last Name"
                                required
                                :rules="rules"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select
                                v-model="editedItem.role"
                                label="Role"
                                :items="roles"
                                required
                                :rules="rules"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-select
                                v-model="editedItem.org"
                                label="Organization"
                                :items="orgs"
                                item-text="name"
                                item-value="id"
                                required
                                :rules="rules"
                                ></v-select>
                            </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                    >
                        Save
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";
import sha1 from "sha1";

export default {
    name: 'Users',

    data: function() {
        return {
            data: [],
            headers: [
                { text: "ID", value: "id" },
                { text: "Email", value: "email" },
                { text: "First", value: "firstName"},
                { text: "Last", value: "lastName" },
                { text: "Role", value: "role" },
                { text: "Last Login", value: "lastLogin" },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            dialog: false,
            valid: true,
            passwordRules: [
                v => (v === this.editedItem.password) || 'Password does not match.',
            ],
            rules: [
                v => !!v || 'Value is required',
            ],
            defaultItem: {},
            editedItem: {
                email: "",
                password: "",
                passwordConfirm: "",
                firstName: "",
                lastName: "",
                role: "",
                org: ""
            },
            editedIndex: -1,
            roles: ["admin", "manager", "user"],
            user: {},
            orgs: []
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getUsers();
        this.getOrgs();
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New User' : 'Edit User'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
        getUsers() {
            fetch(BASE_API_URL+'/users', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'X-API-KEY': this.user.token
                }
            })
            .then(async response => {
                let res = await response.text();
                if (response.status === 200) {
                    this.data = JSON.parse(res);
                } else if (response.status === 401) {
                    localStorage.removeItem('user');
                    this.$router.push('/login');
                } else {
                    console.log(res);
                }
            });
        },
        getOrgs() {
            fetch(BASE_API_URL+'/orgs', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'X-API-KEY': this.user.token
                }
            })
            .then(async response => {
                let res = await response.text();
                if (response.status === 200) {
                    this.orgs = JSON.parse(res);
                } else if (response.status === 401) {
                    localStorage.removeItem('user');
                    this.$router.push('/login');
                } else {
                    console.log(res);
                }
            });
        },
        save() {
            if (this.$refs.form.validate()) {
                let form = new FormData();
                for (const [key, value] of Object.entries(this.editedItem)) {
                    if (key == "password") {
                        form.append(key, sha1(value));
                    } else {
                        form.append(key, value);
                    }
                }

                fetch(BASE_API_URL+'/users', {
                    method: 'POST',
                    mode: 'cors',
                    body: form,
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    if (response.status == 200) {
                        this.close();
                    }                
                    let res = await response.text();
                    console.log(res);
                    this.getUsers();
                });
            } 
        },
        editItem(item) {
            this.editedIndex = this.data.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            if (confirm('Are you sure you want to delete this user?')) {
                fetch(BASE_API_URL+'/users?id='+item.id, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    let res = await response.text();
                    console.log(res);
                    this.getUsers();
                });
            }
        },
        close () {
            this.dialog = false;
            this.$refs.form.resetValidation();
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            });
        },
    }
}
</script>

<style>

</style>