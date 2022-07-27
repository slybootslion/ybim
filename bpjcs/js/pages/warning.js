layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuTable = layui.LuTable
  const form = layui.form
  const laydate = layui.laydate

  const dateElemStr = {
    start: `#dateStartInput`,
    end: `#dateEndInput`,
  }
  let currentDate = '全部'

  ;(() => {
    renderSearchForm()
    renderTable()

    bindSearchEvent()
  })()

  function renderDateInput () {
    const endEleStr = `<input type='text' name='eDate' autocomplete='off' class='layui-input' id='dateEndInput' disabled placeholder='请选择结束时间'>`
    const dateEndBoxEle = $(`.dateEndBox`)
    const maxDate = $lulib.getFormatTime('YYYY-MM-DD', new Date())

    function renderDateInput (elem, done, min = '', options) {
      const opts = {
        elem,
        theme: '#007fff',
        max: maxDate,
        ...options,
      }
      if (done) opts.done = done
      if (min) opts.min = min
      laydate.render(opts)
    }

    const startOpts = {}
    const endOpts = {}
    let endEle = $(dateElemStr.end)

    const handleEndInput = val => {
      endEle.remove()
      endEle = dateEndBoxEle.append(endEleStr).find(`${dateElemStr.end}`)
      endEle.attr({ disabled: false })
      renderDateInput(dateElemStr.end, () => $(".search-box .btn").each((i, e) => {
        $(e).removeClass('active')
        currentDate = ''
      }), val, { ...endOpts })
    }

    renderDateInput(dateElemStr.start, val => handleEndInput(val), '', { ...startOpts })

    if (!startOpts.value) {
      dateEndBoxEle.on('click', function () {
        const input = $(this).find('#dateEndInput')
        const isDisable = input.attr('disabled')
        if (isDisable) layer.msg('先选择开始时间')
      })
    } else {
      handleEndInput(startOpts.value)
    }
  }

  function renderSearchForm () {
    renderDateInput()

    form.on('submit(searchBtn)', function ({ field }) {
      console.log(field)
      console.log(currentDate)
    })

    form.render()
  }


  function bindSearchEvent () {
    const searchBox = $(".search-box")
    searchBox.on('click', '.btn', function (e) {
      const current = $(e.target)
      currentDate = current.html()
      current.addClass('active').siblings('.btn').removeClass('active')
      $(dateElemStr.start).val('')
      $(dateElemStr.end).val('')
    });

    searchBox.on('click', '.reset-btn', () => $(".search-box .btn-box .btn")
      .eq(0).addClass('active').siblings('.btn')
      .removeClass('active'));
  }

  function renderTable () {
  }
})
