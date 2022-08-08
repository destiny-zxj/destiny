<template>
  <div class='status-bar'>
    <van-divider :style="{ color: currentColor, borderColor: currentColor }">
      <slot></slot>
    </van-divider>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/08 星期一 15:44:45
 ** description: ..
*/
import { defineComponent, reactive, toRefs, watch } from 'vue'

export default defineComponent({
  name: '',
  components: {

  },
  props: {
    status: String
  },
  setup (props) {
    const data = reactive({
      color: {
        run: 'var(--van-green)',
        stop: 'var(--van-red)',
        unknown: 'var(--van-orange)'
      },
      currentColor: 'var(--van-orange)'
    })

    watch(()=>props.status, (newVal)=>{
      switch(newVal) {
        case '0': {
          data.currentColor = data.color.stop
          break
        }
        case '1': {
          data.currentColor = data.color.run
          break
        }
        default: data.currentColor = data.color.unknown
      }
    }, {immediate: true})

    return {
      ...toRefs(data)
    }
  }
})

</script>
<style>

</style>
