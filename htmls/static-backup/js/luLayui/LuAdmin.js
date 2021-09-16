layui.define(['LuHeader', 'LuSideBar'], function (exports) {
  const $ = layui.$
  const LuHeader = layui.LuHeader
  const LuSideBar = layui.LuSideBar
  const LuBodyContentTemplate = layui.LuBodyContentTemplate

  class LuAdmin {
    constructor(opts) {
      this.options = opts
      this.username = opts.username
      this.loadingTime = opts.loadingTime
      this.projectList = opts.projectList
      this.sideBar = opts.sideBar
      this.bodyAnimation = opts.bodyAnimation
      this.luBodyContentTemplate = new LuBodyContentTemplate()
      this.init()
    }

    async init() {
      await $lulib.delay(this.loadingTime)
      new LuHeader(this.username, this.projectList)
      new LuSideBar(this.sideBar)
      this.deleteLoader()
      $lulib.eventBus.on('bodyContentChange', data => {
        this.renderBodyContent(data)
      })
    }

    renderBodyContent(data) {
      const { href, title } = data
      $lulib.methodProxy.offBodyEventFn()
      this.luBodyContentTemplate.renderBodyContent({ href, title, animation: this.bodyAnimation }).then(() => {
        $lulib.contentLoadRemove()
      })
    }

    deleteLoader() {
      $('.loader-content').fadeOut()
    }
  }

  exports('LuAdmin', LuAdmin)
})
