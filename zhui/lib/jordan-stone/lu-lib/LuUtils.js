layui.define(exports => {
  const $ = layui.$

  class LuUtils {
    ajax (url, opts = {}, type = 'get') {
      return new Promise(resolve => {
        $.ajax({
          url, type,
          ...opts,
          success (data) {
            resolve(data)
          },
          error (xhr) {
            layer.msg('请求错误或功能页面不存在，稍后再试')
          }
        })
      })
    }
  }

  exports('LuUtils', new LuUtils)
})
