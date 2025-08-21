import './styles/main.css';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Checkbox from 'primevue/checkbox'

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ApiService from './services/apiService';
import App from './App.vue';
import router from './router';

// Inisialisasi aplikasi Vue
const app = createApp(App);

// Inisialisasi ApiService
ApiService.init();

// Gunakan plugin dan layanan
app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

// Daftarkan komponen global PrimeVue
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('Toast', Toast);

app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('InputText', InputText)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('MultiSelect', MultiSelect)
app.component('Select', Select)
app.component('Tag', Tag)
app.component('Checkbox', Checkbox)

// Mount aplikasi ke elemen dengan id #app
app.mount('#app');
