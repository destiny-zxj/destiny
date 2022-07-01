<template>
  <div class='main'>
    {{res}}
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/07/01 星期五 12:50:47
 ** description: ..
*/
import { defineComponent, onMounted, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '',
  components: {

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
      (window as any).electronAPI.print(onPrint)
    })

    return {
      ...toRefs(data)
    }
  }
})

</script>
<style>

</style>
