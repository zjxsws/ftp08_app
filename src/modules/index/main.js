
import Vue from 'vue' // 引用vue
import App from './App'// 入口文件为 src/App.vue 文件 所以要引用
var abc = new Vue({
  el: '#app',
  // store,
  template: '<App/>',
  components: { App }
})
// abc.router = router


