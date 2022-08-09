<template>
  <div class='side-menu'>
    <ul class="side-menu-list">
      <li class="side-menu-logo menu-item-disable">
        <span>iDestiny</span>
      </li>
      <li :class="{
        'menu-item-active': item.active,
        'menu-item-round-top': item.roundTop,
        'menu-item-round-bottom': item.roundBottom,
        'menu-item-disable': item.disable
      }"
      class="menu-item"
      @click="activeMenuItem(item)"
      v-for="(item, index) of menu" :key="index">
        <span class="menu-item-icon" v-if="item.name"><van-icon size="20" :name="item.icon" /></span>
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/07 星期天 12:06:02
 ** description: ..
*/
import Path from '@/utils/Path'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: '',
  components: {

  },
  setup () {
    const router = useRouter()
    const data = reactive({
      menu: [
        {id: 'topblank', name: '', icon: '', path: '', active: false, roundBottom: false, roundTop: false, disable: true},
        {id: 'home', name: '总览', icon: 'wap-home', path: Path.Home.path, active: false, roundBottom: false, roundTop: false},
        {id: 'bookmark', name: '我的书签', icon: 'bookmark', path: Path.Bookmark.path, active: false, roundBottom: false, roundTop: false},
        {id: 'server', name: '本地服务器设置', icon: 'cluster', path: Path.LocalServer.path, active: false, roundBottom: false, roundTop: false},
        {id: 'setting', name: '设置', icon: 'setting', path: Path.Settings.path, active: false, roundBottom: false, roundTop: false},
        {id: 'bottomblank', name: '', icon: '', path: '', active: false, roundBottom: false, roundTop: false, disable: true}
      ]
    })

    const activeMenuItem = (item: any) => {
      // console.log(item)
      if (item.disable) return
      data.menu.forEach((elem)=>{
        elem.roundBottom = false
        elem.roundTop = false
        elem.active = false
      })
      for (let i=0;i<data.menu.length;i++) {
        if (item.id == data.menu[i].id) {
          data.menu[i].active = true
          data.menu[i+1].roundTop = true
          data.menu[i-1].roundBottom = true
          if (item.path) {
            router.push({
              path: item.path
            })
          }
        }
      }
    }

    onMounted(()=>{
      activeMenuItem(data.menu[2])
    })

    return {
      ...toRefs(data),
      activeMenuItem
    }
  }
})

</script>
<style>
.side-menu {
  height: 100%;
  background-color: var(--color-theme1);
  width: 220px;
  box-sizing: border-box;
  padding-top: 36px;
  padding-left: 16px;
}
.side-menu-list {
  /* background-color: var(--color-ft); */
  background-image: linear-gradient(to right, #6F81D6 50%, var(--color-ft) 50%);
  /* height: 100%; */
}
.side-menu-list>li {
  background-color: var(--color-theme1);
  color: var(--color-ft);
  /* border-radius: 999px; */
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.side-menu-list .menu-item {
  box-sizing: border-box;
  padding: 0 16px;
  text-align: left;
  display: flex;
  align-items: center;
  font-weight: 500;
}
.side-menu-list>li.menu-item-active {
  background-color: #FFFFFF;
  color: var(--color-theme1);
  border-top-left-radius: 999px;
  border-bottom-left-radius: 999px;
  height: 40px;
  line-height: 40px;
}
.side-menu-list>li.menu-item-disable{
  cursor: default;
}
.side-menu-list>li.menu-item-round-bottom {
  border-bottom-right-radius: 16px;
}
.side-menu-list>li.menu-item-round-top {
  border-top-right-radius: 16px;
}
/* .side-menu-list>li.active */
.side-menu-list>li.side-menu-logo {
  font-size: 2rem;
  color: var(--color-ft);
  font-weight: 600;
}
.menu-item-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
}
</style>
