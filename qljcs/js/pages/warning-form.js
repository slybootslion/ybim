layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuTable = layui.LuTable
  const LuSearchForm = layui.LuSearchForm
  const LuLayer = layui.LuLayer
  const form = layui.form
  const table = layui.table

  class PageTemplate {
    formTemplate (data) {
      const selHtml = LuSearchForm.selectTemplate(data)
      const blockList = [
        { label: '一级预警', name: 'f2' },
        { label: '二级预警', name: 'f3' },
        { label: '预警接收人' },
        { label: '三级预警', name: 'f4' },
        { label: '四级预警', name: 'f5' },
      ]
      let h = ''
      for (let i = 0; i < blockList.length; i++) {
        const item = blockList[i]
        if (item.label === '预警接收人') {
          h += `<div class="layui-inline">
                  <label class="layui-form-label">${item.label}：</label>
                  <div class="layui-input-inline name-layer">
                    <input disabled type="text" placeholder="请选择" class="layui-input">
                  </div>
                </div>`
          continue
        }
        h += `<div class="layui-inline">
                <label class="layui-form-label">${item.label}：</label>
                <div class="layui-input-inline">
                  <input type="text" name="${item.name}" autocomplete="off" class="layui-input">
                </div>
              </div>`
      }
      return `<div class="left">${selHtml}${h}</div>
              <div class="right">
                <button class="layui-btn" lay-submit lay-filter='submit'>添加阈值</button>
              </div>`
    }

    pListTemplate () {
      return `<input class="search-name-input" /><div class="luTableInner"></div>`
    }

  }

  const pt = new PageTemplate()
  let luLayer, luTable, luTableInner
  !(() => {
    const data = {
      label: '选择设备',
      name: 'f1',
      selectData: [
        { key: 'TP0015', value: '1' }
      ],
    }
    const html = pt.formTemplate(data)
    $("#warningForm").html(html)
    form.render()
  })()

  $(".page-back").on('click', () => $lulib.pageGoBack());

  form.on('submit(submit)', function (data) {
    console.log(data.field)
  })

  $lulib.methodProxy.bindMethodProxy([
    { dom: 'body', domStr: '.name-layer', method: handlerNameLayer },
  ])

  async function handlerNameLayer () {
    const pList = await $lulib.getMockData('/qljcs/mock/warningFormPeopleListData.json', 3, 'name', false)
    const opts = {
      title: '选择人员',
      id: 'selectPeopleName',
      area: ['578px', '468px'],
    }
    opts.content = pt.pListTemplate(pList)
    luLayer = new LuLayer(opts)

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox' },
          { field: 'name', title: '设备属性', width: 90 },
          { field: 'phone', title: '设备类型', minWidth: 120 },
          { field: 'company', title: '设备名称', minWidth: 120 },
        ]),
      ],
      el: $('.luTableInner'),
      id: 'tbInner',
      elem: '#tbInner',
      page: false,
    }
    luTableInner = new LuTable(pList, tableOptions)
  }

  handlerNameLayer()
})
