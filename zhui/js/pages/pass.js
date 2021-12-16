layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const leftColorList1 = [
    { c1: '#fcb740ff', c2: '#13325f80' },
    { c1: '#0381d9ff', c2: '#13325f80' },
    { c1: '#098e52ff', c2: '#13325f80' },
  ]

  class PageTemplate {
    templateLeft (data) {
      let { block1, block2, block3 } = data
      let block1Legend1 = '', block1Legend2 = ''
      for (let i = 0; i < block1.dataList[0].data.length; i++) {
        const item = block1.dataList[0].data[i]
        block1Legend1 += `<div class="legend"><div class="color" style="background-color: ${leftColorList1[i].c1};"></div><div>${item.label}</div><div>${item.num}${block1.dataList[0].info.unit}</div></div>`
      }
      for (let i = 0; i < block1.dataList[1].data.length; i++) {
        const item = block1.dataList[1].data[i]
        block1Legend2 += `<div class="legend"><div class="color" style="background-color: ${leftColorList1[i].c1};"></div><div>${item.label}</div><div>${item.num}${block1.dataList[1].info.unit}</div></div>`
      }
      return `
      <div class="block1 block">
        <div class="block-title">${block1.title}</div>
        <div class="charts-box">
          <div class="charts-item">
            <div class="charts-pie" id="echarts1"></div>
            <div class="charts-legend">${block1Legend1}</div>
          </div>
          <div class="charts-item">
            <div class="charts-pie" id="echarts2"></div>
            <div class="charts-legend">${block1Legend2}</div>
          </div>
        </div>
      </div>
      <div class="block2 block">
        <div class="block-title">${block2.title}</div>
        <div class="charts-box">
          <div class="charts-item" id="echarts3"></div>
          <div class="charts-item" id="echarts4"></div>
        </div>
      </div>
      <div class="block3 block">
        <div class="block-title">
          <div class="title">${block3.title}</div>
          <div class="top-btn-box">
            <div class="btn-item c1">进</div>
            <div class="btn-item c2">出</div>
          </div>
        </div>
        <div class="charts-box">
          <div class="charts-item" id="echarts5"></div>
        </div>
      </div>`
    }

    templateRight (data) {
      let { block1, block2 } = data
      let l1 = '', l2 = ''
      console.log(block2.dataList)
      for (let i = 0; i < block2.dataList.data1.length; i++) {
        const item = block2.dataList.data1[i]
        l1 += `<div class="list-item">${item}</div>`
      }
      for (let i = 0; i < block2.dataList.data2.length; i++) {
        const item = block2.dataList.data2[i]
        l2 += `<div class="list-item">${item}</div>`
      }
      return `
      <div class="block1 block">
        <div class="block-title">
          <div class="title">${block1.title}</div>
          <div class="top-btn-box">
            <div class="btn-item c1">入园</div>
            <div class="btn-item c3">出园</div>
          </div>
        </div>
        <div class="charts-box">
          <div class="charts-item" id="echarts6"></div>
        </div>
      </div>
      <div class="block2 block">
        <div class="block-title">${block2.title}</div>
        <div class="block-content">
          <div class="block-list">
            <div class="content-title">
              <span class="dian c1"></span><span>南门</span>
            </div>
            ${l1}
          </div>
          <div class="block-list">
            <div class="content-title">
              <span class="dian c2"></span><span>北门</span>
            </div>
            ${l1}
          </div>
        </div>
      </div>
      `
    }
  }

  const pt = new PageTemplate
  let pageData
  ;(async () => {
    pageData = await luUtils.ajax('/zhui/mock/passData.json')
    await luUtils.delay(500)
    render()
  })()

  function render () {
    const { left, right } = pageData
    const leftHtml = pt.templateLeft(left)
    $(".content-body .left").html(leftHtml)
    const rightHtml = pt.templateRight(right)
    $(".content-body .right").html(rightHtml)
    handlerEcharts(pageData)
  }

  function handlerEcharts (data) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))
    const echarts3 = echarts.init(document.querySelector('#echarts3'))
    const echarts4 = echarts.init(document.querySelector('#echarts4'))
    const echarts5 = echarts.init(document.querySelector('#echarts5'))
    const echarts6 = echarts.init(document.querySelector('#echarts6'))
    const leftData1 = data.left.block1.dataList
    const leftData2 = data.left.block2.dataList
    const leftData3 = data.left.block3.dataList
    const rightData = data.right.block1.dataList

    function leftChartsDataMakerPie (type) {
      type = type === 1 ? 0 : 1
      return {
        colorList: leftColorList1,
        txt1: leftData1[type].info.count + leftData1[type].info.unit,
        txt2: leftData1[type].info.desc,
        data: leftData1[type].data.map(d => ({ value: d.num, name: d.label }))
      }
    }

    function leftChartsDataMakerBar (type) {
      const data = type === 1 ? leftData2[0] : leftData2[1]
      return {
        title: type === 1 ? '地上车位' : '地下车位',
        data: data.data.map(d => d.num)
      }
    }


    echarts1.setOption(echartsOpts1(leftChartsDataMakerPie(1)))
    echarts2.setOption(echartsOpts1(leftChartsDataMakerPie(2)))

    echarts3.setOption(echartsOpts2(leftChartsDataMakerBar(1)))
    echarts4.setOption(echartsOpts2(leftChartsDataMakerBar(2)))

    echarts5.setOption(echartsOpts3({ data: leftData3.data, title: leftData3.unit }))

    echarts6.setOption(echartsOpts4(rightData))
  }

  function echartsOpts1 (data = {}) {
    return {
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

  function echartsOpts2 (data = {}) {
    const colorList = [
      { c1: '#00a6ff', c2: '#00fefc' },
      { c1: '#ffb227', c2: '#90fe01' },
      { c1: '#ff2000', c2: '#ff8a00' },
    ]
    return {
      title: {
        text: data.title,
        textStyle: {
          fontSize: 10,
          color: '#fff',
        },
        top: 0,
        left: 50
      },
      grid: {
        left: '0',
        right: '15%',
        bottom: '0',
        top: '20%',
        containLabel: true
      },
      yAxis: {
        type: 'category',
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#c6c6c6',
          },
        },
        inverse: true,
        data: ['车位总数', '空闲车位', '故障车位'],
      },
      xAxis: {
        show: false,
        type: 'value'
      },
      series: [
        {
          data: [...data.data],
          type: 'bar',
          itemStyle: {
            normal: {
              color (params) {
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colorList[params.dataIndex].c1 },
                  { offset: 1, color: colorList[params.dataIndex].c2 },
                ])
              },
              label: {
                show: true,
                position: 'right',
                valueAnimation: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 12,
                }
              }
            }
          }
        }
      ]
    }
  }

  function echartsOpts3 (data = {}) {
    return {
      legend: {
        show: false
      },
      tooltip: {},
      grid: {
        left: '0',
        right: '15%',
        bottom: '0',
        top: '20%',
        containLabel: true
      },
      dataset: {
        source: data.data
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
      },
      yAxis: {
        name: data.title,
        nameTextStyle: {
          color: '#c6c6c6',
        },
        axisLabel: {
          textStyle: {
            color: '#86cdff'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#5c5c5c55',
          }
        },
      },
      series: [{
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            color (params) {
              return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#00a6ff' },
                { offset: 1, color: '#00fefc' },
              ])
            },
          }
        }
      }, {
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: '#f4b140'
        }
      }]
    }
  }

  function echartsOpts4 (data = {}) {
    return {
      grid: {
        left: '0',
        right: '15%',
        bottom: '0',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        data: data.xData,
      },
      yAxis: {
        name: data.unit,
        type: 'value',
        nameTextStyle: {
          color: '#c6c6c6',
        },
        axisLabel: {
          textStyle: {
            color: '#86cdff'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#5c5c5c55',
          }
        },
      },
      series: [
        {
          data: data.data1,
          type: 'line',
          smooth: true,
          symbol: "none",
          color: '#00c0ff',
        },
        {
          data: data.data2,
          type: 'line',
          smooth: true,
          symbol: "none",
          color: '#00f8ff',
        },
      ]
    }
  }
})
