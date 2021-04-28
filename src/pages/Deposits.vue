<template>
    <v-container fluid>
        <v-item-group
        v-model="selectedOrg"
        mandatory>
            Organization
            <v-row>
                <v-col
                v-for="org in availableOrgs"
                :key="org.id"
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
                        class="display-1 flex-grow-1 text-center ma-4"
                        >
                        {{ org.name }}
                            <div class="caption text--secondary">{{ org.desc }}</div>
                        </div>
                        
                        <div
                        v-else
                        class="display-1 flex-grow-1 text-center ma-4"
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

        <v-item-group multiple>
            Collections
            <v-row v-if="availableCollections.length">
                <v-col
                v-for="collection in availableCollections"
                :key="collection.id"
                cols="12"
                md="4"
                >
                <v-item :value="collection" v-slot="{ active, toggle }">
                    <v-card
                    :color="active ? 'accent' : ''"
                    class="d-flex align-center"
                    height="200"
                    @click="toggle"
                    >
                    <v-scroll-y-transition>
                        <div
                        v-if="active"
                        class="display-3 flex-grow-1 text-center"
                        >
                        Active
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
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.getOrgs();
    },
    computed: {},
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
    }
}
</script>

<style>

</style>