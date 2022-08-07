<template>
  <div class='my-card'>
    <div class="my-card-title">
      <span>{{title}}</span>
    </div>
    <div class="my-card-line" v-if="title"></div>
    <div class="my-card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/07 星期天 15:29:48
 ** description: ..
*/
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: '',
  components: {

  },
  props: {
    title: String
  },
  setup () {

    return {
    }
  }
})

</script>
<style>
.my-card {
  /* background-color: red; */
  border-radius: 4px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  box-sizing: border-box;
  border: 1px solid #e4e7ed;
  padding: 10px 20px;
}
.my-card-line {
  height: 1px;
  background-color: var(--van-gray-4);
  margin: 8px 0 16px;
}
.my-card-title {
  text-align: left;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--van-gray-8);
}
</style>
