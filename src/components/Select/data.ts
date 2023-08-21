export interface DictItem {
  type?: "" | "danger" | "warning" | "success" | "info" | undefined
  value: string | number | boolean
  name: string
  mold?: string
}

type Dict = {
  [key: string]: DictItem[]
}

/** 这是一些不需要调用接口及可使用的字典对象 */
export const dict: Dict = {
  platform: [
    { value: "web", mold: "selenium", name: "Web" },
    { value: "android", mold: "appium", name: "Android" },
    { value: "ios", mold: "appium", name: "iOS" }
  ],
  priority: [
    { value: 0, name: "P0", type: "danger" },
    { value: 1, name: "P1", type: "warning" },
    { value: 2, name: "P2", type: "success" },
    { value: 3, name: "P3", type: "" }
  ],
  select: [
    { value: "Custom", name: "自定义数据选择器" },
    { value: "DataType", name: "数据类型选择器" },
    { value: "Boolean", name: "布尔选择器" },
    { value: "Element", name: "元素选择器" },
    { value: "Api", name: "接口选择器" },
    { value: "ElementIndex", name: "元素位置选择器" },
    { value: "Operation", name: "运算符选择器" }
  ],
  dataType: [
    { value: "Integer", name: "整数" },
    { value: "String", name: "字符串" },
    { value: "Float", name: "浮点数/小数" }
  ],
  caseStatus: [
    { value: 0, name: "失败", type: "danger" },
    { value: 1, name: "成功", type: "success" },
    { value: 2, name: "跳过", type: "warning" }
  ],
  masterStatus: [
    { value: true, name: "启用" },
    { value: false, name: "禁用" }
  ],
  workerStatus: [
    { value: 0, name: "空闲", type: "success" },
    { value: 1, name: "任务中", type: "" },
    { value: 2, name: "异常", type: "danger" },
    { value: 3, name: "停止", type: "info" },
    { value: 4, name: "离线", type: "info" }
  ]
}
