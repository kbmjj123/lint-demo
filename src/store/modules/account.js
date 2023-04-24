import Cookies from '@/utils/cookie'
import api from '@/api'

const account = {
  state: {
    userName: '', // 登录名
    token: '',
    isLogin: false, // 是否登录
    userId: '',
  },
  actions: {
    // 使用密码登陆
    loginByPassword({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        api.user
          .loginByPassword(userInfo)
          .then((res) => {
            if (res.result === '000') {
              Cookies.set('account', res.data.account)
              Cookies.set('token', res.data.token)
              Cookies.set('memberId', res.data.memberId)
              Cookies.set('haveShop', res.data.haveShop)
              window.localStorage.wmUserInfo = JSON.stringify({
                userId: res.data.memberId,
                userTag: '中后台',
                projectVersion: '1.0.0',
              })
              commit('SET_IS_LOGIN', true)
              commit('SET_TOKEN', res.data.token)
              commit('SET_MEMBER_ID', res.data.memberId)
            }
            resolve(res)
          })
          .catch((e) => reject(e))
      })
    },
    // 短信验证码登录
    loginByRandomCode({ commit, dispatch }, randomInfo) {
      return new Promise((resolve, reject) => {
        api.user
          .randomCodeLogin(randomInfo)
          .then((res) => {
            if ('000' === res.result) {
              Cookies.set('account', res.data.account)
              Cookies.set('token', res.data.token)
              Cookies.set('haveShop', res.data.haveShop)
              Cookies.set('memberId', res.data.memberId)
              window.localStorage.wmUserInfo = JSON.stringify({
                userId: res.data.memberId,
                userTag: '中后台',
                projectVersion: '1.0.0',
              })
              commit('SET_IS_LOGIN', true)
              commit('SET_TOKEN', res.data.token)
            }
            resolve(res)
          })
          .catch((e) => reject(e))
      })
    },
  },
  mutations: {
    SET_IS_LOGIN(state, flag) {
      state.isLogin = flag
      sessionStorage.setItem('isLogin', flag)
    },
    SET_TOKEN(state, value) {
      state.token = value
      sessionStorage.setItem('token', value)
    },
    LOGOUT(state, vm) {
      Cookies.remove('token')
      Cookies.remove('account')
      let theme = ''
      if (localStorage.theme) {
        theme = localStorage.theme
      }
      localStorage.clear()
      if (theme) {
        localStorage.theme = theme
      }
      window.location.reload()
    },
  },
}

export default account
