import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'
import { Button, Calendar, CellGroup, Divider, Field, Form, Icon, Loading, Overlay, Switch } from 'vant'

const app = createApp(App)
const coms = [
  Button, Icon, Calendar, Divider, Field, CellGroup, Switch, Form, Overlay, Loading
]

coms.map((elem) => {
  app.use(elem)
})

app.use(store).use(router)
app.mount('#app');
// (window as any).electronAPI.hello().then((res: any)=>{
//   console.log(res)
// });

