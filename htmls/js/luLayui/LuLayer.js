layui.define([], function (exports) {
  const $ = layui.jquery
  const layer = layui.layer

  const areaSize = {
    b: '1000px',
    m: '800px',
    s: '600px',
  }

  class LuLayer {
    constructor (config) {
      this.config = config
      if (config?.areaSize) {
        config.area = Object.keys(areaSize).includes(config.areaSize) ? areaSize[config.areaSize] : areaSize.b
      }
      this.layerIdx = null
      this.open()
    }

    open () {
      const config = {
        type: 1,
        title: '标题',
        closeBtn: true,
        area: areaSize.b,
        shade: 0.6,
        id: 'layerId' + $lulib.randomStr(3),
        btnAlign: 'c',
        moveType: 1, //拖拽
        resize: false,
        ...this.config,
      }
      this.layerIdx = layer.open(config)
      // 修复框架显示bug
      $('.layui-layer-ico.layui-layer-close.layui-layer-closetrue')
        .css({
          background: 'none',
          fontSize: '16px',
        })
        .html('×')
    }

    close (idx = this.layerIdx) {
      layer.close(idx)
    }

    static confirm (content, fn, title = '注意', icon = 7) {
      layer.confirm(content, { icon, title }, function (index) {
        fn && fn()
        layer.close(index)
      })
    }
  }

  exports('LuLayer', LuLayer)
})
