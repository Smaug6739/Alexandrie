import { createSSRApp } from 'vue';
import router from './router/index';

import './styles/style.scss';
import App from './App.vue';

import { createPinia } from 'pinia';

const store = createPinia();

const app = createSSRApp(App);

import kt from './components/kt.vue';
import Alert from './components/common/Alert.vue';
import Collapse from './components/common/Collapse.vue';
import Info from './components/common/Info.vue';
import Table from './components/common/Table.vue';
import Warning from './components/common/Warning.vue';

app.component('kt', kt);
app.component('kr', kt);
app.component('Alert', Alert);
app.component('Collapse', Collapse);
app.component('Info', Info);
app.component('Table', Table);
app.component('Warning', Warning);
app.component('dynamic-link', {
  template: `<component v-bind:is="transformed" /></component>`,
  props: {
    to: {
      type: String,
      required: true,
    },
    data() {
      return {
        text: `
      <router-link to="${this.to}">
        <button class="btn btn-pink">Edit
        </button>
      </router-link>
      `,
      };
    },
  },
  computed: {
    transformed() {
      return { template: this.text };
    },
  },
});

app.use(router);
app.use(store);
app.mount('#app');
