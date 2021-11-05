layui.use(['LuCommonTemplate', 'echarts'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  let luSearchForm

  class PageTemplate {
    bridgeTemplate (data) {
      const { height } = $lulib.domWidthHeight('.bridge-box')
      const width = Number(data.width * height / data.height)
      return `<div class="bridge-pic" style="width: ${width}px; height: ${height - 10}px; background-image:url('${data.pic}');"></div>`
    }
  }

  const pt = new PageTemplate
  ;(() => {
    renderSearch()
    renderBridge(0)
  })()

  $(".bridge-monitoring .nav .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
  })

  function renderSearch () {
    luSearchForm = new LuSearchForm([
      { label: '设备编号', type: 'text', name: 't1' },
      { label: '设备类型', type: 'select', selectData: [], name: 's1' },
      { label: '设备名称', type: 'select', selectData: [], name: 's2' },
    ], {
      submit (data) {
        console.log(data)
      }
    })
  }

  async function renderBridge (id) {
    // mock
    const data = await $lulib.ajax('/qljcs/data/bridgeData.json', 'json')
    const html = pt.bridgeTemplate(data[id])
    $(".bridge-box").html(html)
  }
})
