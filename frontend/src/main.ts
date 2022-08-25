import { createSSRApp } from 'vue';
import router from './router/index';

import './styles/style.scss';
import App from './App.vue';

import { createPinia } from 'pinia';

const store = createPinia();

const app = createSSRApp(App);

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
app.mount('#app');
