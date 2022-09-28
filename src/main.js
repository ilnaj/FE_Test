// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import "vue-select/dist/vue-select.css";
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { faPencil,faGauge,faChartSimple,faEye,faTrash } from "@fortawesome/free-solid-svg-icons";

library.add(faPencil,faGauge,faChartSimple,faEye,faTrash);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Chartkick.use(Chart))
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
