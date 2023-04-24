import axios from 'axios'
import { secret, qiniuServer, imageServer } from '@/config'
import semver from 'semver'
import regexp from './regexp'
import CryptoJS from 'crypto-js'
import { routers } from '@/router/router'

let util = {}

util.encrypt = (str) => {
  if (str === '') {
    return str
  }
  return CryptoJS.DES.encrypt(str, secret).toString()
}
util.decrypt = (str) => {
  if (str === '') {
    return str
  }
  return CryptoJS.DES.encrypt(str, secret).toString()
}

util.inOf = function (arr, targetArr) {
  let res = true
  arr.forEach((item) => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

// 用户权限对比
util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess)
  } else {
    return itAccess === currentAccess
  }
}

// 参数化
util.createdParam = function (data) {
  let arr = []
  for (let key in data) {
    arr.push(key + '=' + data[key])
  }
  return arr.join('&')
}

util.getRouterObjByName = (function () {
  const data = {}

  function delayer(routers) {
    if (!routers || !routers.length) {
      return
    }
    for (let item of routers) {
      data[item.name] = item
      delayer(item.children)
    }
  }

  delayer(routers)
  return function (name) {
    return data[name]
  }
})()

util.handleTitle = function (vm, item) {
  return item.title
}

util.formatSku = function (data) {
  let str = '-'
  let arr = []
  try {
    let obj = JSON.parse(data)
    for (let key in obj) {
      arr.push(key + ':' + obj[key])
    }
    str = arr.join(';   ') + ';'
  } catch (e) {
    console.error(e)
  }
  return str
}

util.toDefaultPage = function (route, next) {
  const item = util.getRouterObjByName(route.name)
  if (item.children && item.children.length) {
    next({
      replace: true,
      name: item.children[0].name,
    })
  } else {
    next()
  }
}

util.hasOneOf = (access, accessList) => {
  for (let i in accessList) {
    if (accessList[i] == access) {
      return true
    }
  }
  return false
}
// 格式黄时间整时分自动过滤秒
util.formatTimeAutofilterSecond = (time) => {
  let d = null
  let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  if (time instanceof Date) {
    d = time
  } else if (typeof time === 'string') {
    if (userAgent.indexOf('Safari') > -1) {
      time = time.replace(/-/g, '/')
    }
    d = new Date(time)
  }
  if (d.getSeconds() === 0) {
    return util.formatTime(d.getTime(), 'yyyy-mm-dd h:i')
  } else {
    return util.formatTime(d.getTime(), 'yyyy-mm-dd h:i:s')
  }
}

// 格式化时间
util.formatTime = (time, formatStr) => {
  let d = null
  if (time instanceof Date) {
    d = time
  } else {
    d = new Date(parseInt(time))
  }

  return formatStr.replace(/[a-z]+/g, (res) => {
    switch (res.toLowerCase()) {
      case 'yyyy':
        return d.getFullYear()
      case 'yy':
        return d.getFullYear().toString().substr(2, 2)
      case 'mm':
        return zeroize(getMonth(d))
      case 'm':
        return getMonth(d)
      case 'dd':
        return zeroize(d.getDate())
      case 'd':
        return d.getDate()
      case 'h':
      case 'hh':
        return zeroize(d.getHours())
      case 'i':
      case 'ii':
        return zeroize(d.getMinutes())
      case 's':
      case 'ss':
        return zeroize(d.getSeconds())
    }
  })
}

// 深拷贝对象
util.deepCopy = (data) => {
  let obj = {}
  try {
    obj = JSON.parse(JSON.stringify(data))
  } catch (e) {
    console.error(e + ',深拷贝失败！')
  }
  return obj
}

function zeroize(value) {
  if (value.toString().length === 1) {
    return '0' + value
  } else {
    return value
  }
}

function getMonth(d) {
  let month = d.getMonth()
  if (month == 12) {
    month = 1
  } else {
    month += 1
  }
  return month
}

// 获取指定的cookie值
util.getCookie = (name) => {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    if (start != -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end == -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return null
}

// 参数过滤函数
util.filterNull = (o) => {
  for (let key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = util.filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = util.filterNull(o[key])
    }
  }
  return o
}

// 自定义判断元素类型JS
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

// 图片尺寸以及质量压缩
util.imageMin = (url) => {
  if (url) {
    url = url.indexOf('https:') > 0 ? url : url.replace('http:', 'https:')
    let width = 750
    let quality = 40
    if (width <= 320) {
      quality = 50
    } else if (width > 320 && width < 414) {
      quality = 65
    } else {
      quality = 40
    }
    let imageMogr = '?imageMogr2/thumbnail/320x320!/quality/' + quality
    return url + imageMogr
  } else {
    return ''
  }
}
// 图片质量压缩处理
util.imageQPress = (url) => {
  if (url) {
    url = url.indexOf('https:') > 0 ? url : url.replace('http:', 'https:')
    let width = 750
    let quality = 70
    if (width <= 320) {
      quality = 50
    } else if (width > 320 && width < 414) {
      quality = 65
    } else {
      quality = 50
    }
    let imageMogr = '?imageMogr2/q/' + quality
    return url + imageMogr
  } else {
    return ''
  }
}

// 生成随机id
util.uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

util.dataURLtoBlobFile = (dataUrl) => {
  let arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${util.uuid()}.jpg`, { type: mime })
}

util.isNumber = (value) => {
  // 检测是不是数字
  if (regexp.number.test(value)) {
    return true
  } else {
    return false
  }
}

util.toFixedAmount = (amount) => {
  return typeof amount == Number ? amount.toFixed(2) : Number(amount).toFixed(2)
}
// 下载导出的文件
util.downloadExportExcel = (data, fileName) => {
  if (data) {
    let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
    let url = window.URL.createObjectURL(blob)
    const aEl = document.createElement('a')
    document.body.appendChild(aEl)
    aEl.href = url
    aEl.download = `${fileName}.xlsx`
    aEl.click()
    document.body.removeChild(aEl)
  }
}
// 下载图片资源
util.downloadImgFile = (path) => {
  if (path) {
    let aImg = document.createElement('a')
    document.body.appendChild(aImg)
    aImg.href = path
    aImg.download = `${util.formatTime(new Date(), 'yyyy-mm-dd hh-ii-ss')}.jpg`
    aImg.click()
    document.body.removeChild(aImg)
  }
}
// 获取链接中的参数信息
util.getUrlParam = (name) => {
  return (
    (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
      decodeURIComponent(location.href)
    ) || [''])[1].replace(/\+/g, '%20') || null
  )
}
//超出指定的长度，用...代替
util.formatWrite = (str, len = 25) => {
  if (str.length < len) {
    return str
  }
  str = str.substring(0, len) + '...'
  return str
}
util.dateFormat = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  let o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  let week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d',
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
//将字符串转成时间戳
util.stringToTimestamp = (date) => {
  let time = date.substring(0, 19)
  time = time.replace(/-/g, '/')
  return new Date(time).getTime()
}
export default util
