/**
 * @date 2019-11-01
 * @auth xuyongsen
 * @desc 请求类
 */
import axios from 'axios'
import store from '@/store'
import { router as routers } from '@/router'
import $cookies from '@/utils/cookie'
import { Modal } from 'view-design'

const addErrorLog = (errorInfo) => {
  const {
    statusText,
    status,
    request: { responseURL },
  } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL,
  }
  if (!responseURL.includes('save_error_logger_url'))
    store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.baseUrl
    this.loginBaseUrl = baseUrl.loginBaseUrl
    this.queue = {}
  }
  getInsideConfig(headers) {
    return {
      baseURL: this.baseUrl,
      //特殊情况下可自行配置请求头,否则使用默认的
      headers: headers || {
        token: $cookies.get('token'),
        app_key: 'pc', //临时
        sign: '', //临时签名
        terminalId: '006', //临时id 后续再修改
        zdAppId: 'zdIFZ9L4',
      },
    }
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      //Spin.hide()
    }
  }
  // canRun=true
  // lastTime(data){
  //     const _this=this
  //     if(this.canRun){
  //         Message.error(data.desc||'网络或服务器异常，请稍后再试！');
  //         this.canRun=false
  //     }
  //     setTimeout(function(){
  //         _this.canRun = true;
  //     },1000);
  // }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        //添加全局的loading...
        if (!Object.keys(this.queue).length) {
          //Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        this.destroy(url)
        const { data, status, headers } = res
        const isType =
          headers['content-type'] == 'application/vnd.ms-excel;charset=utf-8' //判断请求类型
        // console.log(res,'响应拦截',isType)
        //处理各种异常
        if (data.result === '-999') {
          store.dispatch('logoutAction')
          Modal.warning({
            title: '提示',
            content: '当前登录信息已过期，请重新登录',
            onOk: () => {
              routers.push('/login')
            },
          })
        } else {
          // if(data.result=='000'||isType){
          return { data, status, isType }
          // }else{
          //     this.lastTime(data)
          //     // Message.error(data.desc||'网络或服务器异常，请稍后再试！');
          //     return Promise.reject(new Error(data.desc || 'Error'))
          // }
        }
      },
      (error) => {
        this.destroy(url)
        let errorInfo = error.response
        if (!errorInfo) {
          const {
            request: { statusText, status },
            config,
          } = JSON.parse(JSON.stringify(error))
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url },
          }
        }
        addErrorLog(errorInfo) //可上传异常日志操作
        return Promise.reject(error)
      }
    )
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(options.headers), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
