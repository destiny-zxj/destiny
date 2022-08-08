<template>
  <div class='settings'>
    <div class="settings-item settings-mysql">
      <my-card title="Mysql 配置">
        <template #default>
          <div class="settings-mysql-configs">
            <status-bar :status="status.mysql? '1':'0'">
              <template #default>
                状态：{{status.mysql? '连接成功':'连接失败'}}
              </template>
            </status-bar>
            <van-form @submit="onMysqlSubmit">
              <van-cell-group inset>
                <van-field
                  v-model="appConfig.mysql.host"
                  name="host"
                  label="主机名"
                  label-align="right"
                  placeholder="主机名"
                  :rules="[{ required: true, message: '请填写主机名' }]"
                />
                <van-field
                  v-model="appConfig.mysql.port"
                  type="number"
                  name="port"
                  label="端口号"
                  label-align="right"
                  placeholder="端口号"
                  :rules="[{ required: true, message: '请正确填写端口号' }]"
                />
                <van-field
                  v-model="appConfig.mysql.user"
                  name="user"
                  label="用户名"
                  label-align="right"
                  placeholder="用户名"
                  :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                  v-model="appConfig.mysql.password"
                  type="password"
                  name="password"
                  label="数据库密码"
                  label-align="right"
                  placeholder="数据库密码"
                  :rules="[{ required: true, message: '请填写数据库密码' }]"
                />
                <van-field
                  v-model="appConfig.mysql.database"
                  name="database"
                  label="数据库"
                  label-align="right"
                  placeholder="数据库"
                  :rules="[{ required: true, message: '请填写数据库名' }]"
                />
              </van-cell-group>
              <div class="card-btn" style="margin: 16px;">
                <van-button :disabled="loading" round block type="primary" native-type="submit">保存</van-button>
              </div>
            </van-form>
          </div>
        </template>
      </my-card>
    </div>
    <van-overlay z-index="1000" class="settings-loading" :show="showLoading">
      <div class="settings-loading">
        <van-loading color="var(--color-ft)" size="32px">正在连接数据库，请稍后...</van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script lang='ts'>
/*
 ** author: destiny_zxj
 ** datetime: 2022/08/07 星期天 13:50:32
 ** description: ..
*/
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import MyCard from '@/components/MyCard.vue'
import { ElectronApi } from '@/utils/ElectronApi'
import Util from '@/utils/Util'
import Res from '@/bgutils/Res'
import StatusBar from '@/components/StatusBar.vue'

export default defineComponent({
  name: '',
  components: {
    MyCard, StatusBar
  },
  setup () {
    const data = reactive({
      showLoading: false,
      loading: false,
      appConfig: {
        mysql: {} as any
      },
      status: {
        mysql: false
      }
    })
    const getMysqlStatus = () => {
      ElectronApi.getMysqlStatus().then((res: boolean) => {
        data.status.mysql = res
        getAppConfig()
      })
    }
    const getAppConfig = () => {
      ElectronApi.getAppConfig().then((res: any)=>{
        // console.log(res)
        if (res && res.mysql) data.appConfig.mysql = res.mysql
      })
    }
    const onMysqlSubmit = (values: any) => {
      // console.log(values)
      if (!Util.isValidPort(values.port) && data.appConfig.mysql) {
        data.appConfig.mysql.port = '3306'
        return
      }
      data.loading = true
      data.showLoading = true
      ElectronApi.saveAppConfig({
        mysql: {
          ...values
        }
      }).then((res: Res)=>{
        Util.showToast(res.msg, 1000)
        if (res.code !== 200) getAppConfig()
        data.loading = false
        data.showLoading = false
      })
    }

    onMounted(()=>{
      getMysqlStatus()
    })

    return {
      ...toRefs(data),
      onMysqlSubmit
    }
  }
})

</script>
<style>
.settings {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.settings-item {
  width: calc(50% - 5px);
  min-width: 300px;
  max-width: 400px;
}
.settings-mysql-configs .van-cell-group {
  margin: 0 !important;
}
.settings-loading {
  padding-top: 20%;
}
.card-btn {
  padding-left: 120px;
}
</style>
