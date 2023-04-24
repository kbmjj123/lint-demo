const env = process.env.NODE_ENV || 'development'

const debug = env === 'development'
let baseUrl = 'http://apptest.zhidianlife.com/csmc-mall-all' //接口请求地址
// api请求地址根域名
switch (env) {
  case 'development':
    baseUrl = 'https://apptest.zhidianlife.com/csmc-mall-all'
    break
  case 'production':
    baseUrl = 'https://app.zhidianlife.com/csmc-mall-all'
    break
}

export default {
  env,
  debug,
  baseUrl,
  cashTarget: 'zd_mall_yunying_',
  systemInfo: {},
}
