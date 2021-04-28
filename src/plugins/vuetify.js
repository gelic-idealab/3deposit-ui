import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#607D8B',
            secondary: '#FFD180',
            accent: '#B2EBF2',
            error: '#b71c1c',
          },
        },
    }
});
