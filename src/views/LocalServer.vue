<template>
  <div class='local-server'>
    <status-bar :status="status.value">
        <template #default>
          本地服务器状态：{{ status.name }}
        </template>
      </status-bar>
    <div class="local-server-flush">
      <van-button class="lsr-flush" type="primary" size="small" :disabled="loading" @click="getLocalServerStatus">
        刷新状态
      </van-button>
    </div>
    <div class="local-server-config" v-if="config">
      <my-card title="本地服务器配置">
        <template #default>
          <div class="local-server-configs">
            <van-cell-group inset>
              <van-field v-model="config.port" type="number" label="服务器端口号" placeholder="请输入端口号" />
              <div class="lsc-auto">
                <span>默认开启:</span>
                <van-switch class="lsc-switch" :disabled="loading" active-value="1" inactive-value="0" v-model="config.auto_run" size="20px"/>
              </div>
            </van-cell-group>
            <div class="local-server-save">
              <van-button type="primary" size="small" :disabled="loading" @click="saveServerConfig">保存配置</van-button>
            </div>
            <div class="local-server-save-ps">
              <span>* 保存配置后重启生效！</span>
            </div>
          </div>
        </template>
      </my-card>
      <div class="lsc-btns">
        <van-button class="lscb-item"
        size="small"
        :type="status.value === '1'? 'danger':'success'"
        :disabled="loading"
        @click="reloadServer(status.value)"
        >
          {{ status.value === '1'? '停止':'启动'}}
        </van-button>
        <van-button class="lscb-item" type="warning" size="small" :disabled="loading" @click="reloadServer('2')">重启</van-button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/07 星期天 13:48:39
 ** description: ..
*/
import { ElectronApi } from '@/utils/ElectronApi'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import MyCard from '@/components/MyCard.vue'
import Util from '@/utils/Util'
import StatusBar from '@/components/StatusBar.vue'

export default defineComponent({
  name: '',
  components: {
    MyCard, StatusBar
  },
  setup () {
    const data = reactive({
      loading: false,
      status: {
        value: '-1',
        name: '未知',
        color: 'var(--van-orange)'
      },
      config: {} as any
    })

    const getLocalServerStatus = async () => {
      data.loading = true
      const status: string = await ElectronApi.getServerStatus()
      if (status === '1') {
        data.status = {
          value: '1',
          name: '正在运行',
          color: 'var(--van-green)'
        }
      } else if (status === '0') {
        data.status = {
          value: '0',
          name: '已停止',
          color: 'var(--van-red)'
        }
      } else {
        data.status = {
          value: '-1',
          name: '未知',
          color: 'var(--van-orange)'
        }
      }
      getLocalServerConfig()
      data.loading = false
      Util.showToast('加载成功', 500)
    }
    const getLocalServerConfig = async () => {
      const serverConfig = await ElectronApi.getServerConfig()
      console.log(serverConfig)
      data.config = serverConfig
    }
    const reloadServer = (status: string) => {
      data.loading = true
      // console.log(data.config)
      console.log(status)
      if (!status) status = data.status.value
      ElectronApi.reloadServer(status).then((res: any)=>{
        if (res) getLocalServerStatus()
        else {
          Util.showToast('服务器重载失败！')
          data.loading = false
        }
      })
    }
    const saveServerConfig = () => {
      if (!Util.isValidPort(data.config.port)) {
        data.config.port = '16215'
        return
      }
      data.loading = true
      const config = {
        server_port: data.config.port,
        server_auto_run: data.config.auto_run
      }
      console.log(config)
      ElectronApi.saveServerConfig(config).then((res: any)=>{
        if (res) {
          setTimeout(()=>{
            getLocalServerStatus()
          }, 500)
        }
        else {
          data.loading = false
        }
      })
    }

    onMounted(()=>{
      getLocalServerStatus()
    })

    return {
      ...toRefs(data),
      reloadServer,
      getLocalServerStatus,
      saveServerConfig
    }
  }
})

</script>
<style>
.local-server-flush {
  text-align: left;
}
.local-server-config {
  margin-top: 10px;
}
.local-server-configs {
  text-align: left;
}
.local-server-save {
  text-align: right;
}
.local-server-save-ps {
  margin-top: 4px;
  font-size: 0.7rem;
  text-align: right;
  color: var(--van-gray-6);
}
.lsc-btns {
  text-align: right;
  margin-top: 20px;
  padding: 0 22px;
}
.lscb-item {
  margin-left: 10px;
}
.lsc-auto {
  display: flex;
  align-items: center;
  margin: 10px 18px;
  font-size: 14px;
}
.lsc-switch {
  margin-left: 10px;
}
</style>
