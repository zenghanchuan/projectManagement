import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import echarts from 'echarts';
import axios from 'axios'


// let token = decodeURIComponent(window.atob(localStorage.getItem('userInfo')));
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = decodeURIComponent(window.atob(localStorage.getItem('userInfo')));
// axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('userInfo'));
// axios.defaults.baseURL = "http://192.168.0.144:8100";
Vue.use(ViewUI);
Vue.prototype.$echarts = echarts;

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('username')) { // 如果已经登录的话
    next();
  } else {
    if (to.path === '/login') { // 如果是登录页面的话，直接next()
      next();
    } else { // 否则 跳转到登录页面
      next({
        path: '/login'
      });
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
