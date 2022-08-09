<template>
  <div class='main'>
    <div class="main-sidemenu">
      <side-menu />
    </div>
    <div class="main-center">
      <div class="main-center-top">
        <div class="main-center-top-hello">
          <span>Hello, Admin</span>
        </div>
        <div class="main-center-top-welcome">
          <span>Welcome back!</span>
        </div>
      </div>
      <div class="main-center-body">
        <router-view />
      </div>
    </div>
    <!-- <div class="main-right-box">
      <right-box />
    </div> -->
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/07/01 星期五 12:50:47
 ** description: ..
*/
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
// import RightBox from '@/components/RightBox.vue'
import { ElectronApi } from '@/utils/ElectronApi'

export default defineComponent({
  name: '',
  components: {
    SideMenu, 
    // RightBox
  },
  setup () {
    const data = reactive({
      res: 'default'
    })
    const onPrint = (event: any, value: any) => {
      console.log(value)
      // alert(value)
    }
    onMounted(()=>{
      // alert(data.res);
      // (window as any).electronAPI.print(onPrint)
      // ElectronApi.hello().then((res: any)=>{
      //   console.log(res)
      // })
    })

    return {
      ...toRefs(data)
    }
  }
})

</script>
<style>
.main {
  height: 100%;
  display: flex;
}
.main-center {
  flex: 1;
  box-sizing: border-box;
  padding: 30px 20px 0;
  display: flex;
  flex-direction: column;
}
.main-center-top {
  text-align: left;
}
.main-center-top-hello {
  font-size: 1.6rem;
  font-weight: 600;
}
.main-center-top-welcome {
  color: var(--van-gray-7);
}
.main-center-body {
  flex: 1;
}
</style>
