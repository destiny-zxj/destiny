<template>
  <div class='bookmark'>
    <div class="bookmark-add">
      <div class="bookmark-add-btns">
        <van-button icon="plus" style="width: 32px; height: 32px;" type="primary" round @click="addBookmark" />
      </div>
      <van-divider :style="{ borderColor: 'var(--van-gray-5)'}"/>
    </div>
    <div class="bookmark-list">
      <div class="bookmark-item" v-for="(item, index) of bookmarks" :key="index" :id="item.id"
      sort="true"
      draggable="true" @dragover="allowDrop($event)" @dragstart="onDrag($event)" @drop="onDrop($event)"
      >
        <van-cell>
          <template #icon>
            <!-- <div class="bookmark-item-img" v-if="item.icon">
              <img :src="item.icon" />
            </div> -->
            <van-icon name="bookmark-o" size="20px" class="bookmark-item-icon"/>
          </template>
          <template #title>
            <span class="bookmark-item-title">{{item.name}}</span>
          </template>
          <!-- <template #label>
            <span class="bookmark-item-label">
              <a :href="item.url">{{item.url}}</a>
            </span>
          </template> -->
          <template #value>
            <div class="bookmark-act-bnts">
              <span class="bookmark-item-btn bookmark-item-open" @click="onClickBookmark(item)">打开</span>
              <span class="bookmark-item-btn bookmark-item-delete" @click="onBookmarkDelete(item)">删除</span>
            </div>
          </template>
        </van-cell>
      </div>
    </div>
    <div class="bookmark-dialog">
      <van-dialog v-model:show="dialog.show" :title="dialog.title" show-cancel-button @confirm="onClickAdd">
        <van-form class="bookmark-dialog-body">
          <van-cell-group inset>
            <van-field
              v-model="newBookmark.name"
              label="名称"
              placeholder="请输入名称"
            />
            <van-field
              v-model="newBookmark.url"
              label="网址"
              placeholder="请输入网址"
            />
          </van-cell-group>
        </van-form>
      </van-dialog>
    </div>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/09 星期二 20:16:53
 ** description: ..
*/
import Res from '@/bgutils/Res'
import { ElectronApi } from '@/utils/ElectronApi'
import Util from '@/utils/Util'
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'

export default defineComponent({
  name: '',
  components: {

  },
  setup () {
    const data = reactive({
      page: {
        current: 1,
        size: 999,
        total: 0
      },
      bookmarks: [] as any[],
      dialog: {
        show: false,
        title: '新增书签'
      },
      newBookmark: {
        name: '',
        url: '',
        sort_id: 1
      },
      drag: {
        currentId: -1,
        targetId: -1
      }
    })

    const addBookmark = () => {
      data.dialog.show = true
    }
    const onBookmarkDelete = (item: any) => {
      console.log(item)
      ElectronApi.deleteBookmark(item.id).then((res: Res)=>{
        if (res.code === 200) {
          getBookmarks()
          Util.showToast(res.msg)
        }
      })
    }
    const getBookmarks = () => {
      ElectronApi.getBookmarks({
        page: data.page.current,
        size: data.page.size
      }).then((res: Res)=>{
        if(res.code === 200 && res.data) {
          data.bookmarks = res.data.res_list
          data.page.total = res.data.total
          // console.log(data.bookmarks)
          // data.bookmarks = data.bookmarks.concat(data.bookmarks)
          // data.bookmarks = data.bookmarks.concat(data.bookmarks)
          // data.bookmarks = data.bookmarks.concat(data.bookmarks)
        }
      })
    }
    const onClickBookmark = (item: any) => {
      // console.log(item)
      if (item.url) {
        ElectronApi.openUrl(item.url)
      }
    }
    const onClickAdd = (event: any) => {
      if (data.bookmarks.length > 0) {
        data.newBookmark.sort_id = data.bookmarks[0].sort_id + 1
      }
      if (!data.newBookmark.name) {
        Util.showToast('名称不能为空')
        setTimeout(()=>{
          data.dialog.show = true
        }, 1500)
        return false
      }
      if (!data.newBookmark.url) {
        Util.showToast('网址不能为空')
        setTimeout(()=>{
          data.dialog.show = true
        }, 1500)
        return false
      }
      console.log(data.newBookmark)
      ElectronApi.addBookmark({
        name: data.newBookmark.name,
        url: data.newBookmark.url,
        sort_id: data.newBookmark.sort_id
      }).then((res: Res)=>{
        if (res.code === 200) {
          Util.showToast('添加成功', 1000)
          getBookmarks()
        }
      })
    }
    const getTargetId = (target: HTMLElement) => {
      let sort = false
      let count = 0
      let currentElem = target as HTMLElement
      while(!sort) {
        currentElem = currentElem.parentNode as HTMLElement
        sort = currentElem.getAttribute('sort') === 'true'
        count ++
        if (count>10) break
      }
      if (sort) {
        return currentElem.getAttribute('id')
      } else {
        return null
      }
    }
    const allowDrop = (event: Event) => {
      event.preventDefault()
    }
    const onDrag = (event: any) => {
      // event.dataTransfer.setData("Text", event.target.id);
      // 被拖放者
      data.drag.currentId = parseInt(event.target.getAttribute('id'))
    }
    const onDrop = (event: any) => {
      event.preventDefault()
      event.stopPropagation()
      
      data.drag.targetId = parseInt(getTargetId(event.target) as string)
    }

    watch(()=>data.bookmarks, (newVal)=>{
      if (newVal) {
        data.bookmarks.map((elem)=>{
          // console.log(elem)
          if (elem.url) {
            let index = elem.url.indexOf('/')
            if (index == elem.url.length - 1) {
              elem.icon = `${elem.url}favicon.ico`
            } else {
              elem.icon = `${elem.url}/favicon.ico`
            }
          }
          return elem
        })
      }
    }, {deep: true})
    watch(()=>data.drag.targetId, (newVal)=>{
      if (data.drag.currentId != -1 && data.drag.targetId != -1) {
        console.log(data.drag)
        // 交换位置
        let currentItemIndex = -1
        let targetItemIndex = -1
        for (let i=0;i<data.bookmarks.length;i++) {
          if (data.bookmarks[i].id === data.drag.currentId) currentItemIndex =i
          if (data.bookmarks[i].id === data.drag.targetId) targetItemIndex = i
        }
        // 两标签排序对调，再重新获取标签
        // 插入
        if (currentItemIndex != -1 && targetItemIndex != -1) {
          const tempList = [] as any[]
          Object.assign(tempList, data.bookmarks)
          data.bookmarks = []
          const temp = tempList.splice(currentItemIndex, 1)[0]
          // console.log(temp)
          for (let j=0;j<tempList.length;j++) {
            const bookmarkItem = tempList[j]
            if (bookmarkItem.id === data.drag.targetId) {
              data.bookmarks.push(temp)
            }
            data.bookmarks.push(bookmarkItem)
          }
        }
        data.drag = {
          currentId: -1,
          targetId: -1
        }
        // 交换
        // if (currentItem != -1 && targetItem != -1) {
        //   const temp = data.bookmarks[currentItem]
        //   data.bookmarks[currentItem] = data.bookmarks[targetItem]
        //   data.bookmarks[targetItem] = temp
        // }
        // console.log(data.bookmarks)
      }
    }, {deep: true})

    onMounted(()=>{
      getBookmarks()
    })

    return {
      ...toRefs(data),
      onClickBookmark,
      addBookmark,
      onClickAdd,
      allowDrop,
      onDrag,
      onDrop,
      onBookmarkDelete
    }
  }
})

</script>
<style>
.bookmark {
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
}
.bookmark-add-btns {
  text-align: right;
}
.bookmark-list {
  flex: 1;
  max-height: 600px;
  overflow: auto;
}
.bookmark-item {
  border-bottom: 1px solid var(--van-gray-2);
}
.bookmark-item-icon {
  display: flex;
  align-items: center;
  margin-right: 4px;
}
.bookmark-item-img {
  display: flex;
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
.bookmark-item-img img {
  width: 100%;
  height: 100%;
}
.bookmark-act-bnts {
}
.bookmark-item-btn {
  cursor: pointer;
  margin-left: 6px;
}
.bookmark-item-open {
  color: var(--van-blue);
}
.bookmark-item-delete {
  color: var(--van-red);
}
.bookmark-dialog-body {
  padding: 6px 0;
}
</style>
