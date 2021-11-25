layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const echarts = layui.echarts

  const leftColorList1 = [
    { c1: '#fcb740ff', c2: '#13325f80' },
    { c1: '#0381d9ff', c2: '#13325f80' },
    { c1: '#098e52ff', c2: '#13325f80' },
  ]

  class PageTemplate {
    renderLeft (data) {
      let { topBlock, block1, block2, block3 } = data
      topBlock = topBlock.padStart(6, '0').split('')
      let topBlockNumsHtml = '', block1Html = ``, block2Html = ``
      for (let i = 0; i < topBlock.length; i++) {
        topBlockNumsHtml += `<div class="num-item">${topBlock[i]}</div>`
      }
      for (let i = 0; i < block1.content.length; i++) {
        const item = block1.content[i]
        block1Html += `<div class="block-content-item"><div class="item-title">${item.label}</div><div class="item-num"><span class="num">${item.num}</span><span class="unit">${item.unit}</span></div></div>`
      }
      for (let i = 0; i < block2.content.length; i++) {
        const item = block2.content[i]
        block2Html += `<div class="block-content-item"><div class="item-title">${item.label}</div><div class="item-num"><span class="num">${item.num}</span></div></div>`
      }
      let block3Legend1 = '', block3Legend2 = ''
      for (let i = 0; i < block3.dataList[0].data.length; i++) {
        const item = block3.dataList[0].data[i]
        block3Legend1 += `<div class="legend"><div class="color" style="background-color: ${leftColorList1[i].c1};"></div><div>${item.label}</div><div>${item.num}${block3.dataList[0].info.unit}</div></div>`
      }
      for (let i = 0; i < block3.dataList[1].data.length; i++) {
        const item = block3.dataList[1].data[i]
        block3Legend2 += `<div class="legend"><div class="color" style="background-color: ${leftColorList1[i].c1};"></div><div>${item.label}</div><div>${item.num}${block3.dataList[1].info.unit}</div></div>`
      }
      return `
      <div class="top-block">
        <div class="left-title">
          <div>在园</div>
          <div>企业</div>
        </div>
        <div class="nums">
          ${topBlockNumsHtml}
          <div class="num-txt">个</div>
        </div>
      </div>
      <div class="block1 block">
        <div class="block-title">${block1.title}</div>
        <div class="block-content">${block1Html}</div>
      </div>
      <div class="block2 block">
        <div class="block-title">${block2.title}</div>
        <div class="block-content">${block2Html}</div>
      </div>
      <div class="block3 block">
        <div class="block-title">${block3.title}</div>
        <div class="charts-box">
          <div class="charts-item">
            <div class="charts-pie" id="echarts1"></div>
            <div class="charts-legend">${block3Legend1}</div>
          </div>
          <div class="charts-item">
            <div class="charts-pie" id="echarts2"></div>
            <div class="charts-legend">${block3Legend2}</div>
          </div>
        </div>
      </div>`
    }

    renderRight (data) {
    }
  }

  const pt = new PageTemplate()

  let pageData
  ;(
    async () => {
      pageData = await getPageData()
      render()
    }
  )()

  async function getPageData () {
    // mock
    return luUtils.ajax('/zhui/mock/overviewData.json')
  }

  function render () {
    const { left, right } = pageData
    const leftHtml = pt.renderLeft(left)
    const rightHtml = pt.renderRight(right)
    $(".content-body .left").html(leftHtml)
    $(".content-body .right").html(rightHtml)
    handlerEcharts(pageData)
  }

  function handlerEcharts (data) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))
    const leftData1 = data.left.block3.dataList

    function leftChartsDataMaker (type) {
      type = type === 1 ? 0 : 1
      return {
        colorList: leftColorList1,
        txt1: leftData1[type].info.count + leftData1[type].info.unit,
        txt2: leftData1[type].info.desc,
        data: leftData1[type].data.map(d => ({ value: d.num, name: d.label }))
      }
    }

    echarts1.setOption(echartsOpts(1, leftChartsDataMaker(1)))
    echarts2.setOption(echartsOpts(1, leftChartsDataMaker(2)))
  }

  function echartsOpts (key, data) {
    const options = {
      1: {
        series: [
          {
            type: 'pie',
            radius: ['64%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: [`{a|${data.txt1}}`, `{b|${data.txt2}}`].join('\n'),
              rich: {
                a: { fontSize: 18, color: '#fff' },
                b: { fontSize: 12, color: '#c6c6c6' },
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              ...data.data
            ],
            itemStyle: {
              color (params) {
                const list = data.colorList
                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 1, color: list[params.dataIndex].c1 },
                  { offset: 0, color: list[params.dataIndex].c2 }
                ])
              },
            },
            emphasis: {
              scale: false,
              focus: 'none',
            }
          },
          {
            type: 'pie',
            radius: ['85%', '87%']
          },
          {
            type: 'pie',
            radius: ['62%', '64%']
          },
        ],
      }
    }
    return options[key]
  }

})
