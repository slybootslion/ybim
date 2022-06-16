layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuTable = layui.LuTable
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const form = layui.form

  let luLayer, luTable, luTableInner, selectedList = [], pList, orgList = []

  class PageTemplate {
    formTemplate (data) {
      const blockList = [
        { label: '一级预警最低值', name: 'f2' },
        { label: '一级预警最高值', name: 'f21' },
        { label: '二级预警最低值', name: 'f3' },
        { label: '二级预警最高值', name: 'f31' },
        { label: '三级预警最低值', name: 'f4' },
        { label: '三级预警最高值', name: 'f41' },
        { label: '四级预警最低值', name: 'f5' },
        { label: '四级预警最高值', name: 'f51' },
        { label: '预警接收人' },
      ]
      if (data.editData) {
        data.selectData.forEach(d => {
          if (d.key === data.editData.t1) d.selected = true
        })
      }
      const selHtml = LuSearchForm.selectTemplate(data)
      let h = ''
      for (let i = 0; i < blockList.length; i++) {
        const item = blockList[i]
        if (data.editData) {
          if (item.name === 'f2') item.value = data.editData.t4
          if (item.name === 'f21') item.value = data.editData.t41
          if (item.name === 'f3') item.value = data.editData.t5
          if (item.name === 'f31') item.value = data.editData.t51
          if (item.name === 'f4') item.value = data.editData.t6
          if (item.name === 'f41') item.value = data.editData.t61
          if (item.name === 'f5') item.value = data.editData.t7
          if (item.name === 'f51') item.value = data.editData.t71
        }
        if (item.label === '预警接收人') {
          h += `<div class="layui-inline">
                  <label class="layui-form-label w120">${item.label}：</label>
                  <div class="layui-input-inline">
                    <span class="layui-input name-layer">请选择</span>
                  </div>
                </div>`
          continue
        }
        h += `<div class="layui-inline">
                <label class="layui-form-label w120">${item.label}：</label>
                <div class="layui-input-inline">
                  <input type="text" name="${item.name}" value="${item.value || ''}" autocomplete="off" class="layui-input w197">
                </div>
              </div>`
      }
      return `<div class="left">
                ${selHtml.replace("class='layui-form-label'", "class='layui-form-label w120'")}${h}
                <div class="name-list-placeholder"></div>
              </div>
              <div class="right">
                <button type="button" class="layui-btn" lay-submit lay-filter='submit'>添加阈值</button>
              </div>`
    }

    pListTemplate () {
      return `<input class="search-name-input" /><div class="luTableInner"></div>`
    }

  }

  const pt = new PageTemplate()
  !(async () => {
    await renderTable()
    await renderForm()
  })()

  async function renderForm (editData) {
    // mock
    const selectData = [
      { key: 'TP0015', value: '1' },
      { key: 'TP0035', value: '2' },
    ]
    const data = {
      label: '选择设备',
      name: 'f1',
      selectData,
    }
    if (editData) data.editData = editData
    const html = pt.formTemplate(data)
    $("#warningForm").html(html)
    form.render()
    if (editData) {
      // mock data
      const pData = {
        id: 1,
        name: "王菲",
        phone: "18629612145",
        company: "柏嘉交通科技有限公司"
      }
      selectedList = [pData]
      renderSelectedNameList()
    }
  }

  $(".page-back").on('click', () => $lulib.pageGoBack());

  form.on('submit(submit)', function (data) {
    console.log(data.field)
  })

  async function renderTable () {
    const tableData = await $lulib.getMockData('/qljcs/mock/warningSettingTableData.json', 8, null, false)

    const tableTemplate1 = d => `<span>${d.t4}, ${d.t41}</span>`
    const tableTemplate2 = d => `<span>${d.t5}, ${d.t51}</span>`
    const tableTemplate3 = d => `<span>${d.t6}, ${d.t61}</span>`
    const tableTemplate4 = d => `<span>${d.t7}, ${d.t71}</span>`


    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '传感器编号' },
          { field: 't2', title: '设备类型' },
          { field: 't3', title: '设备名称' },
          { title: '一级预警', templet: tableTemplate1},
          { title: '二级预警', templet: tableTemplate2},
          { title: '三级预警', templet: tableTemplate3},
          { title: '四级预警', templet: tableTemplate4},
          { field: 't8', title: '预警接收人', width: 160 },
          { field: 't9', title: '接收人电话', width: 180 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji1', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu', txtStr: '删除' },
      ],
      methods: {
        edit (data) {
          renderForm(data)
        },
        del (_, obj) {
          LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
      limit: 12
    }
    luTable = new LuTable(tableData, options)
  }

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.name-layer', method: handlerNameLayer },
    { dom: 'body', domStr: '.name-item-del', method: delNameItem },
    { dom: 'body', domStr: '.search-name-input', evStr: 'input', method: handlerNameSearch },
  ])

  async function handlerNameLayer () {
    pList = await $lulib.getMockData('/qljcs/mock/warningFormPeopleListData.json', 2, 'name', false)
    const opts = {
      title: '选择人员',
      id: 'selectPeopleName',
      area: ['678px', '468px'],
    }
    opts.content = pt.pListTemplate()
    luLayer = new LuLayer(opts)
    if (selectedList.length) {
      const slIds = selectedList.map(s => s.id)
      pList.forEach(item => {
        if (slIds.includes(item.id)) item.LAY_CHECKED = true
      })
    }
    renderInnerTable(pList)
  }

  // 如果有性能问题，这个方法需要加防抖
  async function handlerNameSearch (e) {
    orgList = [...pList]
    const value = e.target.value.trim()
    let list = null
    if (!value) list = orgList
    else list = pList.filter(item => item.name.includes(value))
    renderInnerTable(list)
  }

  function renderInnerTable (pList) {
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox' },
          { field: 'name', title: '姓名', width: 100 },
          { field: 'phone', title: '联系电话', width: 120 },
          { field: 'company', title: '所属公司', minWidth: 160 },
        ]),
      ],
      el: $('.luTableInner'),
      id: 'tbInner',
      elem: '#tbInner',
      page: false,
      hideHeadCheck: true,
      filter: 'innerTable',
    }
    luTableInner = new LuTable(pList, tableOptions)

    luTableInner.on('checkbox(innerTable)', obj => {
      if (obj.checked) selectedList.push(obj.data)
      else selectedList = selectedList.filter(data => data.id !== obj.data.id)
      renderSelectedNameList()
    })
  }

  function delNameItem () {
    const id = $(this).data('id')
    selectedList = selectedList.filter(item => item.id !== id)
    renderSelectedNameList()
  }

  function renderSelectedNameList () {
    let h = ''
    for (let i = 0; i < selectedList.length; i++) {
      const item = selectedList[i]
      h += `<div class="name-item"><span>${item.name}</span><span>${item.phone}</span><span>${item.company}</span><span class="iconfont icon-guanbi name-item-del" data-id="${item.id}"></span></div>`
    }
    $(".name-list-placeholder").html(h)
  }
})
