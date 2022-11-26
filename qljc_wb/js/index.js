$(document).ready(function () {
  // console.log(echarts.version)
  const $ = jQuery
  const bridgeData = {
    1: {
      name: '化龙沟大桥',
      width: 2406,
      height: 780,
      url: 'hualonggou',
      points: [
        { cname: 'wy', id: 'WY5', value: '113.14mm', top: 28, left: 142 },
        { cname: 'lf', id: 'LF14', value: '1mm', top: 298, left: 152 },
        { cname: 'lf', id: 'LF13', value: '-0.07mm', top: 360, left: 152 },
        { cname: 'lf', id: 'LF16', value: '1mm', top: 422, left: 152 },
        { cname: 'wy', id: 'WY6', text: '129.55mm', top: 552, left: 141 },
        { cname: 'jsd', id: 'ZD03', text: '23mg', top: 17, left: 1242 },
        { cname: 'lf', id: 'LF18', text: '-0.22mm', top: 66, left: 1242 },
        { cname: 'wd', id: 'WS4', text: '9,5℃', top: 180, left: 1242 },
        { cname: 'sd', id: 'WS3', text: '83.6%', top: 220, left: 1242 },
        { cname: 'jsd', id: 'ZD04', text: '-37.68mg', top: 18, left: 1792 },
        { cname: 'lf', id: 'LF15', text: '-0.24mm', top: 180, left: 1792 },
        { cname: 'lf', id: 'LF20', text: '0.12mm', top: 301, left: 1792 },
        { cname: 'lf', id: 'LF19', text: '-0.12mm', top: 360, left: 1792 },
        { cname: 'lf', id: 'LF17', text: '0.11mm', top: 421, left: 1792 },
        { cname: 'wy', id: 'WY8', text: '129.55mm', top: 26, left: 2062 },
        { cname: 'wy', id: 'WY7', text: '129.55mm', top: 554, left: 2062 },
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
    let html = ''
    for (let i = 0; i < data.points.length; i++) {
      const item = data.points[i]
      const style = `top:${item.top}px; left:${item.left}px`
      html += `<div class="instrument-item ${item.cname}" 
                    data-id="${item.id}" 
                    style="${style}">
        <span class="num-text">${item.id}:${item.text}</span>
      </div>`
    }
    const { height } = $lulib.domWidthHeight('.bridge-box')
    const marginHeight = (height - 160 - data.height) / 2
    $(".bridge-pic").css({
      width: data.width, height: data.height, "margin-top": marginHeight,
      "background-image": `url('./images/0_${data.url}.png')`
    }).html(html)
  }

  $lulib.methodProxy.bindMethodProxy([{ dom: '.bridge-pic', domStr: '.instrument-item', method: handleInstrument }])

  function handleInstrument () {
    const id = $(this).data().id
    console.log(id)
  }
})
