<template>
  <v-container fluid>
    Create a New Deposit
    <v-row justify="end">
      <v-subheader>Uploading as {{ user.firstName + " " + user.lastName }} | {{ user.email }}</v-subheader>
    </v-row>
    <v-row>
      <v-col>
        Metadata
        <template>
        <v-form>
          <template v-for="field in fields">
            <v-text-field dense v-if="field.type == `text`" :key="field.id" :label="field.label" v-model="field.value" :counter=25></v-text-field>
            <v-textarea dense v-if="field.type == 'textarea'" :key="field.id" :label="field.label" v-model="field.value" :counter=2000></v-textarea>
            <v-select v-else-if="field.type == `select`" :key="field.id" :label="field.label" v-model="field.value" :items="field.items"></v-select>
          </template>

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
    fields: [
      {
        id: 'deposit_type',
        label: 'Media Type',
        type: 'select',
        required: true,
        items: [
          {
            text: '3D Scan or Model', 
            value: 'model'
          },
          {
            text: '360 Video', 
            value: 'video'
          },
          {
            text: 'Virtual Reality Application',
            value: 'vr'
          }
        ],
        value: ''
      },
      {
        id: 'deposit_name',
        label: 'Project Name',
        type: 'text',
        required: true,
        value: ''
      },
      {
        id: 'deposit_desc',
        label: 'Project Description',
        type: 'textarea',
        required: true,
        value: ''
      }
    ],
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
    user: {}
  }),
  mounted() {
      this.user = JSON.parse(localStorage.getItem('user'));

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
  methods: {
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
      this.fields.forEach((field) => {
        this.form.append(field.id, field.value)
      });
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
    }
  }
}
</script>
