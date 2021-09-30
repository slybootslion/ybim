layui.define([], function (exports) {
  const $ = layui.$

  class LuSideBar {
    async init (path) {
      this.sidebarData = await $lulib.ajax(path, 'json')
      console.log(this.sidebarData)
    }

    renderSideBar () {

    }
  }

  exports('LuSideBar', LuSideBar)
})
