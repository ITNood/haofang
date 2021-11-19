import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./static/iconfont/iconfont.css";
import "./static/style.scss";
import axios from "axios";
import common from "./common/common";

import "@/utils/global"; //全局
// 控制路由表的js文件
import "@/permission.js";
Vue.prototype.common = common;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
