<template>
    <v-container fluid>
        <v-list dense>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Name</v-list-item-title>
                    <v-list-item-subtitle>{{ deposit.name }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Description</v-list-item-title>
                    <v-list-item-subtitle>{{ deposit.desc }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>ID</v-list-item-title>
                    <v-list-item-subtitle>{{ deposit.id }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="deposit.creator">
                <v-list-item-content>
                    <v-list-item-title>Creator</v-list-item-title>
                    <v-list-item-subtitle>{{ deposit.creator.email }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Updated</v-list-item-title>
                    <v-list-item-subtitle>{{ deposit.updated }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Size</v-list-item-title>
                    <v-list-item-subtitle>{{ deposit.size }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>


        <v-data-table
        :dense="true"
        :headers="headers"
        :items="deposit.metadata"
        :sort-by="['label']"
        >
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
                        Add Metadata
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
                                {{ editedItem.label }}
                                <v-col cols="12" v-if="editedIndex == -1">
                                    <v-select
                                    v-model="addMetadataField"
                                    label="Label"
                                    :items="dmfields"
                                    required
                                    :rules="rules"
                                    @change="setEditedItem"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                    v-model="editedItem.value.value"
                                    required
                                    :rules="rules"
                                    :hint="editedItem.note || `Value`"
                                    persistent-hint
                                    ></v-text-field>
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
            <template v-slot:item.required="{ item }">
                <v-icon>
                    {{ getRequiredIcon(item) }}
                </v-icon>
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

            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon v-if="!item.required"
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>

        <v-data-table
        :dense="true"
        :headers="fileHeaders"
        :items="deposit.items"
        :sort-by="['name']"
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                >
                <v-spacer></v-spacer>
                    <v-dialog
                    v-model="fileDialog"
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
                        <span class="headline">Add File(s)</span>
                        </v-card-title>

                        <v-card-text>
                        <v-container>
                            <v-form
                            ref="fileForm"
                            v-model="fileValid"
                            lazy-validation
                            >
                                <v-row>
                                    <v-col>
                                        <v-file-input  
                                        multiple
                                        :loading="uploading" 
                                        v-model="file" 
                                        label="Add File"
                                        @change="addFile"
                                        ></v-file-input>
                                        <template v-for="file in files">
                                            <v-chip
                                            class="ma-2"
                                            close
                                            :key="file.name"
                                            @click:close="removeFile(file)"
                                            >
                                            {{ file.name }}
                                            </v-chip>
                                        </template>
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
                            @click="closeFileDialog"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="submitFiles"
                        >
                            Submit
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.ext="{ item }">
                <v-icon>
                    {{ icons[item.ext] }}
                </v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="downloadFile(item)"
                >
                    mdi-download
                </v-icon>
                <v-icon
                    small
                    class="mr-2"
                    @click="editFile(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    @click="deleteFile(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>

        <v-data-table
        :dense="true"
        :headers="eventHeaders"
        :items="deposit.events"
        :sort-by="['time']"
        :items-per-page="5"
        :sort-desc="true"
        ></v-data-table>
    </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";

export default {
    name: 'Deposit',
    data: () => ({
        user: 0,
        token: "",
        deposit: {},
        icons: {
            stl: 'mdi-cube-scan',
            glb: 'mdi-cube-scan',
            gltf: 'mdi-cube-scan',
            ply: 'mdi-cube-scan',
            obj: 'mdi-cube-scan',
            jpg: 'mdi-file-image',
            mp4: 'mdi-file-video',
            png: 'mdi-file-image',
            zip: 'mdi-folder-zip',
            xml: 'mdi-code-tags',
        },
        headers: [
            //   { text: "ID", value: "id" },
            { text: "Field", value: "label" },
            { text: "Value", value: "value.value"},
            { text: "Required", value: "required"},
            { text: "Actions", value: "actions", sortable: false }
        ],
        items: [],
        dialog: false,
        defaultItem: {
            id: "",
            label: "",
            schema: "",
            tag: "",
            note: "",
            value: {
                value: ""
            }
        },
        editedItem: {
            id: "",
            label: "",
            schema: "",
            tag: "",
            note: "",
            value: {
                value: ""
            }
        },
        editedIndex: -1,
        rules: [
            v => !!v || 'Value is required',
        ],
        valid: true,
        descriptiveMetadataFields: [],
        dmfields: [],
        addMetadataField: "",
        uploading: false,
        files: [],
        file: null,
        fileValid: true,
        fileDialog: false,
        fileForm: new FormData(),
        eventHeaders: [
            { text: "Time", value: "time" },
            { text: "Scope", value: "scope" },
            { text: "Target", value: "target" },
            { text: "Type", value: "type" },
            { text: "User", value: "user" },
        ],
        fileHeaders: [
            { text: "Name", value: "name" },
            { text: "Type", value: "ext" },
            { text: "Size", value: "size" },
            { text: "Updated", value: "updated" },
            { text: "Actions", value: "actions", sortable: false }
        ]
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getDeposit();
        this.getMetadata();
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Field' : 'Edit Field'
        },
    },
    methods: {
        getDeposit() {
            let id = this.$route.params.id;
            if (id) {
                let url = BASE_API_URL+'/deposits'+'?id='+id;
                fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    if (response.status === 200) {
                        this.deposit = JSON.parse(await response.text());
                        this.items = this.deposit.items;
                    } else if (response.status === 401) {
                        localStorage.removeItem('user');
                        this.$router.push('/login');
                    } else {
                        let res = await response.text();
                        console.log(response, res)
                    }
                });
            }
        },
        setEditedItem() {
            let item = this.descriptiveMetadataFields.find(field => field.label == this.addMetadataField)
            this.editedItem = item;
        },
        downloadFile(item) {
            let filename = item.name;
            let id = this.$route.params.id;
            let url = BASE_API_URL+'/download'+'?id='+id+'&fn='+filename
            fetch(url, {
                method: 'GET',
                mode: 'cors',
            })
            .then(async response => {
                if (response.status == 200) {
                    let res = await response.text();
                    console.log(res);
                    window.open(res, '_blank');
                } else {
                    console.log(response)
                }
            })
        },
        getMetadata() {
            fetch(BASE_API_URL+'/metadata', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'X-API-KEY': this.user.token
                }
            })
            .then(async response => {
                let res = await response.text();
                this.descriptiveMetadataFields = JSON.parse(res);
                this.descriptiveMetadataFields.forEach(field => {
                    if (!field.required) {
                        this.dmfields.push(field.label);
                    }
                })
            });
        },
        getRequiredIcon(item) {
            if (item.required == 1 && item.value.value == "") {
                return "mdi-exclamation"
            } else if (item.required == 1 && item.value.vavlue != "") {
                return "mdi-check"
            } else {
                return "mdi-minus"
            }
        },
        save() {
            if (this.$refs.form.validate()) {
                let form = new FormData();
                form.append("metadataID", this.editedItem.id);
                form.append("depositID", this.deposit.id);
                form.append("value", this.editedItem.value.value);

                fetch(BASE_API_URL+'/deposit/metadata', {
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
                    this.getDeposit();
                });
            } 
        },
        editItem(item) {
            this.editedIndex = this.deposit.metadata.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        deleteItem (item) {
            if (confirm('Are you sure you want to delete this metadata value?')) {
                fetch(BASE_API_URL+'/deposit/metadata?id='+item.value.id, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    let res = await response.text();
                    console.log(res);
                    this.getDeposit();
                });
            }
        },
        close () {
            this.dialog = false;
            this.$refs.form.resetValidation();
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                this.addMetadataField = "";
            });
        },
        submitFiles() {
            this.uploading = true;
            this.files.forEach((file) => {
                this.fileForm.append('file', file)
            });
            this.fileForm.append('id', this.deposit.id);
            fetch(BASE_API_URL+'/deposit/files', {
                method: 'POST',
                mode: 'cors',
                body    : this.fileForm,
                headers: {
                    'X-API-KEY': this.user.token
                }
            })
            .then(async response => {
                this.uploading = false;
                let res = await response.text();
                if (response.status === 200) {
                    this.getDeposit();
                    // reset form values
                    this.files = [];
                    this.closeFileDialog();
                } else if (response.status === 401) {
                    localStorage.removeItem('user');
                    this.$router.push('/login');
                } else {
                    console.log(res);
                }  
            });
        },
        editFile(item) {
            console.log('edit file:', item);
        },
        deleteFile(item) {
            if (confirm('Are you sure you want to delete '+item.name+'?')) {
                console.log('delete file:', item);
                fetch(BASE_API_URL+'/deposit/files'+'?id='+this.deposit.id+'&fn='+item.name, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'X-API-KEY': this.user.token
                    }
                })
                .then(async response => {
                    let res = await response.text();
                    if (response.status === 200) {
                        this.getDeposit();
                    } else if (response.status === 401) {
                        localStorage.removeItem('user');
                        this.$router.push('/login');
                    } else {
                        console.log(res);
                    }
                });
            }
        },
        addFile() {
        if (this.file.length) {
            console.log('adding files:', this.file);
            this.file.forEach((file) => {
            let exists = false;
            for (let index = 0; index < this.files.length; index++) {
                if (this.files[index].name == file.name) {
                    exists = true;
                }
            }
            if (!exists) {
                this.files.push(file);
            }
            })
            this.file = [];
        }
        },
        removeFile(file) {
            console.log('removing file:', file);
            let index = this.files.indexOf(file);
            this.files.splice(index, 1);
        },
        closeFileDialog () {
            this.fileDialog = false;
            this.$refs.fileForm.resetValidation();
            this.$nextTick(() => {
                this.files = [];
            });
        },
    }
}
</script>

<style>

</style>