layui.define([], function (exports) {
  const $ = layui.jquery
  const util = layui.util
  const laydate = layui.laydate

  class LuUtilsTemplate {
    static renderSelectOptions(data, selectedStr, titleStr = 'title', valStr = 'id') {
      let html = "<option value=''>请选择</option>"
      $(data).each((_, item) => {
        item[titleStr] === selectedStr
          ? (html += `<option selected
                              value='${item[valStr]}'>${item[titleStr]}</option>`)
          : (html += `<option value='${item[valStr]}'>${item[titleStr]}</option>`)
      })
      return html
    }

    static selectDateDoubleTemplate(opts = {}) {
      const startInputId = opts.startInputId || 'dateStartInput'
      const endInputId = opts.endInputId || 'dateEndInput'
      const startName = opts.startName || 'sDate'
      const endName = opts.endName || 'eDate'
      const startLabel = opts.startLabel || '开始时间'
      const endLabel = opts.endLabel || '结束时间'
      const endEleStr = `<input type='text' name='${endName}' autocomplete='off' class='layui-input' id='${endInputId}' disabled placeholder='请选择结束时间'>`

      const dateEndBox = $lulib.randomStr() + 'dateEndBox'

      const html = `
        <div class='layui-inline'>
          <label class='layui-form-label'>${startLabel}：</label>
          <div class='layui-input-inline inner-input-w155'>
            <input type='text'
                   name='${startName}'
                   autocomplete='off'
                   class='layui-input'
                   id='${startInputId}'
                   placeholder='请选择开始时间'>
          </div>
        </div>
        <div class='layui-inline'>
          <label class='layui-form-label'>${endLabel}：</label>
          <div class='layui-input-inline inner-input-w155 ${dateEndBox}'>
            ${endEleStr}
          </div>
        </div>
      `
      return { html, domTag: { startInputId, endInputId, dateEndBox, endEleStr } }
    }

    static selectDateTemplate(opts) {
      const selectDateId = opts.inputId || 'dateInput'
      const html = `<div class='layui-inline'>
                      <label class='layui-form-label'>${opts.label}：</label>
                      <div class='layui-input-inline inner-input-w155'>
                        <input type='text'
                               name='${opts.name}'
                               autocomplete='off'
                               class='layui-input'
                               id='${selectDateId}'
                               placeholder='请选择'>
                      </div>
                    </div>`
      return { html, domTag: { selectDateId } }
    }

    static selectDateMonthTemplate(opts = {}) {
      const selectDateId = opts.inputId || 'dateMoInput'
      const html = `<div class='layui-inline'>
                      <label class='layui-form-label'>${opts.label}：</label>
                      <div class='layui-input-inline inner-input-w155'>
                        <input type='text'
                               name='${opts.name}'
                               autocomplete='off'
                               class='layui-input'
                               id='${selectDateId}'
                               placeholder='请选择'>
                      </div>
                    </div>`
      return { html, domTag: { selectDateId } }
    }

    static mouseMove($el, pElStr) {
      let move = false
      let x, y
      let ele

      $el.mousedown(function (e) {
        move = true
        ele = $(this).parents(pElStr)
        x = e.pageX - parseInt(ele.css('left'))
        y = e.pageY - parseInt(ele.css('top'))
      })

      $(document)
        .mousemove(function (e) {
          if (move) {
            const docX = e.pageX - x
            const docY = e.pageY - y
            ele.css({
              top: docY,
              left: docX,
            })
          }
        })
        .mouseup(function () {
          move = false
        })
    }
  }

  class LuLightBox {
    constructor(opts = {}) {
      this.id = $lulib.randomStr(5)
      this.options = opts
      this.render()
    }

    render() {
      const zIndex = this.options.zIndex ? this.options.zIndex : 1000
      const h = `<style>
                  body .cover {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    position:fixed;
                    top: 0;
                    left: 0;
                    z-index: ${zIndex};
                    display: none;
                  }
                  body .cover .light-cover {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    padding: 0 100px;
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                  }
                  body .cover .light-cover button {
                    width: 50px;
                    height: 120px;
                    font-size: 30px;
                    font-weight: 700;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.6);
                    margin: 0 20px;
                  }
                  body .cover .light-cover .light-box-show {
                    flex: 1;
                    height: 80%;
                    background-position: center center;
                    background-size: auto;
                    background-repeat: no-repeat;
                    position: relative;
                  }
                  body .cover .light-cover .light-box-show .icon-guanbi {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 30px;
                    background-color: #fff;
                    cursor: pointer;
                    position: absolute;
                    right: -15px;
                    top: -15px;
                  }
                </style>
                <div class='cover' id='${this.id}'>
                  <div class='light-cover'>
                    <button class='light-left'><</button>
                    <div class='light-box-show'>
                      <i class='iconfont icon-guanbi'></i>
                    </div>
                    <button class='light-right'>></button>
                  </div>
                </div>`
      $('body').append(h)
      this.bindMethod()
    }

    bindMethod() {
      $(`#${this.id} .icon-guanbi`).on('click', () => {
        this.close()
      })
      $(`#${this.id} .light-left`).on('click', () => {
        this.prevPic()
      })
      $(`#${this.id} .light-right`).on('click', () => {
        this.nextPic()
      })
    }

    openLightBox(c, list) {
      this.list = list
      this.cIdx = list.findIndex(l => l === c)
      this._setCurPic()
      this._show()
    }

    close() {
      $(`#${this.id}`).hide()
    }

    prevPic() {
      if (this.cIdx <= 0) return
      this.cIdx--
      this._setCurPic()
    }

    nextPic() {
      if (this.cIdx >= this.list.length - 1) return
      this.cIdx++
      this._setCurPic()
    }

    _setCurPic() {
      $(`#${this.id} .light-box-show`).css({ backgroundImage: `url(${this.list[this.cIdx]})` })
    }

    _show() {
      $(`#${this.id}`).show()
    }
  }

  exports('LuUtilsTemplate', LuUtilsTemplate)
  exports('LuLightBox', LuLightBox)
})
