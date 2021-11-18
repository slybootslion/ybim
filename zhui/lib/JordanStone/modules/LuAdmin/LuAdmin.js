jordanstone.define('LuAdmin', exports => {
  class LuHeader {

  }

  class LuPageBody {

  }

  class LuAdmin {
    constructor (opts) {
      this.LuHeader = LuHeader
      this.LuPageBody = LuPageBody
    }
  }

  exports('LuAdmin', LuAdmin)
})
