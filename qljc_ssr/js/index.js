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
        { cname: 'wy', id: 'WY6', value: '129.55mm', top: 552, left: 141 },
        { cname: 'jsd', id: 'ZD03', value: '23mg', top: 17, left: 1242 },
        { cname: 'lf', id: 'LF18', value: '-0.22mm', top: 66, left: 1242 },
        { cname: 'wd', id: 'WS4', value: '9,5℃', top: 180, left: 1242 },
        { cname: 'sd', id: 'WS3', value: '83.6%', top: 220, left: 1242 },
        { cname: 'jsd', id: 'ZD04', value: '-37.68mg', top: 18, left: 1792 },
        { cname: 'lf', id: 'LF15', value: '-0.24mm', top: 180, left: 1792 },
        { cname: 'lf', id: 'LF20', value: '0.12mm', top: 301, left: 1792 },
        { cname: 'lf', id: 'LF19', value: '-0.12mm', top: 360, left: 1792 },
        { cname: 'lf', id: 'LF17', value: '0.11mm', top: 421, left: 1792 },
        { cname: 'wy', id: 'WY8', value: '129.55mm', top: 26, left: 2062 },
        { cname: 'wy', id: 'WY7', value: '129.55mm', top: 554, left: 2062 },
      ]
    },
    2: {
      name: '康峪沟大桥',
      width: 2405,
      height: 780,
      url: 'kangyugou',
      points: [
        { cname: 'wy', id: 'WY12', value: '113.14mm', top: 0, left: 142 },
        { cname: 'lf', id: 'LF24', value: '1mm', top: 298, left: 152 },
        { cname: 'lf', id: 'LF28', value: '-0.07mm', top: 360, left: 152 },
        { cname: 'lf', id: 'LF27', value: '1mm', top: 478, left: 152 },
        { cname: 'lf', id: 'LF22', value: '1mm', top: 515, left: 152 },
        { cname: 'wy', id: 'WY9', value: '129.55mm', top: 552, left: 141 },
        { cname: 'lf', id: 'LF21', value: '1mm', top: 0, left: 705 },
        { cname: 'jsd', id: 'ZD05', value: '23mg', top: 0, left: 1242 },
        { cname: 'lf', id: 'LF25', value: '-0.22mm', top: 39, left: 1242 },
        { cname: 'lf', id: 'LF26', value: '1mm', top: 298, left: 152 },
        { cname: 'sd', id: 'WS5', value: '83.6%', top: 238, left: 1242 },
        { cname: 'wd', id: 'WS6', value: '8.5℃', top: 268, left: 1242 },
        { cname: 'jsd', id: 'ZD06', value: '-37.68mg', top: 0, left: 1792 },
        { cname: 'lf', id: 'LF23', value: '-0.24mm', top: 40, left: 1792 },
        { cname: 'wy', id: 'WY10', value: '129.55mm', top: 0, left: 2062 },
        { cname: 'wy', id: 'WY11', value: '129.55mm', top: 538, left: 2062 },
      ]
    },
    3: {
      name: '西甘村大桥',
      width: 2842,
      height: 780,
      url: 'xigancun',
      points: [
        { cname: 'wy', id: 'WY04', value: '113.14mm', top: 0, left: 142 },
        { cname: 'lf', id: 'LF05', value: '1mm', top: 298, left: 152 },
        { cname: 'wy', id: 'WY01', value: '114.69mm', top: 360, left: 152 },
        { cname: 'lf', id: 'LF09', value: '1mm', top: 478, left: 152 },
        { cname: 'lf', id: 'LF12', value: '0.15mm', top: 515, left: 152 },
        { cname: 'lf', id: 'LF08', value: '0.55mm', top: 552, left: 141 },
        { cname: 'jsd', id: 'ZD01', value: '19.1mg', top: 0, left: 1242 },
        { cname: 'lf', id: 'LF02', value: '-0.22mm', top: 39, left: 1242 },
        { cname: 'lf', id: 'LF04', value: '0.11mm', top: 298, left: 152 },
        { cname: 'lf', id: 'LF01', value: '-0.22mm', top: 39, left: 1242 },
        { cname: 'lf', id: 'LF10', value: '0.13mm', top: 66, left: 1252 },
        { cname: 'sd', id: 'WS01', value: '83.6%', top: 238, left: 1242 },
        { cname: 'wd', id: 'WS02', value: '8.5℃', top: 268, left: 1242 },
        { cname: 'jsd', id: 'ZD02', value: '33.16mg', top: 0, left: 1922 },
        { cname: 'lf', id: 'LF06', value: '-0.24mm', top: 40, left: 1922 },
        { cname: 'lf', id: 'LF11', value: '-0.22mm', top: 39, left: 1922 },
        { cname: 'wy', id: 'WY02', value: '119.16mm', top: 0, left: 2062 },
        { cname: 'lf', id: 'LF07', value: '0.19mm', top: 40, left: 2062 },
        { cname: 'lf', id: 'LF03', value: '0.19mm', top: 70, left: 2062 },
        { cname: 'wy', id: 'WY03', value: '119.16mm', top: 0, left: 2062 },
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
        <span class="num-text">${item.id}:${item.value}</span>
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
