layui.use([], function () {
  const $ = layui.$

  let bMap = null, bridgeIndex = 0, bridgeList = [], mapData = {}

  class PageTemplate {
    infoTemplate (data) {
      const { block1, block2, block3 } = data

      let block1Info = '', block1Nums = '', block2Info = '', block2Nums = '', block3Info = ''
      for (let i = 0; i < block1.infoList.length; i++) {
        const item = block1.infoList[i]
        block1Info += `<div class="info-item"><div class="label">${item.label}：</div><div class="desc">${item.desc}</div></div>`
      }
      for (let i = 0; i < block1.nums.length; i++) {
        const item = block1.nums[i]
        block1Nums += `<div class="nums-item"><span class="top">${item.label}</span><span class="bottom">${item.desc}</span></div>`
        if (i !== block1.nums.length - 1) {
          block1Nums += '<div class="nums-line"></div>'
        }
      }
      for (let i = 0; i < block2.infoList.length; i++) {
        const item = block2.infoList[i]
        block2Info += `<div class="info-item"><span class="label">${item.label}</span><span class="desc ${item.type}">${item.desc}</span></div>`
      }
      for (let i = 0; i < block2.nums.length; i++) {
        const item = block2.nums[i]
        block2Nums += `<div class="bottom-item"><span class="top">${item.label}</span><span class="bottom">${item.desc}</span></div>`
      }
      for (let i = 0; i < block3.length; i++) {
        const item = block3[i]
        block3Info += `<div class="video-item" data-id="${item.id}" style="background-image: url(${item.img});"></div>`
      }

      return `<div class="block block-1">
      <div class="title">桥梁概况</div>
        <div class="block-1-info">
          <div class="info-title">${block1.title}</div>
          <div class="info-txt">${block1.infoText}</div>
          ${block1Info}
        </div>
        <div class="block1-nums">${block1Nums}</div>
      </div>
      <div class="block block-2">
        <div class="block-top">${block2Info}</div>
        <div class="block-bottom">${block2Nums}</div>
      </div>
      <div class="block block-3">
        <div class="title">实时监控</div>
        <div class="block-video">${block3Info}</div>
      </div>`
    }
  }

  const pt = new PageTemplate()

  !(async () => {
    await getBridgeData()
    renderBridge()
    await renderMap()
    renderMapPoints()
  })()

  async function getBridgeData () {
    const data = await $lulib.ajax('/qljcs/data/homeData.json', 'json')
    bridgeList = data.bridgeList
    mapData = data.mapData
    return data
  }

  $(".nav .btn-item").on('click', function () {
    const $this = $(this)
    bridgeIndex = $this.index()
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.btn-item').removeClass('active')
    renderBridge()
  });

  function renderBridge () {
    const rightContent = $(".right-content")
    rightContent.html('')
    // mock
    const data = bridgeList[bridgeIndex]
    if (!data.id) return
    const html = pt.infoTemplate(data)
    rightContent.html(html)
  }

  async function renderMap () {
    const { longitude, latitude, level } = mapData
    bMap = new BMap.Map('mapContainer')
    const mapPoint = new BMap.Point(longitude, latitude)
    bMap.centerAndZoom(mapPoint, level)
    bMap.enableScrollWheelZoom(true)
    bMap.setMapStyle({
      features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
      style: "midnight"
    })
    await $lulib.delay(300)
    const doms = $(".anchorBL")
    doms.each((_, dom) => dom.remove())
  }

  function renderMapPoints () {
    const { bridgePoints } = mapData
    if (!bridgePoints || !bridgePoints.length) return
    bridgePoints.forEach(point => {
      const { longitude, latitude, name } = point
      const marker = new BMap.Marker(new BMap.Point(longitude, latitude))
      marker.bridgeId = point.id
      bMap.addOverlay(marker)
      const label = new BMap.Label(name, { offset: new BMap.Size(20, -10) })
      marker.setLabel(label)
      // marker.onclick = function (e) {
      //   console.log(e)
      // }
    })
  }

})
