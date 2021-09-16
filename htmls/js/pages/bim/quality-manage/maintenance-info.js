layui.use(['LuCommonTemplate', 'LuUtilsTemplate'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuLightBox = layui.LuLightBox

  class PageTemplate {
    constructor() {
      this.dict = { i1: '所属区域', i2: '检查人', i3: '状态', i4: '检查结果' }
      this.dict1 = { i1: '' }
    }

    _renderInfo(data) {
      let h = ``
      Object.keys(this.dict).forEach(keys => {
        h += `<div class='desc-list-item fl'>
                <span>${this.dict[keys]}：</span>
                <span>${data[keys]}</span>
              </div>`
      })
      return `<h4 class='details-header'>${data.i1}</h4>
              <div class='desc-list'>${h}</div>`
    }

    _renderDetailImgHtml(data) {
      let html = ''
      for (let i = 0; i < data.length; i++) {
        html += `<img src='${data[i]}' class='list-pic light-box'>`
      }
      return html
    }

    _detailTemplate1(data) {
      const html = this._renderDetailImgHtml(data.f5)
      const resClass = data.f3 === '正常' ? 'green' : 'red'
      const h =
        data.f3 === '正常'
          ? ''
          : `<div class='content-list'>
                                            <div class='list-title'>
                                              隐患等级:
                                            </div>
                                            <div class='list-content'>
                                              <span class='red'>${data.f7}</span>
                                            </div>
                                          </div>
                                          <div class='content-list'>
                                            <div class='list-title'>
                                              整改人:
                                            </div>
                                            <div class='list-content'>
                                              <span>${data.f6}</span>
                                            </div>
                                          </div>
                                          <div class='content-list'>
                                            <div class='list-title'>
                                              完成时间:
                                            </div>
                                            <div class='list-content'>
                                              <span>${data.f8}</span>
                                            </div>
                                          </div>`
      return `<div class='details-item'>
                <div class='item-title'>
                  <div class='left'>
                    <div class='icon-box green'>
                      <span class='iconfont icon-anquanyuanwudi'></span>
                      <span class='txt'>${data.f1}</span>
                    </div>
                    <div class='date-box'>${data.f2}</div>
                  </div>
                  <div class='rollup-icon'>
                    <span class='iconfont icon-shouqi'></span>
                    <span class='txt'>收起</span>
                  </div>
                </div>
                <div class='item-content'>
                  <div class='content-list'>
                    <div class='list-title'>
                      检查结果:
                    </div>
                    <div class='list-content'>
                      <span class='${resClass}'>${data.f3}</span>
                    </div>
                  </div>
                  <div class='content-list'>
                    <div class='list-title'>
                      内容描述:
                    </div>
                    <div class='list-content'>
                      <span>${data.f4}</span>
                    </div>
                  </div>
                  <div class='content-list'>
                    <div class='list-title'>
                      现场照片:
                    </div>
                    <div class='list-content'>
                      <div class='lightBox'>
                        ${html}
                      </div>
                    </div>
                  </div>
                  ${h}
                  <div class='content-list'>
                    <div class='list-title'>
                      检查人:
                    </div>
                    <div class='list-content'>
                      <span>${data.f9}</span>
                    </div>
                  </div>
                </div>
              </div>`
    }

    _detailTemplate2(data) {
      const html = this._renderDetailImgHtml(data.f5)
      return `<div class='details-item'>
                <div class='item-title'>
                  <div class='left'>
                    <div class='icon-box blue fl'>
                      <span class='iconfont icon-shigongxiangmu'></span>
                      <span class='txt'>整改人</span>
                    </div>
                    <div class='date-box fl'>${data.f2}</div>
                  </div>
                  <div class='rollup-icon'>
                    <span class='iconfont icon-shouqi'></span>
                    <span class='txt'>收起</span>
                  </div>
                </div>
                <div class='item-content'>
                  <div class='content-list clearFix'>
                    <div class='list-title fl'>
                      内容描述:
                    </div>
                    <div class='list-content fl'>
                      <span>${data.f4}</span>
                    </div>
                  </div>
                  <div class='content-list clearFix'>
                    <div class='list-title fl'>
                      现场照片:
                    </div>
                    <div class='list-content fl'>
                      <div class='lightBox'>
                        ${html}  
                      </div>
                    </div>
                  </div>
                  <div class='content-list clearFix'>
                    <div class='list-title fl'>
                      检查人:
                    </div>
                    <div class='list-content fl'>
                      <span>${data.f6}</span>
                    </div>
                  </div>
                </div>
              </div>`
    }

    _renderDetails(data) {
      let i = 0
      const len = data.length
      let h = ''
      for (; i < len; i++) {
        const item = data[i]
        if (item.f1 === '安全员') {
          h += this._detailTemplate1(item)
        }
        if (item.f1 === '整改人') {
          h += this._detailTemplate2(item)
        }
      }
      return h
    }

    renderDesc (data) {
      const infoData = { i1: data.i1, i2: data.i2, i3: data.i3, i4: data.i4, i5: data.i5 }
      const hInfo = this._renderInfo(infoData)
      const hDetails = this._renderDetails(data.desc)
      let html = `<div class='list-box details-vi'>
        ${hInfo}
        ${hDetails}
        </div>
      `
      return html
    }
  }
  const pt = new PageTemplate()

  let params, luInnerHeader, luLightBox = new LuLightBox()
  ;(async () => {
    initParams()
    renderInnerHeader()
    await renderBodyInfo()
  })()

  function initParams() {
    params = $lulib.getHashParams()
  }

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '施工质量',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function renderBodyInfo () {
    // mock
    const id = params.id
    const data = await $.getJSON('/htmls/mock/bim/equipmentInfoData.json')
    const html = pt.renderDesc(data)
    $('.description-box').html(html)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack }])

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.rollup-icon', method: scrollMethod },
    { dom: 'body', domStr: '.light-box', method: showLightBox },
  ])

  function scrollMethod() {
    const $this = $(this)
    const itemContent = $this.parents('.details-item').find('.item-content')
    const isShow = itemContent.css('display') === 'block'
    if (isShow) {
      itemContent.slideUp()
      $(this).addClass('active').find('.txt').html('展开')
    } else {
      itemContent.slideDown()
      $(this).removeClass('active').find('.txt').html('收起')
    }
  }

  function showLightBox() {
    const $this = $(this)
    const current = $this.attr('src')
    const urlList = []
    $this
      .parents('.lightBox')
      .find('.light-box')
      .each((_, item) => urlList.push(item.src))
    luLightBox.openLightBox(current, urlList)
  }
})
