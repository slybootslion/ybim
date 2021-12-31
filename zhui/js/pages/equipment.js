layui.use([], () => {
  const $ = layui.$
  const luUtils = layui.LuUtils

  class PageTemplate {
    templateRight (data) {
      const { block1, block2 } = data

      let h1 = ''
      for (let i = 0; i < block1.dataList.length; i++) {
        const item = block1.dataList[i]
        h1 += `<div class="equipment-item">
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

      let h2 = ''
      for (let i = 0; i < block2.data.length; i++) {
        const item = block2.data[i]
        const levelTag = 'level' + item.level
        h2 += `<div class="warning-item ${levelTag}">
          <span class="iconfont icon-jingshi"></span>
          <span class="desc txt-overflow">${item.info}</span>
          <span class="date">${item.date}</span>
        </div>`
      }
      return `<div class="block1 block">
                <div class="block-title">${block1.title}</div>
                <div class="block-content">${h1}</div>
              </div>
              <div class="block2 block">
                <div class="block-title">${block2.title}</div>
                <div class="warning-list">${h2}</div>
              </div>`
    }

    templateLeft (data) {
      const { block2, block1 } = data
      return `<div class="block1 block">
                <div class="block-title">${block1.title}</div>
                <div class="block1-content"></div>
              </div>
              <div class="block2 block">
                <div class="block-title">${block2.title}</div>
                <div class="charts-box">
                  <div class="charts-item" id="echarts1"></div>
                </div>
              </div>`
    }
  }

  const pt = new PageTemplate

  let pageData
  ;(async () => {
    // mock
    pageData = await luUtils.ajax('/zhui/mock/equipmentData.json')
    await luUtils.delay(500)
    render()
  })()

  function render () {
    const { left, right, content } = pageData
    const rightHtml = pt.templateRight(right)
    $(".content-body .right").html(rightHtml)
    const leftHtml = pt.templateLeft(left)
    // $(".content-body .left").html(leftHtml)
    handlerEcharts()
  }

  function handlerEcharts () {
    const echarts1 = echarts.init(document.querySelector('#echarts1'))
    const data = pageData.left.block2.data
    echarts1.setOption(echartsOpts(data))
  }


  function echartsOpts (data = {}) {
    const colorList = ['#0381d9', '#00f8ff']
    return {
      grid: {
        left: '5%',
        right: '13%',
        bottom: '0',
        top: '5%',
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
        data: [...data.map(d => d.label)],
      },
      xAxis: {
        show: false,
        type: 'value'
      },
      series: [
        {
          data: [...data.map(d => d.num)],
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            normal: {
              color (params) {
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colorList[0] },
                  { offset: 1, color: colorList[1] }
                ])
              },
              label: {
                show: true,
                position: 'right',
                valueAnimation: true,
                formatter (params) {
                  return params.data + '次'
                },
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
})
