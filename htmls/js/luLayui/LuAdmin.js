layui.define(['LuHeader', 'LuSideBar'], function (exports) {
  const $ = layui.$
  const LuHeader = layui.LuHeader
  const LuHeaderQL = layui.LuHeaderQL
  const LuSideBar = layui.LuSideBar
  const LuBodyContentTemplate = layui.LuBodyContentTemplate

  class LuAdmin {
    constructor(opts) {
      if (!opts) return
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
      this.luBodyContentTemplate.renderBodyContent({ href, title, animation: this.bodyAnimation }).then(() => $lulib.contentLoadRemove())
    }

    deleteLoader() {
      $('.loader-content').fadeOut()
    }
  }

  class LuAdminQL extends LuAdmin{
    constructor (options) {
      super()
      this.options = options
      this.username = options.username
      this.loadingTime = options.loadingTime
      this.projectList = options.projectList
      this.bodyAnimation = options.bodyAnimation
      this.weather = options.weather
      this.init()
    }

    async init () {
      await $lulib.delay(this.loadingTime)
      new LuHeaderQL(this.username, this.projectList, this.weather)
      this.deleteLoader()
    }
  }
  exports('LuAdmin', LuAdmin)
  exports('LuAdminQL', LuAdminQL)
})
