layui.use(['form'], function () {
  const $ = layui.$
  const layuiForm = layui.form;

  function searchEventHandler () {
    // const btns = $(".top-search .layui-btn-xs")
    $(".top-search").on('click', '.layui-btn-xs', function (e) {
      const $t = $(this)
      const isActive = $t.hasClass('layui-btn-normal')
      if (isActive) {
        $t.removeClass('layui-btn-normal')
      } else {
        $t.addClass('layui-btn-normal').siblings('.layui-btn-xs').removeClass('layui-btn-normal')
      }
    })
  }

  searchEventHandler()

  layuiForm.on('submit(searchInput)', function (data) {
    const val = layuiForm.val('searchInput')
    console.log(val.search)

    return false;
  })

  $(".add-btn").on('click',function () {
    console.log('--- add ---')
  });

})
