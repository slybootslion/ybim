layui.define(['LuHeader', 'LuSideBar'], function (exports) {
  const $ = layui.$
  const LuHeader = layui.LuHeader
  const LuSideBar = layui.LuSideBar

  class LuAdmin {

    async init (options) {
      this.options = options
      const { loadingTime, projectName, weather, username, sideBarPath } = this.options
      await $lulib.delay(loadingTime)
      await (new LuHeader()).init({ projectName, weather, username })
      await (new LuSideBar()).init(sideBarPath)
      this.deleteLoader()
    }

    deleteLoader () {
      $('.loader-content').fadeOut()
    }
  }

  exports('LuAdmin', LuAdmin)
})
