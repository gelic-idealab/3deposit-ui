<template>
  <v-container fluid>
    Metadata Fields
    <v-data-table
    :headers="headers"
    :items="descriptiveMetadataFields"
    :sort-by="['label']"
    :items-per-page="100"
    >
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
                Add Field
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
                            <v-select
                            v-model="editedItem.scope"
                            label="Scope"
                            required
                            :rules="rules"
                            :items="scopeItems"
                            ></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                            v-model="editedItem.label"
                            label="Label"
                            required
                            :rules="rules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                            v-model="editedItem.schema"
                            label="Schema"
                            required
                            :rules="rules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                            v-model="editedItem.tag"
                            label="Tag"
                            :rules="rules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea
                            v-model="editedItem.note"
                            label="Note"
                            required
                            :rules="rules"
                            ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-checkbox
                            v-model="editedItem.required"
                            label="Required"
                            ></v-checkbox>
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
    </v-data-table>
  </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";

export default {
  name: 'Metadata',

  data: function() {
      return {
        BASE_API_URL: "http://localhost:8081",
        descriptiveMetadataFields: [],
        headers: [
        //   { text: "ID", value: "id" },
        { text: "Label", value: "label" },
        { text: "Schema", value: "schema"},
        { text: "Tag", value: "tag" },
        { text: "Scope", value: "scope"},
        { text: "Note", value: "note" },
        { text: "Required", value: "required" },
        { text: "Actions", value: "actions", sortable: false },
        ],
        user: {},
        dialog: false,
        defaultItem: {},
        editedItem: {
            label: "",
            schema: "",
            tag: "",
            note: "",
            required: false,
        },
        scopeItems: ["Collection", "Item", "Entity", "File"],
        editedIndex: -1,
        rules: [
            v => !!v || 'Value is required',
        ],
        valid: true,
      }
    },
  mounted() {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.getMetadata();
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Field' : 'Edit Field'
    },
  },
  methods: {
    getMetadata() {
      fetch(BASE_API_URL+'/metadata', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'X-API-KEY': this.user.token
          }
        })
        .then(async response => {
            if (response.status === 200) {
                let res = await response.text();
                this.descriptiveMetadataFields = JSON.parse(res);
            } else if (response.status === 401) {
                localStorage.removeItem('user');
                this.$router.push('/login');
            } else {
                let res = await response.text();
                console.log(res);
            }

        });
    },
    getRequiredIcon(item) {
      if (item.required) {
          return "mdi-exclamation"
      }
      return "mdi-minus"
    },
    save() {
      if (this.$refs.form.validate()) {
        let form = new FormData();
        for (let [key, value] of Object.entries(this.editedItem)) {
            form.append(key, value);
        }
        fetch(BASE_API_URL+'/metadata', {
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
            this.getMetadata();
        });
      } 
    },
    editItem(item) {
        this.editedIndex = this.descriptiveMetadataFields.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },
    deleteItem (item) {
        if (confirm('Are you sure you want to delete this field?\nWarning! This will also remove all metadata values that reference this field!!')) {
            fetch(BASE_API_URL+'/metadata?id='+item.id, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'X-API-KEY': this.user.token
                }
            })
            .then(async response => {
                let res = await response.text();
                console.log(res);
                this.getMetadata();
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
