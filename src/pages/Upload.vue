<template>
  <v-container fluid>
    Upload
    <v-row justify="end">
      <v-subheader>Uploading as {{ user.firstName + " " + user.lastName }} | {{ user.email }}</v-subheader>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          v-model="selectedOrg"
          :items="orgs"
          menu-props="auto"
          label="Select Organization"
          prepend-icon="mdi-account-group"
          item-text="name"
          item-value="id"
          @change="orgChanged"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          v-model="selectedCollection"
          :items="filterCollectionsByOrg"
          menu-props="auto"
          label="Select Collection"
          prepend-icon="mdi-image-multiple"
          item-text="name"
          item-value="id"
          @change="colChanged"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          v-model="selectedItem"
          :items="filterItemsByCollection"
          menu-props="auto"
          label="Select Item"
          prepend-icon="mdi-image"
          item-text="name"
          item-value="id"
          @change="itemChanged"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          v-model="selectedEntity"
          :items="filterEntitiesByItem"
          menu-props="auto"
          label="Select Entity"
          prepend-icon="mdi-image"
          item-text="name"
          item-value="id"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        Metadata
        <template>
        <v-form>
          <template v-for="field in descriptiveMetadataFields">
            <v-text-field
              v-if="field.required == 0"
              :key="field.id"
              :label="field.label"
              :hint="field.note"
              persistent-hint
              v-model="field.value.value"
            ></v-text-field>
            <v-text-field
              v-if="field.required == 1"
              :key="field.id"
              :label="field.label"
              :hint="field.note"
              persistent-hint
              prepend-inner-icon="mdi-exclamation"
              v-model="field.value.value"
            ></v-text-field>
          </template>

          <v-spacer></v-spacer>
            <v-row
            align="center"
            justify="center"
            class="text-center"
            >
              <v-col>
                <v-btn block color="primary" @click="submit">Create</v-btn>
              </v-col>
            </v-row>
        </v-form>
        </template>
      </v-col>
      <v-col :cols=4>
        Files
        <v-file-input  
          multiple
          :loading="uploading" 
          v-model="file" 
          label="Add file(s)"
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
    <v-spacer></v-spacer>
  </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";

export default {
  name: 'Upload',

  data: () => ({
    BASE_API_URL: "http://localhost:8081",
    descriptiveMetadataFields: [],
    files: [],
    file: [],
    headers: [
      { text: "ID", value: "id" },
      { text: "Label", value: "label" },
      { text: "Schema", value: "schema"},
      { text: "Tag", value: "tag" },
      { text: "Note", value: "note" },
      { text: "Required", value: "required" },
    ],
    form: new FormData(),
    uploading: false,
    user: {},
    orgs: [],
    selectedOrg: {},
    collections: [],
    selectedCollection: {},
    items: [],
    selectedItem: {},
    entities: [],
    selectedEntity: {}
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getMetadata();
    this.getOrgs();
    this.getCollections();
    this.getItems();
    this.getEntities();
  },
  computed: {
    filterCollectionsByOrg() {
      return this.collections.filter((c) => { return c.org.id == this.selectedOrg });
    },
    filterItemsByCollection() {
      return this.items.filter((i) => { return i.collection.id == this.selectedCollection });
    },
    filterEntitiesByItem() {
      return this.entities.filter((i) => { return i.item.id == this.selectedItem });
    }
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
    getEntities() {
      fetch(BASE_API_URL+'/entities', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'X-API-KEY': this.user.token
          }
        })
        .then(async response => {
          if (response.status === 200) {
            let res = await response.text();
            this.entities = JSON.parse(res);
          } else if (response.status === 401) {
            localStorage.removeItem('user');
            this.$router.push('/login');
          } else {
            let res = await response.text();
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
          if (response.status === 200) {
            let res = await response.text();
            this.items = JSON.parse(res);
          } else if (response.status === 401) {
            localStorage.removeItem('user');
            this.$router.push('/login');
          } else {
            let res = await response.text();
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
    getCollections() {
        fetch(BASE_API_URL+'/collections', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'X-API-KEY': this.user.token
            }
        })
        .then(async response => {
            let res = await response.text();
            if (response.status === 200) {
                this.collections = JSON.parse(res);
            } else if (response.status === 401) {
                localStorage.removeItem('user');
                this.$router.push('/login');
            } else {
                console.log(res);
            }
        });
    },
    addDir(e) {
      console.log(e.target.files);
      e.target.files.forEach((file) => {
        this.files.push(file);
      })
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
    submit() {
      this.uploading = true;
      this.descriptiveMetadataFields.forEach(field => {
        if (field.value.value != "") {
          this.form.append(field.id, JSON.stringify(field));
        }
      })
      this.files.forEach((file) => {
        this.form.append('file', file)
      });
      fetch(BASE_API_URL+'/upload', {
        method: 'POST',
        mode: 'cors',
        body: this.form,
        headers: {
          'X-API-KEY': this.user.token
        }
      })
      .then(async response => {
        this.uploading = false;
        let res = await response.text();
        if (response.status == 200) {
          this.$router.push('/');
        } else if (response.status === 401) {
            localStorage.removeItem('user');
            this.$router.push('/login');
        } else {
          console.log(res);
        }
        
        // reset form values
        this.files = [];
        this.fields.forEach(field => {
          field.value = '';
        });
      });
    },
    orgChanged() {
      this.selectedCollection = {};
      this.selectedItem = {};
    },
    colChanged() {
      this.selectedItem = {};
    },
    itemChanged() {
      this.selectedEntity = {};
    }
  }
}
</script>
