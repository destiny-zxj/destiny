<template>
  <div class='right-box'>
    <div class="right-box-datetime" v-if="datetime">
      <span>{{datetime}}</span>
    </div>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/07 星期天 13:22:41
 ** description: ..
*/
import Util from '@/utils/Util'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '',
  components: {

  },
  setup () {
    const data = reactive({
      datetime: ''
    })

    const startTimer = () => {
      setInterval(()=>{
        const {date, time} = Util.getDateTime(new Date().getTime())
        data.datetime = `${date.join('/')} ${time.join(':')}`
      }, 1000)
    }

    onMounted(()=>{
      // startTimer()
    })

    return {
      ...toRefs(data)
    }
  }
})

</script>
<style>
.right-box {
  width: 260px;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  border-left: 2px solid var(--van-gray-4);
  /* background-color: red; */
}
.right-box-datetime {
  background-color: var(--color-theme1);
  color: var(--color-ft);
  width: 90%;
  margin: 0 auto;
  border-radius: 6px;
  font-size: 2rem;
  font-weight: 600;
  box-shadow: 2px -2px 2px 1px var(--van-gray-4);
}
</style>
