import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVueNext from 'bootstrap-vue-next';
import axios from 'axios';
import store from './store';

import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';


const app = createApp(App).use(store);
app.use(router);
app.use(BootstrapVueNext);


const isApp1 = 'http://192.168.0.5:8000/api';
const backendUrl = isApp1 ? 'http://192.168.0.5:8080/api' : 'http://192.168.0.6:8000/api';
axios.defaults.baseURL = backendUrl;


app.mount('#app');