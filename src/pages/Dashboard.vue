<template>
  <v-container fluid>
    <v-row>
      <template v-for="(d, index) in data">
        <v-col :key="index">
          <v-card
            class="mx-auto"
          >
            <v-list-item>
              <v-list-item-content>
                <div class="overline mb-4">{{ index }}</div>
                <v-list-item-title v-if="index == `size`" class="headline mb-1">{{ convertSize(d) }}</v-list-item-title>
                <v-list-item-title v-else class="headline mb-1">{{ d }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar
              >
                <v-icon x-large>{{ getIcon(index) }}</v-icon>
              </v-list-item-avatar>
            </v-list-item>

            <!-- <v-card-actions>
              <v-btn text>Button</v-btn>
            </v-card-actions> -->
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { BASE_API_URL } from "../requests/base";

export default {
    name: 'Dashboard',
    components: { },
    data: () => ({
        data: {},
    }),
    mounted() {
      fetch(BASE_API_URL+'/dashboard', {
        method: 'GET',
        mode: 'cors',
      })
      .then(async response => {
        if (response.status === 200) {
          this.data = JSON.parse(await response.text());
        }
      })

    },
    methods: {
      getIcon(target) {
        if (target == "models") return "mdi-cube";
        if (target == "videos") return "mdi-video";
        if (target == "vr") return "mdi-virtual-reality";
        if (target == "total") return "mdi-upload";
        if (target == "size") return "mdi-harddisk";
        return "mdi-square-outline"
      },
      convertSize(value) {
        if (value <= 1.0e+6) {
          return Math.round((value/1.0e+3)).toString() + 'KB'
        }
        if (value > 1.0e+6 && value <= 1.0e+9) {
          return Math.round((value/1.0e+6)).toString() + 'MB'
        }
        if (value > 1.0e+9) {
          return Math.round((value/1.0e+9)).toString() + 'GB'
        }
      },
    }
}
</script>

<style>

</style>