layui.define([], exports => {

  class LuHeader {
    init (opts) {
      console.log(opts)
    }
  }

  class LuAdmin {
    constructor () {
      this.luHeader = new LuHeader()
    }
  }

  exports('LuAdmin', new LuAdmin)
})
