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
    if (!BMap) {
      return;
    }
    const map = new BMap.Map('map');
    map.centerAndZoom(new BMap.Point(121.491, 31.233), 19);
    map.setMapStyleV2({
      styleId: '96b3d8db07e7ccb0a5e4e5158f5f83c6'
    })
    // https://lbs.baidu.com/index.php?title=jspopularGL/guide/trackAnimation
    setTimeout(() => $(".anchorBL").remove(), 50)
    map.enableScrollWheelZoom(true);
  }
})
