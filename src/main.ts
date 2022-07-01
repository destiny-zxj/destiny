import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(store).use(router)
app.mount('#app');
(window as any).electronAPI.hello().then((res: any)=>{
  console.log(res)
});

