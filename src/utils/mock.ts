import Mock from "mockjs"


export const randomLastName = () => {
  return Mock.Random.cname().slice(0, 1)
}

export const randomChineseText = (options) => {
  const { max } = options
  return Mock.Random.csentence(max).slice(0, max)
}
