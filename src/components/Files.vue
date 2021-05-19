<template>
    <v-container fluid>
        Files      
        <v-data-table
        :headers="headers"
        :items="data"
        :sort-by="['id']"
        >
        <template v-slot:item.item="{ item }">
           <span>{{ item.item.name || `None` }}</span>
         </template>
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
                    Add File
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
                            <v-col>
                                <v-file-input
                                show-size
                                :loading="uploading" 
                                v-model="file" 
                                label="Add file(s)"
                                @change="useFileName"
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                v-model="editedItem.name"
                                label="Name"
                                required
                                :rules="rules"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                v-model="editedItem.desc"
                                label="Description"
                                required
                                :rules="rules"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-select
                                v-model="editedItem.item"
                                label="Item"
                                item-text="name"
                                item-value="id"
                                :items="items"
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

export default {
    name: 'Files',

    data: function() {
        return {
            data: [],
            headers: [
                { text: "ID", value: "id" },
                { text: "Name", value: "name" },
                { text: "Description", value: "desc"},
                { text: "Item", value: "item" },
                { text: "Filename", value: "filename"},
                { text: "MD5", value: "md5"},
                { text: "Size", value: "size"},
                { text: "Type", value: "ext"},
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            dialog: false,
            valid: true,
            rules: [
                v => !!v || 'Value is required',
            ],
            defaultItem: {},
            editedItem: {
                name: "",
                desc: "",
                item: ""
            },
            editedIndex: -1,
            uploading: false,
            file: {},
            items: [],
            user: {},
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getFiles();
        this.getItems();
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New File' : 'Edit File'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
        useFileName(){
            this.editedItem.name = this.file.name;
        },
        getFiles() {
            fetch(BASE_API_URL+'/files', {
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
        getItems() {
            fetch(BASE_API_URL+'/items', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'X-API-KEY': this.user.token
                }
            })
            .then(async response => {
                let res = await response.text();
                if (response.status === 200) {
                    this.items = JSON.parse(res);
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
                this.uploading = true;
                let form = new FormData();
                for (const [key, value] of Object.entries(this.editedItem)) {
                    form.append(key, value);
                }
                form.append('file', this.file);

                fetch(BASE_API_URL+'/files', {
                    method: 'POST',
                    mode: 'cors',
                    body: form,
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    this.uploading = false;
                    if (response.status == 200) {
                        this.file = {};
                        this.close();
                    }                
                    let res = await response.text();
                    console.log(res);
                    this.getFiles();
                });
            } 
        },
        editItem(item) {
            this.editedIndex = this.data.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            if (confirm('Are you sure you want to delete this file?')) {
                fetch(BASE_API_URL+'/files?id='+item.id, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    let res = await response.text();
                    console.log(res);
                    this.getFiles();
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