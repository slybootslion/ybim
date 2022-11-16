layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const laydate = layui.laydate
  const form = layui.form

  let luInnerHeader, dateStr
  ;(async () => {
    innerHeaderRender()
    initDateInput()
    initMap()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

  function initDateInput (date) {
    dateStr = date || $lulib.dayjs(new Date()).format('YYYY-MM-DD')
    laydate.render({
      elem: '#dateInput',
      value: dateStr,
      isInitValue: true,
      showBottom: false,
    })
    form.render()
  }

  function initMap () {
    if (!BMapGL) return
    const map = new BMapGL.Map('map');
    map.centerAndZoom(new BMapGL.Point(116.297611, 40.047363), 19);
    map.setMapStyleV2({
      styleId: '96b3d8db07e7ccb0a5e4e5158f5f83c6'
    })

    // { 'lng': 108.752592,'lat':34.606683,},
    // { 'lng': 108.752332,'lat':34.606764,},
    // { 'lng': 108.752103,'lat':34.606894,},
    // { 'lng': 108.752408,'lat':34.606961,},
    // { 'lng': 108.752817,'lat':34.60688,},
    // { 'lng': 108.752961,'lat':34.606731,},
    // { 'lng': 108.753347,'lat':34.606586,},
    // { 'lng': 108.753549,'lat':34.606493,},
    // { 'lng': 108.753468,'lat':34.606386,},
    // { 'lng': 108.75283,3'lat':4.606334,},
    // { 'lng': 108.75283,3'lat':4.606334,},
    // { 'lng': 108.752821,'lat':34.606694,},
    // { 'lng': 108.752821,'lat':34.606694,},
    // { 'lng': 108.753288,'lat':34.606649,},
    // { 'lng': 108.752871,'lat':34.606579,},
    // { 'lng': 108.752934,'lat':34.606657,},
    // { 'lng': 108.752983,'lat':34.607032,},
    // const path = [
    //   { 'lng': 116.297611, 'lat': 40.047363 },
    //   { 'lng': 116.302839, 'lat': 40.048219 },
    //   { 'lng': 116.308301, 'lat': 40.050566 },
    //   { 'lng': 116.305732, 'lat': 40.054957 },
    //   { 'lng': 116.304754, 'lat': 40.057953 },
    //   { 'lng': 116.306487, 'lat': 40.058312 },
    //   { 'lng': 116.307223, 'lat': 40.056379 }
    // ]
    const path = [
      { 'lng': 108.752592, 'lat': 34.606683, },
      { 'lng': 108.752332, 'lat': 34.606764, },
      { 'lng': 108.752103, 'lat': 34.606894, },
      { 'lng': 108.752408, 'lat': 34.606961, },
      { 'lng': 108.752817, 'lat': 34.60688, },
      { 'lng': 108.752961, 'lat': 34.606731, },
      { 'lng': 108.753347, 'lat': 34.606586, },
      { 'lng': 108.753549, 'lat': 34.606493, },
      { 'lng': 108.753468, 'lat': 34.606386, },
      { 'lng': 108.752833, 'lat': 34.606334, },
      { 'lng': 108.752821, 'lat': 34.606694, },
      { 'lng': 108.753288, 'lat': 34.606649, },
      { 'lng': 108.752871, 'lat': 34.606579, },
      { 'lng': 108.752934, 'lat': 34.606657, },
      { 'lng': 108.752983, 'lat': 34.607032, },
    ]
    const point = []
    for (let i = 0; i < path.length; i++)
      point.push(new BMapGL.Point(path[i].lng, path[i].lat))
    const pl = new BMapGL.Polyline(point)
    const trackAni = new BMapGLLib.TrackAnimation(map, pl, {
      overallView: true, // 动画完成后自动调整视野到总览
      tilt: 30,          // 轨迹播放的角度，默认为55
      duration: 5000,   // 动画持续时长，默认为10000，单位ms
      delay: 1000        // 动画开始的延迟，默认0，单位ms
    })
    trackAni.start()

    const markStart = new BMapGL.Marker(point[0])
    const markEnd = new BMapGL.Marker(point[point.length - 1])

    const labelOpts = {
      color: "#fff",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "10px",
      padding: "0 10px",
      fontSize: "14px",
      lineHeight: "20px",
      border :"0",
      transform:'translateX(-50%)'
    }
    const labelopts1 = {
      position: point[0],
      offset: new BMapGL.Size(0, 0)
    }
    const labelStart = new BMapGL.Label("起点", labelopts1);
    labelStart.setStyle(labelOpts)

    const labelopts2 = {
      position: point[point.length - 1],
      offset: new BMapGL.Size(0, 0)
    }
    const labelEnd = new BMapGL.Label("终点", labelopts2);
    labelEnd.setStyle(labelOpts)

    map.addOverlay(markStart)
    map.addOverlay(markEnd)
    map.addOverlay(labelStart)
    map.addOverlay(labelEnd)

    const showMsg = e => {
      const str = "当前位置：" + e.latLng.lng + ", " + e.latLng.lat
      $lulib.quickMessage(str, 1, -1);
    }

    markStart.addEventListener('click', showMsg)
    markEnd.addEventListener('click', showMsg)

    // https://lbs.baidu.com/index.php?title=jspopularGL/guide/trackAnimation
    setTimeout(() => $(".anchorBL").remove(), 50)
    map.enableScrollWheelZoom(true);
  }
})
