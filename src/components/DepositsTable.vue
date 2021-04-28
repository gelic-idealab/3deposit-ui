<template>
    <v-container fluid>
        Deposits
        <v-data-table
        :headers="headers"
        :items="data"
        :sort-by="['updated']"
        :sort-desc="[true]"
        @click:row="getDeposit"
        >
        </v-data-table>
    </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";

export default {
    name: 'Deposits',

    data: () => ({
        data: [],
        headers: [
            { text: "ID", value: "id" },
            { text: "Name", value: "name" },
            { text: "Description", value: "desc"},
            { text: "Updated", value: "updated" },
            { text: "Type", value: "type" },
            { text: "Size", value: "size" },
            { text: "Creator", value: "creator.email"}
        ],
        user: 0,
        token: ""
    }),
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        fetch(BASE_API_URL+'/deposits', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'X-API-KEY': this.user.token
            }
        })
        .then(async response => {
            if (response.status === 200) {
            this.data = JSON.parse(await response.text());
            } else if (response.status === 401){
                localStorage.removeItem('user');
                this.$router.push('/login');
            } else {
                let res = await response.text();
                console.log(response, res)
            }
        });
    },
    methods: {
        getDeposit({ id }) {
            this.$router.push({
                name: "Deposit",
                params: { id }
            });
        }
    }
}
</script>

<style>

</style>