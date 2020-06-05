import Vue from 'vue'
import App from './App.vue'
import 'font-awesome/css/font-awesome.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
