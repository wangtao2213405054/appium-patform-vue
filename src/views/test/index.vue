<script lang="ts" setup>
import { ref } from "vue"
import { ProjectInfoResponseData } from "@/api/business/types/project"
import Codemirror from "@/components/Codemirror/index.vue"

interface Props {
  modelValue: number
  placeholder?: string
  clearable?: boolean
}

const props = defineProps<Props>()
const projectList = ref<ProjectInfoResponseData[]>([])
const android = ref<string>(`/** 这只是一些常用的映射配置, 如需更多配置请参考 Appium 官方文档 */
/** 必填项 关键字<数据类型>  关键字描述 */
* deviceName<string>           设备信息 Android 通过 adb devices 查看
* appPackage<string>           要启动的 App 包名, 在提供连接后可自动获取
* appActivity<string>          要启动的 App 的 Activity, 如果为自动获取请在合适的位置调用 Activity
* platformName<string>         平台信息
* automationName<string>       使用的驱动 uiautomator2
* platformVersion<string>      系统的版本号
* appiumServerPort<number>     Appium Server 启动端口号 4723
app<string>                    安装包连接 可以是本地的绝对路径也可以是 url 但是必须以 .apk 结尾
noReset<boolean>               是否将 App 初始化
resetKeyboard<boolean>         重置输入法状态 和 unicodeKeyboard 参数一块使用
unicodeKeyboard<boolean>       支持中文输入
newCommandTimeout<number>      等待新命令的最长时间，超时后退出。默认是60s
autoGrantPermissions<boolean>  启动应用时自动授权 App 所需要的权限
settings[waitForIdleTimeout]<number>  在部分APP中, 获取页面数据特别慢, 添加此参数可缓解这个问题`)
const ios = ref<string>(`/** 这只是一些常用的映射配置, 如需更多配置请参考 Appium 官方文档 */
/** 必填项 关键字<数据类型>  关键字描述 */
* udid<string>                 设备的 udid
* bundleId<string>             要启动的应用的 bundleId, 当提供的链接为 .plist 时可自动获取
* platformName<string>         平台信息
* platformVersion<string>      系统的版本号
* appiumServerPort<number>     Appium Server 启动端口号 4723
app<string>                    安装包连接 可以是本地的绝对路径也可以是 url 但是必须以 .zip .ipa 结尾
autoAcceptAlerts<boolean>      运行脚本时如果碰到授权那么就会自动允许  注意： ios 14.0 以上版本会无法对地理位置进行授权
autoDismissAlerts<boolean>     运行脚本时如果碰到授权那么就会自动取消`)
</script>

<template>
  <div>
    <el-popover placement="right" :width="600" trigger="click" title="这是 Android 的映射参考配置 * 号为必填项">
      <template #reference>
        <el-button style="margin-right: 16px">测试啊</el-button>
      </template>
      <codemirror v-model="android" language="android" height="225px" />
    </el-popover>
  </div>
</template>

<style scoped lang="scss">

</style>
