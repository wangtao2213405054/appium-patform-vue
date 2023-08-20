interface DictItem {
  hint: string
  default: string
}

type Mapping = {
  [Key: string]: DictItem
}

export const mapping: Mapping = {
  Android: {
    hint: `/** 这是 Android 的映射配置, 如需更多配置请参考 Appium 官方文档 */
/** 必填项 关键字<数据类型>  关键字描述 */
* mockProxy<boolean>           此设备是否进行Mock
* deviceName<string>           设备信息 Android 通过 adb devices 查看
* appPackage<string>           要启动的 App 包名, 在提供连接后可自动获取
* appActivity<string>          要启动的 App 的 Activity, 如果为自动获取请在合适的位置调用 Activity
* platformName<string>         平台信息
* automationName<string>       使用的驱动 uiautomator2
* platformVersion<string>      系统的版本号
* appiumServerPort<number>     Appium Server 启动端口号 4723
app<string>                    安装包连接 可以是本地的绝对路径也可以是 url 但是必须以 .apk 结尾
noReset<boolean>               是否将 App 初始化
httpProxyPort<number>          Mock 服务器的代理端口号, 当 mockProxy 为 true 时填写
resetKeyboard<boolean>         重置输入法状态 和 unicodeKeyboard 参数一块使用
unicodeKeyboard<boolean>       支持中文输入
newCommandTimeout<number>      等待新命令的最长时间，超时后退出。默认是60s
autoGrantPermissions<boolean>  启动应用时自动授权 App 所需要的权限
settings[waitForIdleTimeout]<number>  在部分APP中, 获取页面数据特别慢, 添加此参数可缓解这个问题`,
    default: `{
  "platformName": "android",
  "deviceName": null,
  "appPackage": null,
  "appActivity": null,
  "automationName": "uiautomator2",
  "platformVersion": null,
  "appiumServerPort": 4723,
  "mockProxy": false
}`
  },
  iOS: {
    hint: `/** 这是 iOS 的映射配置, 如需更多配置请参考 Appium 官方文档 */
/** 必填项 关键字<数据类型>  关键字描述 */
* udid<string>                 设备的 udid
* bundleId<string>             要启动的应用的 bundleId, 当提供的链接为 .plist 时可自动获取
* mockProxy<boolean>           此设备是否进行Mock
* platformName<string>         平台信息
* platformVersion<string>      系统的版本号
* appiumServerPort<number>     Appium Server 启动端口号 4723
* webDriverAgentPort<number>   iOS WebDriverAgent 端口号
app<string>                    安装包连接 可以是本地的绝对路径也可以是 url 但是必须以 .zip .ipa
httpProxyPort<number>          Mock 服务器的代理端口号, 当 mockProxy 为 true 时填写
autoAcceptAlerts<boolean>      运行脚本时如果碰到授权那么就会自动允许  注意： ios 14.0 以上版本会无法对地理位置进行授权
autoDismissAlerts<boolean>     运行脚本时如果碰到授权那么就会自动取消`,
    default: `{
  "platformName": "ios",
  "udid": null,
  "bundleId": null,
  "platformVersion": null,
  "mockProxy": false,
  "appiumServerPort": 4723,
  "webDriverAgentPort": 8100
}`
  },
  Web: {
    hint: `/** 这是 Web 的映射配置, 为了统一管理配置映射, Selenium 也参考了 Appium 的配置, 当然这些参数非常简单 */
/** 必填项 关键字<数据类型>  关键字描述 */
* url<string>                  要启动的 Web 页面链接
* browser<string>              启动的浏览器 Chrome or Firefox
* mockProxy<boolean>           此设备是否进行Mock
* platformName<string>         平台信息
headless<string>               是否启用无头模式 参数为: --headless
httpProxyPort<number>          Mock 服务器的代理端口号, 当 mockProxy 为 true 时填写`,
    default: `{
  "platformName": "web",
  "url": "",
  "browser": "Chrome",
  "mockProxy": false
}`
  }
}
