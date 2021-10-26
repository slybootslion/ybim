layui.use([], function () {
  const $ = layui.$
  $(".bim-body .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
  })
})
