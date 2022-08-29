import { createApp } from 'vue';
import router from './router/index';

import './styles/main.scss';
import App from './App.vue';

import { createPinia } from 'pinia';

const store = createPinia();

const app = createApp(App);

import Alert from './components/common/Alert.vue';
import Collapse from './components/common/Collapse.vue';
import Info from './components/common/Info.vue';
import Table from './components/common/Table.vue';
import Warning from './components/common/Warning.vue';

app.component('Alert', Alert);
app.component('Collapse', Collapse);
app.component('Info', Info);
app.component('Table', Table);
app.component('Warning', Warning);

app.use(router);
app.use(store);

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $baseUrl: string;
  }
}
app.config.globalProperties.$baseUrl = import.meta.env.VITE_BASE_API;

app.mount('#app');
