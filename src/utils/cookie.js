// 注意：因为大部分平台使用了apptest.zhidianlife.com域名，导致同域名的cookie设置容易被覆盖，所以把js-cookie方法包装了一下(加上了别名属性)
import cookie from 'js-cookie';
import config from '@/config';

let cookieExtendsObj = {
    alias: config.cashTarget,
    get (key) {
        key = this.alias + key;
        return cookie.get(key);
    },
    set (key, value, attr = {}) {
        key = this.alias + key;
        return cookie.set(key, value, attr);
    },
    remove (key, attr = {}) {
        key = this.alias + key;
        return cookie.remove(key, attr);
    }
};

let cookieObj = new Proxy({}, {
    get: function (target, key, receiver) {
        if (cookieExtendsObj[key]) {
            return cookieExtendsObj[key];
        } else {
            return cookie[key];
        }
    },
    set: function (target, key, value, receiver) {
        if (cookieExtendsObj[key]) {
            return true;
        } else {
            return cookie[key] = value;
        }
    }
});
Object.assign(cookieObj, cookieExtendsObj);
export default cookieObj;
