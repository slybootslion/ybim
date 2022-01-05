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

      const { title, buildList } = block1

      let buildHtml = '', contentHtml = ''
      Object.keys(buildList).forEach((item, idx) => {
        if (idx === 0) {
          buildHtml += `<div class="left-item active">${item}栋</div>`
          for (let i = 0; i < buildList[item].length; i++) {
            contentHtml += `<div class="right-item"><div class="title">${i + 1}#</div><div class="block-box"><div class="block-inner">${buildList[item][i]}</div></div></div>`
          }
        } else {
          buildHtml += `<div class="left-item">${item}栋</div>`
        }
      })

      return `<div class="block1 block">
                <div class="block-title">${title}</div>
                <div class="block1-content">
                  <div class="content-left">
                    <div class="title">楼座</div>
                    <div class="left-list">${buildHtml}</div>
                  </div>
                  <div class="content-right">${contentHtml}</div>
                </div>
              </div>
              <div class="block2 block">
                <div class="block-title">${block2.title}</div>
                <div class="charts-box">
                  <div class="charts-item" id="echarts1"></div>
                </div>
              </div>`
    }

    templateContent (data) {
      const { equipment } = data

      const makeItems = list => {
        let h = ''
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          h += `<div class="equ-info-item"><span class="item-title">${item.label}</span><span class="item-info">：${item.value}</span></div>`
        }
        return h
      }

      let html = ''
      for (let i = 0; i < equipment.length; i++) {
        const equ = equipment[i]
        const stateClass = equ.state === 1 ? 'blue' : ''
        const stateTxt = equ.state === 1 ? '在线' : '离线'
        const items = makeItems(equ.list)
        html += `
          <div class="equ-box" style="top: 320px; left: 780px;">
            <span class="iconfont icon-shebeiguanli equ-item"></span>
            <div class="equ-info-box" style="top: -3px; left: -270px;">
              <div class="equ-info-title">
                <span class="title">设备信息</span>
                <span class="state ${stateClass}">${stateTxt}</span>
              </div>
              ${items}
            </div>
          </div>`
      }

      return `${html}`
    }
  }

  const pt = new PageTemplate

  let pageData
  ;(async () => {
    // mock
    pageData = await luUtils.ajax('/zhui/mock/equipmentData.json')
    await luUtils.delay(500)
    render()
    bindLeftMethod()
    bindContentMethod()
  })()

  function render () {
    const { left, right, content } = pageData
    const rightHtml = pt.templateRight(right)
    $(".content-body .right").html(rightHtml)
    const leftHtml = pt.templateLeft(left)
    $(".content-body .left").html(leftHtml)
    const contentHtml = pt.templateContent(content)
    $(".content-body .content").html(contentHtml)
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

  function bindLeftMethod () {
    $(".content-body .left").on('click', '.left-item', function (e) {
      const target = $(e.target)
      target.addClass('active').siblings('.left-item').removeClass('active')
      // todo 后续电梯节点渲染
    })
  }

  function bindContentMethod () {
    const $content = $(".content-body .content")

    $content.on('click', '.equ-item', function (e) {
      const target = $(e.target).parent('.equ-box')
      $(".equ-box").css({ zIndex: 0 })
      target.css({ zIndex: 1 })

      // $(".equ-info-box").each(item => item.removeClass('active'))

      const infoEl = target.find('.equ-info-box')
      const isActive = infoEl.hasClass('active')
      if (!isActive) {
        $(".equ-info-box").each((idx, item) => $(item).removeClass('active'))
        infoEl.addClass('active')
      } else {
        infoEl.removeClass('active')
      }
    })
  }
})
