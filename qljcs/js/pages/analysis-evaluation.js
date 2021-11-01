layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuSearchForm = layui.LuSearchForm

  let luSearchForm, selectedObj = {};

  const getSelectData = async () => {
    // mock data
    return {
      s1: [{ value: '1', key: '位移计1' }, { value: '2', key: '位移计2' }],
      s2: [{ value: '1', key: '位移计1' }, { value: '2', key: '位移计2' }],
      s3: [{ value: '1', key: `传感器${$lulib.randomInt(2, 1)}` }, { value: '2', key: `传感器${$lulib.randomInt(5, 3)}` }],
      s4: [{ value: '1', key: `传感器${$lulib.randomInt(7, 6)}` }, { value: '2', key: `传感器${$lulib.randomInt(10, 8)}` }]
    }
  }

  const bindSelectEvent = (luSearchForm) => {
    if (!luSearchForm) return
    const filterArr = luSearchForm.data.filter(d => d.type === 'select')
    filterArr.forEach(s => luSearchForm.form.on(`select(${s.name})`, selectEvent))
  }

  (async () => {
    const data = await getSelectData()
    luSearchForm = renderLuSearchForm(data)
    bindSelectEvent(luSearchForm)
  })()

  $(".analysis-evaluation .nav .btn-item").on('click', async function () {
    const isActive = $(this).hasClass('active')
    if (isActive) return
    $(this).addClass('active').siblings('.btn-item').removeClass('active')
  })

  $(".container-nav .nav-item").on('click', async function () {
    const $this = $(this)
    const isActive = $this.hasClass('active')
    if (isActive) return
    $this.addClass('active').siblings('.nav-item').removeClass('active')
    renderLuSearchForm(await getSelectData())
  })

  $lulib.computedContentHeight('.page-container', $lulib.domWidthHeight('.analysis-evaluation .nav').height)

  const renderLuSearchForm = formData => {
    return new LuSearchForm([
      { label: '传感器一类型', type: 'select', selectData: formData.s1, name: 's1' },
      { label: '传感器二类型', type: 'select', selectData: formData.s2, name: 's2' },
      {
        label: '选择时间',
        type: 'date-d',
        options: {
          startName: 'sDate', endName: 'eDate', options: { startValue: formData.sDate, endValue: formData.eDate }
        },
      },
      { label: '传感器一名称', type: 'select', selectData: formData.s3, name: 's3' },
      { label: '传感器二名称', type: 'select', selectData: formData.s4, name: 's4' },
    ], {
      submitBtnText: '开始比较',
      clearBtnText: '清空选择',
      submit (data) {
        console.log(data)
      },
      async clearForm (data) {
        // mock data
        const sd = await getSelectData()
        renderLuSearchForm(sd)
      },
    })
  }


  const selectEvent = async obj => {
    const name = $(obj.elem).attr('name')
    const renderSearchFormPar = async () => {
      const formData = luSearchForm.form.val('search-form')
      const data = await getSelectData()
      if (formData.s1) {
        data.s1.forEach(item => {
          if (item.value === formData.s1) item.selected = true
        })
      }
      if (formData.s2) {
        data.s2.forEach(item => {
          if (item.value === formData.s2) item.selected = true
        })
      }
      if (formData.sDate) data.sDate = formData.sDate
      if (formData.eDate) data.eDate = formData.eDate
      renderLuSearchForm(data)
    }
    switch (name) {
      case 's1':
      case 's2':
        await renderSearchFormPar()
        break
      default:
        break
    }
  }


})
