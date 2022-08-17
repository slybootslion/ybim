layui.use(['echarts'], function () {
  const $ = layui.$
  const echarts = layui.echarts

  $(".container-nav .nav-item").on('click', async function () {
    const $this = $(this)
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.nav-item').removeClass('active')

  })
})
