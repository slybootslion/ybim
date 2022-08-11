layui.use(['echarts'], function () {
  const $ = layui.$
  const form = layui.form
  const echarts = layui.echarts

  checkboxRender()
  const checkItems = $(".layui-form .check-item")
  const checkAll = $(".layui-form .check-all")
  form.on('checkbox', function (data) {
    const itemName = data.elem.name
    const checked = data.elem.checked
    if (itemName === 'checkAll') {
      checkItems.each((idx, el) => {
        el.checked = checked
      })
    } else {
      if (checked) {
        let count = 0
        checkItems.each((idx, el) => {
          if (el.checked) count++
        })
        if (count === 5) {
          checkAll[0].checked = checked
        }
      } else {
        checkAll[0].checked = checked
      }
    }
    checkboxRender()
  })

  function checkboxRender () {
    form.render()
  }
})
