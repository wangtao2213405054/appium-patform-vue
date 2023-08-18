export interface DictItem {
  type?: "" | "danger" | "warning" | "success" | "info" | undefined
  id: string | number | boolean
  name: string
  mold?: string
}

type Dict = {
  [key: string]: DictItem[]
}

/** 这是一些不需要调用接口及可使用的字典对象 */
export const dict: Dict = {
  platform: [
    { id: "web", mold: "selenium", name: "Web" },
    { id: "android", mold: "appium", name: "Android" },
    { id: "ios", mold: "appium", name: "iOS" }
  ],
  priority: [
    { id: 0, name: "P0", type: "danger" },
    { id: 1, name: "P1", type: "warning" },
    { id: 2, name: "P2", type: "success" },
    { id: 3, name: "P3", type: "" }
  ],
  specials: [
    { id: false, name: "普通用例", type: "" },
    { id: true, name: "特殊用例", type: "success" }
  ],
  actions: [
    { id: true, name: "正常", type: "success" },
    { id: false, name: "废弃", type: "danger" }
  ],
  select: [
    { id: "Custom", name: "自定义数据选择器" },
    { id: "DataType", name: "数据类型选择器" },
    { id: "Boolean", name: "布尔选择器" },
    { id: "Element", name: "元素选择器" },
    { id: "Api", name: "接口选择器" },
    { id: "ElementIndex", name: "元素位置选择器" },
    { id: "Operation", name: "运算符选择器" }
  ],
  type: [
    { id: "None", name: "空值" },
    { id: "Integer", name: "整数" },
    { id: "String", name: "字符串" },
    { id: "Boolean", name: "布尔值" },
    { id: "Array", name: "数组/列表" },
    { id: "Object", name: "对象/字典" },
    { id: "Float", name: "浮点数/小数" }
  ],
  boolean: [
    { id: true, name: "True" },
    { id: false, name: "False" }
  ],
  logging: [
    { id: "DEBUG", name: "DEBUG" },
    { id: "INFO", name: "INFO" },
    { id: "ERROR", name: "ERROR" },
    { id: "WARNING", name: "WARNING" },
    { id: "CRITICAL", name: "CRITICAL" }
  ],
  operation: [
    { id: "=", name: "等于" },
    { id: "!=", name: "不等于" },
    { id: ">", name: "大于" },
    { id: ">=", name: "大于等于" },
    { id: "<", name: "小于" },
    { id: "<=", name: "小于等于" },
    { id: "in", name: "在...里面" },
    { id: "out", name: "不在...里面" }
  ],
  caseStatus: [
    { id: 0, name: "失败", type: "danger" },
    { id: 1, name: "成功", type: "success" },
    { id: 2, name: "跳过", type: "warning" }
  ],
  masterStatus: [
    { id: true, name: "启用" },
    { id: false, name: "禁用" }
  ],
  workerStatus: [
    { id: 0, name: "空闲", type: "success" },
    { id: 1, name: "任务中", type: "" },
    { id: 2, name: "异常", type: "danger" },
    { id: 3, name: "停止", type: "info" },
    { id: 4, name: "离线", type: "info" }
  ]
}
