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
  let luTable

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


  async function renderTable () {
    const data = await $lulib.getMockData('/bpjcs/mock/warningTableData.json', 8, null, false)
    const dict = { 1: 'red', 2: 'orange', 3: 'yellow', 4: 'blue' }
    const handleT4Template = d => {
      const t5 = d.t5
      if (!t5) return t5 + '级'
      return `<span class="iconfont icon-yujing ${dict[t5]}"></span>`
    }
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '预警时间', width: 150 },
          { field: 't2', title: '传感器', width: 160 },
          { field: 't3', title: '检测类型', width: 170 },
          { field: 't4', title: '预警描述', width: 820 },
          { title: '预警等级', width: 90, templet: handleT4Template },
        ]),
      ],
      ctrlData: [
        { eventStr: 'info', txtStr: '查看详情 》' },
      ],
      methods: {
        info (data) {
          console.log(data)
        },
      },
    }
    luTable = new LuTable(data, tableOptions)
  }
})
