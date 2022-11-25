$(document).ready(function () {
  // console.log(echarts.version)

  const bridgeData = {
    1: {
      name: '化龙沟大桥',
      width: 2406,
      height: 780,
      url: 'hualonggou',
      points: [
        {}
      ]
    },
    2: {
      name: '康峪沟大桥',
      width: 2405,
      height: 780,
      url: 'kangyugou',
      points: [
        {}
      ]
    },
    3: {
      name: '西甘村大桥',
      width: 2842,
      height: 780,
      url: 'xigancun',
      points: [
        {}
      ]
    }
  }

  page_init()

  function page_init () {
    const { bridgeId } = $lulib.getAllUrlParams()
    const data = bridgeData[bridgeId]
    if (!data) throw new Error("桥梁id未传入或者错误")
    let html = '<div style="position:absolute; top: 0; left: 0;">test</div>';
    // for (let i = 0; i < bridgeData[bridgeId].length; i++) {
    //   const item = data.points[i]
    //   html += `<div class="instrument-item" data-id="${item.id}""></div>`
    // }
    const { height } = $lulib.domWidthHeight('.bridge-box')
    const marginHeight = (height - 160 - data.height) / 2
    // const width = parseInt(`${data.width * height / data.height}`)
    $(".bridge-pic").css({
      width: data.width, height: data.height, "margin-top": marginHeight,
      "background-image": `url('./images/0_${data.url}.png')`
    }).html(html)
    // return `<div class="bridge-pic" style="width: ${width}px; height: ${height - 10}px; background-image:url('./images/${data.url}.png');">${html}</div>`
  }


})
