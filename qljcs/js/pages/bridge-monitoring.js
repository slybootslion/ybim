layui.use(['LuCommonTemplate', 'echarts'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm
  let luSearchForm

  class PageTemplate {
    bridgeTemplate (data) {
      console.log(data)
      const instrumentDict = {
        a1: { top: 50, left: 103 },
        a2: { top: 453, left: 103 },
        a3: { top: 90, left: 924 },
        a4: { top: 227, left: 924 },
        a5: { top: 242, left: 1334 },
      }
      const iconDict = {
        1: { name: '位移计', icon: 'inst-icon01' },
        2: { name: '加速度', icon: 'inst-icon02' },
        3: { name: '温度计', icon: 'inst-icon03' },
        4: { name: '湿度计', icon: 'inst-icon04' },
        5: { name: '裂缝计', icon: 'inst-icon05' },
      }
      let html = ''
      for (let i = 0; i < data.instrumentList.length; i++) {
        const item = data.instrumentList[i]
        const { top, left } = instrumentDict[item.id]
        const { icon, name } = iconDict[item.type]
        html += `<div class="instrument-item" data-id="${item.id}" style="top: ${top}px; left:${left}px;">
                    <div class="inst-item-icon" style="background-image:url('/qljcs/images/page/qljc/${icon}.png');"></div>
                    <div class="inst-item-info">
                      <p>${name}</p>
                      <p><span>${item.name}:${item.value}</span></p>
                    </div>
                  </div>`
      }
      const { height } = $lulib.domWidthHeight('.bridge-box')
      const width = parseInt(`${data.width * height / data.height}`)
      return `<div class="bridge-pic" style="width: ${width}px; height: ${height - 10}px; background-image:url('${data.pic}');">${html}</div>`
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

  function handleInstrument () {
    const { id } = $(this).data()
    console.log(id)
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: 'body', domStr: '.instrument-item', method: handleInstrument }])
})
