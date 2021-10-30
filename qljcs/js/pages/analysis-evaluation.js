layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm

  $(".analysis-evaluation .nav .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
  })

  $(".container-nav .nav-item").on('click', function () {
    const $this = $(this)
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.nav-item').removeClass('active')
  });

  $lulib.computedContentHeight('.page-container', $lulib.domWidthHeight('.analysis-evaluation .nav').height)

  const luSearchForm = new LuSearchForm([
    { label: '传感器一类型', type: 'select', selectData: [], name: 's1' },
    { label: '传感器二类型', type: 'select', selectData: [], name: 's2' },
    {
      label: '选择时间',
      type: 'date-d',
      options: { startName: 'sDate', endName: 'eDate' },
    },
    { label: '传感器一名称', type: 'select', selectData: [], name: 's3' },
    { label: '传感器二名称', type: 'select', selectData: [], name: 's4' },
  ], {
    submitBtnText: '开始比较',
    clearBtnText: '清空选择',
    submit (data) {
      console.log(data)
    }
  })

  const selectEvent = obj => {
    const name = $(obj.elem).attr('name')
    console.log(name)
    switch (name) {
      case 's1':
        break
      default:
        break
    }
  }

  const bindSelectEvent = () => {
    const filterArr = luSearchForm.data.filter(d => d.type === 'select')
    filterArr.forEach(s => luSearchForm.form.on(`select(${s.name})`, selectEvent))
  }
  bindSelectEvent()
})
