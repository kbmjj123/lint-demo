export default {
  number: /^([0-9](\.[0-9]+)?|[1-9][0-9]+(\.[0-9]+)?)$/, // 验证数字
  mobile: /^(((1[0-9][0-9]{1}))+\d{8})$/, // 验证手机号码
  email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, // 验证邮箱
  zipcode: /^[0-9]{6}$/, // 验证邮编
}
