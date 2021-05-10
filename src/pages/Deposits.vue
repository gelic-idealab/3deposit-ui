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
            <v-row v-if="collectionsSelectedOrg.length">
                <v-col
                v-for="collection in collectionsSelectedOrg"
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
        :items="itemsSelectedCols"
        :sort-by="['id']"
        >
            <template v-slot:item.collection="{ item }">
                <span>{{ item.collection.name || `None` }}</span>
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
            { text: "Collection", value: "collection" },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getOrgs();
        this.getCollections();
        this.getItems();
    },
    watch: {
        selectedOrg: {
            immediate: true,
            handler(org) {
                this.collectionsSelectedOrg = this.availableCollections.filter(c => c.org.id == org.id)
            }
        },
        collectionsSelectedOrg: {
            immediate: true,
            handler(cols) {
                this.itemsSelectedCols = this.availableItems.filter(i => {
                    let found = false;
                    cols.forEach(c => {
                        found = c.id == i.collection.id;
                        if (found) return;
                    });
                    return found;
                })
            }
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