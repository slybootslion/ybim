layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils
  const echarts = layui.echarts
  const dropdown = layui.dropdown
  const leftColorList1 = [
    { c1: '#fcb740ff', c2: '#13325f80' },
    { c1: '#0381d9ff', c2: '#13325f80' },
    { c1: '#098e52ff', c2: '#13325f80' },
  ]

  class PageTemplate {
    templateLeft (data) {
      let { topBlock, block1, block2, block3, block4 } = data
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
      </div>
      <div class="block4 block">
        <div class="block-title">${block4.title}</div>
        <div class="charts-box">
          <div class="charts-item" id="echarts3"></div>
          <div class="charts-item" id="echarts4"></div>
        </div>
      </div>`
    }

    templateRight (data) {
      const { block2 } = data
      let h2 = ''
      for (let i = 0; i < block2.dataList.length; i++) {
        const item = block2.dataList[i]
        h2 += `<div class="equipment-item">
                  <div class="icon">
                    <span class="iconfont ${item.icon}"></span>
                  </div>
                  <div class="txt">${item.title}</div>
                  <div class="nums">
                    <span class="num-1">${item.nums.num1}/</span>
                    <span class="num-2">${item.nums.num2}</span>
                  </div>
                  <div class="desc">（启用/停用）</div>
                </div>`
      }

      return `<div class="block1 block">
                <div class="block-title">能耗详情</div>
                <div class="block-content">
                  <div class="charts-box">
                    <div class="charts-item">
                      <div class="charts-top">
                        <div class="top-left">用电统计</div>
                        <div class="top-btn-box">
                          <div class="btn-item date active">本日</div>
                          <div class="btn-item date">本月</div>
                          <div class="btn-item" id="selectYears0">2021 ></div>
                        </div>
                      </div>
                      <div class="charts-line-pie" id="echarts5"></div>
                    </div>
                    <div class="charts-item">
                      <div class="charts-top">
                        <div class="top-left">给排水统计</div>
                        <div class="top-btn-box">
                          <div class="btn-item date active">本日</div>
                          <div class="btn-item date">本月</div>
                          <div class="btn-item" id="selectYears1">2021 ></div>
                        </div>
                      </div>
                      <div class="charts-line-pie" id="echarts6"></div>
                    </div>
                    <div class="charts-item">
                      <div class="charts-top">
                        <div class="top-left">用电量占比</div>
                        <div class="top-btn-box">
                          <div class="btn-item date active">本日</div>
                          <div class="btn-item date">本月</div>
                          <div class="btn-item" id="selectYears2">2021 ></div>
                        </div>
                      </div>
                      <div class="charts-line-pie" id="echarts7"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="block2 block">
                <div class="block-title">设备情况</div>
                <div class="block-content">${h2}</div>
              </div>`
    }

    templateContent (data) {
      const { environment, building } = data
      let envHtml = ''
      const evnIconList = ['icon-wendu', 'icon-icontubiao', 'icon-fangdumianju',
        'icon-fengsu', 'icon-zaoyin', 'icon-keranqiti']
      for (let i = 0; i < environment.length; i++) {
        const item = environment[i]
        envHtml += `<div class="env-item">
                      <span class="iconfont ${evnIconList[i]}"></span>
                      <div class="evn-info">
                        <div class="env-name">${item.key}</div>
                        <div class="env-num">${item.value}</div>
                      </div>
                    </div>`
      }
      let pointHtml = ''
      for (let i = 0; i < building.length; i++) {
        const itme = building[i]
        const isActive = i === 0 ? 'active' : ''
        pointHtml += `<div class="point-item ${isActive}"><span data-id="${itme.id}">${itme.name}</span></div>`
      }
      let infoHtml = this.infoBlockTemplate(building[0].info)
      return `<div class="environment-box">${envHtml}</div><div class="point-box">${pointHtml}</div><div class="building-info">${infoHtml}</div>`
    }

    infoBlockTemplate (data) {
      let infoHtml = ''
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const isBig = i === 0 ? 'big' : ''
        const noFlex = i === 1 ? 'no-flex' : ''
        let h = ''
        for (let i = 0; i < item.data.length; i++) {
          const it = item.data[i]
          h += `<div class="item"><div class="label">${it.key}：</div><div class="value">${it.value}</div></div>`
        }
        infoHtml += `<div class="title">${item.title}</div><div class="list ${isBig} ${noFlex}">${h}</div>`
      }
      return `<div class="info-block">${infoHtml}</div>`
    }
  }

  const pt = new PageTemplate()

  let pageData
  ;(
    async () => {
      // mock
      pageData = await luUtils.ajax('/zhui/mock/overviewData.json')
      await luUtils.delay(500)
      render()
      bindRightEChartsMethod()
      bindContentMethod()
    }
  )()

  function render () {
    const { left, right, content } = pageData
    const leftHtml = pt.templateLeft(left)
    const rightHtml = pt.templateRight(right)
    const contentHtml = pt.templateContent(content)
    $(".content-body .left").html(leftHtml)
    $(".content-body .right").html(rightHtml)
    $(".content-body .content").html(contentHtml)
    handlerEcharts(pageData)
    rightEchartsYearSelectRender()
  }

  function handlerEcharts (data, selected = null) {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const echarts2 = echarts.init(document.querySelector('#echarts2'))
    const echarts3 = echarts.init(document.querySelector('#echarts3'))
    const echarts4 = echarts.init(document.querySelector('#echarts4'))
    const echarts5 = echarts.init(document.querySelector('#echarts5'))
    const echarts6 = echarts.init(document.querySelector('#echarts6'))
    const echarts7 = echarts.init(document.querySelector('#echarts7'))
    const leftData1 = data.left.block3.dataList
    const leftData2 = data.left.block4.dataList
    const rightData = data.right.block1

    if (selected) {
      const { idx, type } = selected
      if (idx === 0) echarts5.setOption(echartsOpts3(rightChartsDataMakerLine(1, type)))
      if (idx === 1) echarts6.setOption(echartsOpts3(rightChartsDataMakerLine(2, type)))
      if (idx === 2) echarts7.setOption(echartsOpts3(rightChartsDataMakerPie(type)))
      return
    }

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

    function rightChartsDataMakerLine (type, dateType) {
      let data = rightData['data' + type]
      return {
        title: data.unit,
        data: data[dateType + 'Data'],
        names: data.names,
      }
    }

    function rightChartsDataMakerPie (dateType) {
      return {
        data: rightData.data3[dateType + 'Data']
      }
    }

    echarts1.setOption(echartsOpts1(leftChartsDataMakerPie(1)))
    echarts2.setOption(echartsOpts1(leftChartsDataMakerPie(2)))

    echarts3.setOption(echartsOpts2(leftChartsDataMakerBar(1)))
    echarts4.setOption(echartsOpts2(leftChartsDataMakerBar(2)))

    echarts5.setOption(echartsOpts3(rightChartsDataMakerLine(1, 'day')))
    echarts6.setOption(echartsOpts3(rightChartsDataMakerLine(2, 'day')))
    echarts7.setOption(echartsOpts4(rightChartsDataMakerPie('day')))
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
    const { data: d, title: name } = data
    const colorData = {
      1: { c1: ['#0381d9'], c2: [{ t: '#0381d980', b: '#0381d980' }] },
      2: { c1: ['#134a70', '#fcb740'], c2: [{ t: '#134a70ff', b: '#134a7080' }, { t: '#fcb740ff', b: '#fcb74080' }] }
    }
    const opts = {
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: [...d.xData],
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        lineStyle: {
          color: '#c6c6c6'
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name,
        nameTextStyle: {
          color: '#c6c6c6',
        },
        axisLabel: {
          textStyle: {
            color: '#00c0ff'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#5c5c5c80',
          }
        }
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '20%',
        containLabel: true,
      },
      series: (() => {
        const arr = []
        const color = colorData[d.seriesData.length]
        for (let i = 0; i < d.seriesData.length; i++) {
          const series = d.seriesData[i]
          const obj = {
            data: [...series],
            type: 'line',
            itemStyle: {
              color: color.c1[i]
            },
            lineStyle: {
              color: color.c1[i]
            },
            z: i === 0 ? 0 : 1,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: color.c2[i].t,
                },
                {
                  offset: 1,
                  color: color.c2[i].b,
                }
              ])
            }
          }
          if (d.seriesData.length > 1) obj.name = data.names[i]
          arr.push(obj)
        }
        return arr
      })()
    }
    if (d.seriesData.length > 1) {
      opts.legend = {
        data: ['总用水', '总排污'],
        x: 'right',
        y: 'top',
        textStyle: { color: '#c6c6c6', }
      }
    }
    return opts
  }

  function echartsOpts4 (data = {}) {
    const colorList = ['#61b5e0', '#d8ca74', '#14a7e2', '#bfa55f', '#0962b6']
    const colorList2 = ['#47c8ff', '#ffe042', '#2ec1ff', '#ffcc39', '#128dff']
    return {
      legend: {
        orient: 'vertical',
        left: 'right',
        icon: 'circle',
        align: 'left',
        bottom: 0,
        textStyle: {
          color: '#c6c6c6',
        }
      },
      graphic: {
        elements: [{
          type: 'image',
          style: {
            image: '/zhui/images/pages/Pie.png',
            width: 140,
            height: 140,
          },
          left: 0,
          top: 'center'
        }]
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '0',
        containLabel: true
      },
      series: [
        {
          type: 'pie',
          roseType: 'area',
          radius: '80%',
          center: ['24%', '50%'],
          label: {
            show: false
          },
          data: data.data,
          itemStyle: {
            color (params) {
              return new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: colorList[params.dataIndex] + '80'
              }, {
                offset: 1,
                color: colorList2[params.dataIndex] + 'c0'
              }])
            }
          }
        }
      ]
    }
  }

  function rightEchartsBtnItemClick (el, data = {}) {
    const { type, idx } = data
    const isActive = el.hasClass('active')
    if (isActive) return
    el.addClass('active').siblings('.btn-item').removeClass('active')
    handlerEcharts(pageData, { type, idx })
  }

  function bindRightEChartsMethod () {
    $(".right").on('click', '.btn-item.date', function () {
      const $this = $(this)
      const type = $this.html() === '本月' ? 'month' : 'day'
      const contentTitle = $this.parents('.charts-top').find('.top-left').html()
      const idx = findEchartsBoxIndex(contentTitle)
      rightEchartsBtnItemClick($(this), { type, idx })
    })
  }

  function rightEchartsYearSelectRender () {
    const year = new Date().getFullYear()
    for (let i = 0; i < 3; i++) {
      dropdown.render({
        elem: '#selectYears' + i,
        data: [{ id: 1, title: year }, { id: 2, title: year - 1 }, { id: 3, title: year - 2 }],
        click (obj) {
          const $el = $(this.elem[0])
          $el.html(obj.title + ' >')
          const $this = $(this.elem[0])
          const contentTitle = $this.parents('.charts-top').find('.top-left').html()
          const idx = findEchartsBoxIndex(contentTitle)
          rightEchartsBtnItemClick($this, { type: 'year', idx })
        }
      })
    }
  }

  function findEchartsBoxIndex (contentTitle) {
    let idx = null
    switch (contentTitle) {
      case '用电统计':
        idx = 0
        break
      case '给排水统计':
        idx = 1
        break
      case '用电量占比':
        idx = 2
        break
      default:
        break
    }
    return idx
  }

  function bindContentMethod () {
    $(".content-body .content").on('click', '.point-item span', function () {
      const isActive = $(this).parent('.point-item').hasClass('active')
      if (isActive) return
      $(this).parent('.point-item').addClass('active').siblings('.point-item').removeClass('active')
      const id = $(this).data('id')
      const data = pageData.content.building.find(build => build.id === id)
      const html = pt.infoBlockTemplate(data.info)
      $(".building-info").html(html)
    })
  }

})
