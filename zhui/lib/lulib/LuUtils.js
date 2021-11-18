layui.define(exports => {

  const dayjs = layui.dayjs

  class LuUtils {
    getFormatTime (formatStr = 'YYYY年MM月DD日 HH:mm:ss', date = new Date()) {
      return dayjs(date).format(formatStr)
    }
  }

  const luUtils = new LuUtils()
  layui.luUtils = luUtils
  exports('luUtils', luUtils)
})
