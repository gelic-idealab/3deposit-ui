<template>
    <v-container fluid>
        <v-item-group
        v-model="selectedOrg"
        mandatory
        >
            Organization
            <v-row>
                <v-col
                v-for="org in availableOrgs"
                :key="org.id"
                cols="12"
                md="4"
                >
                <v-item :value="org" v-slot="{ active, toggle }">
                    <v-card
                    :color="active ? 'primary' : ''"
                    class="d-flex align-center"
                    @click="toggle"
                    >
                    <v-scroll-y-transition>
                        <div
                        v-if="active"
                        class="display-1 flex-grow-1 text-center font-weight-light white--text ma-4"
                        >
                        {{ org.name }}
                            <div class="caption font-weight-light white--text">{{ org.desc }}</div>
                        </div>
                        
                        <div
                        v-else
                        class="display-1 flex-grow-1 text-center font-weight-light ma-4"
                        >
                        {{ org.name }}
                            <div class="caption text--secondary">{{ org.desc }}</div>
                        </div>
                    </v-scroll-y-transition>
                    </v-card>
                </v-item>
                </v-col>
            </v-row>
        </v-item-group>

        <v-divider class="ma-4"></v-divider>

        <v-item-group mandatory multiple v-model="selectedCollections">
            Collections
            <v-row v-if="filteredCollections.length">
                <v-col
                v-for="collection in filteredCollections"
                :key="collection.id"
                cols="12"
                md="4"
                >
                <v-item :value="collection" v-slot="{ active, toggle }">
                    <v-card
                    :color="active ? 'primary' : ''"
                    class="d-flex align-center"
                    height="100"
                    @click="toggle"
                    >
                    <v-scroll-y-transition>
                        <div
                        v-if="active"
                        class="display-1 flex-grow-1 text-center font-weight-light white--text"
                        >
                        {{ collection.name }}
                            <div class="caption font-weight-light white--text">{{ collection.desc }}</div>
                        </div>
                        <div
                        v-else
                        class="display-1 flex-grow-1 text-center font-weight-light ma-4"
                        >
                        {{ collection.name }}
                            <div class="caption text--secondary">{{ collection.desc }}</div>
                        </div>
                    </v-scroll-y-transition>
                    </v-card>
                </v-item>
                </v-col>
            </v-row>
            <div class="caption ma-4" v-else>
                No collections.
            </div> 
        </v-item-group>

    <v-divider class="ma-4"></v-divider>

    <div>
        Items
        <v-data-table
        :headers="itemHeaders"
        :items="filteredItems"
        :sort-by="['id']"
        show-expand
        >
        <template v-slot:expanded-item="{ item }">
                <v-list>
                    <v-list-item-group>
                        <v-list-item
                        v-for="(file, i) in item.files"
                        :key="i"
                        >
                        <v-list-item-icon>
                            <v-icon v-text="file"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="file"></v-list-item-title>
                        </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
        </template>
        </v-data-table>
    </div>

    </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";

export default {
    name: 'Deposits',
    data: () => ({
        user: 0,
        token: "",
        selectedOrg: {},
        availableOrgs: [],
        selectedCollections: [],
        availableCollections: [],
        collectionsSelectedOrg: [],
        availableItems: [],
        itemsSelectedCols: [],
        itemHeaders: [
            { text: "ID", value: "id" },
            { text: "Name", value: "name" },
            { text: "Description", value: "desc"},
            { text: "Files", value: "files.length"},
            { text: "Collection", value: "collection.name" },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        fileHeaders: [
            { text: "ID", value: "id" },
            { text: "Name", value: "name" },
            { text: "Description", value: "desc" },
            { text: "Filename", value: "filename"}
        ]
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getOrgs();
        this.getCollections();
        this.getItems();
    },
    computed: {
        filteredCollections: function () {
            return this.availableCollections.filter(c => c.org.id == this.selectedOrg.id)
        },
        filteredItems: function () {
            return this.availableItems.filter(i => {
                let found = false;
                this.filteredCollections.forEach(c => {
                    found = c.id == i.collection.id;
                    if (found) return;
                });
                return found;
            })
        }
    },
    methods: {
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
                    this.availableOrgs = JSON.parse(res);
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
                    this.availableCollections = JSON.parse(res);
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
                    this.availableItems = JSON.parse(res);
                } else if (response.status === 401) {
                    localStorage.removeItem('user');
                    this.$router.push('/login');
                } else {
                    console.log(res);
                }
            });
        },
    }
}
</script>

<style>

</style>