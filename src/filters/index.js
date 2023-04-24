import util from '@/utils/util'
// 格式化时间
export function formatTime(createTime) {
  return util.formatTime(createTime, 'yyyy-mm-dd h:i:s')
}

// 格式华图片
export function imageCompress(url) {
  return util.imageQPress(url)
}

//格式化金额
export function formatAmount(amount) {
  return typeof amount == 'number'
    ? amount.toFixed(2)
    : Number(amount).toFixed(2)
}

export function imageMin(url) {
  return util.imageMin(url)
}
