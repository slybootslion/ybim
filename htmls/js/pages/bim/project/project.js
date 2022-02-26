layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuUpload = layui.LuUpload

  class PageTemplate {
    list (data) {
      let h = ''
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        h += `<div class="project-item">
        <div class="left">
          <img src="${item.i10}" alt="" class="pic">
          <button class='layui-btn'>进入项目</button>
        </div>
        <div class="right">
          <div class="title">
            <h3 class="txt">${item.i1}</h3>
            <div class="btn-box">
            <span class="edit btn">
              <span class="iconfont icon-bianji"></span>
              <span>编辑</span>
            </span>
            <span class="del btn">
              <span class="iconfont icon-shanchu1"></span>
              <span>删除</span>
            </span>
            </div>
          </div>
          <div class="info-box">
            <div class="info-item">
              <span class="label">类型：</span>
              <span>${item.i3}</span>
            </div>
            <div class="info-item">
              <span class="label">负责人：</span>
              <span>${item.i4}</span>
            </div>
            <div class="info-item">
              <span class="label">业主：</span>
              <span>${item.i5}</span>
            </div>
            <div class="info-item">
              <span class="label">设计：</span>
              <span>${item.i6}</span>
            </div>
            <div class="info-item">
              <span class="label">施工：</span>
              <span>${item.i7}</span>
            </div>
            <div class="info-item">
              <span class="label">监理：</span>
              <span>${item.i8}</span>
            </div>
            <div class="info-item">
              <span class="label">时间：</span>
              <span>${item.i2}</span>
            </div>
          </div>
          <div class="desc-box">
            <span class="label">项目描述：</span>
            <span>${item.i9}</span>
          </div>
        </div>
      </div>`
      }
      return h
    }
  }

  let luInnerHeader
  ;(async () => {
    renderInnerHeader()
    await renderList()
  })()

  function renderInnerHeader () {
    luInnerHeader = new LuInnerHeader({
      title: '项目管理',
      rightHtml: [{ txt: '新建项目' }],
    })
  }

  const pt = new PageTemplate

  async function renderList () {
    const listData = await $lulib.getMockData('/htmls/mock/bim/projectListData.json', 1, '', false)
    const h = pt.list(listData)
    $("#projectContainer").html(h)
  }


})
