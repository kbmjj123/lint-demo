import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import account from './modules/account'
import getters from './getters'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    account,
  },
  getters,
})
