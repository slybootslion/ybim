layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const LuInnerHeader = layui.LuInnerHeader

  let luInnerHeader
  ;(async () => {
    innerHeaderRender()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '设备监测',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: () => $lulib.pageGoBack() }])

})
