layui.use(['LuCommonTemplate', 'LuLayer', 'LuUtilsTemplate'], function () {
  const $ = layui.$
  const form = layui.form

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const lut = layui.LuUtilsTemplate
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  let categoryList, luLayer, luInnerHeader

  class PageTemplate {
    addCategorySettings() {
      const h = this.renderCategoryList(categoryList)
      return `
        <div class='layui-form layer-form add-category-settings' action=''>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>类别名称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     data-id
                     lay-verify='required' 
                     placeholder='请输入20字以内的类别名称' 
                     autocomplete='off' 
                     class='layui-input add-category-settings-input'>
            </div>
            <button type='button' class='layui-btn add-category-btn'>确定</button>
          </div>
        </div>
        <div class='category-list-box'>
          <ul>
            ${h}
          </ul>
        </div>
      `
    }

    goodsFormSetting(data) {
      const sel1 = data.sel1
      const sel2 = data.sel2

      let editData = { t1: '', t2: '', t3: '', t4: '', t10: '', t8: '' }
      if (data.editData) editData = data.editData

      const h1 = lut.renderSelectOptions(sel1, editData.t2, 'name')
      const h2 = lut.renderSelectOptions(sel2, editData.t4, 'title')

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>所属类别：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required'>
                    ${h1}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>规格型号：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${editData.t3}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>最低库存：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${editData.t10}'>
                </div>
              </div>
            </div>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>货品名称：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${editData.t1}'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>单位：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required'>
                    ${h2}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>最高库存：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' value='${editData.t8}'>
                </div>
              </div>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' lay-submit lay-filter='submit' class='layui-btn'>确认</button>
          </div>
        </form>
      `
    }

    renderCategoryList(list = []) {
      let i = 0
      const len = list.length
      let h = ''
      for (; i < len; i++) {
        h += `<li class='category-list-item'>
                <span class='item-name'>
                  ${list[i].name}
                </span>
                <span class='btn-box'>
                  <a class='btn-box-edit' 
                     data-id='${list[i].id}' 
                     href='javascript:void(0)'>编辑</a>
                  <a class='btn-box-del'
                     data-id='${list[i].id}'
                     href='javascript:void(0)'>删除</a>
                </span>
              </li>`
      }
      return h
    }

    renderListBox(list) {
      const h = this.renderCategoryList(list)
      $('.category-list-box').html(`<ul>${h}</ul>`)
    }
  }

  const pt = new PageTemplate()

  !(async () => {
    innerHeaderRender()
    searchFormRender()
    await tableRender()
    await categoryRender()
    initMethods()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '货品管理',
      rightHtml: [{ txt: '货品类别设置' }, { txt: '新增货品' }],
    })
  }

  function searchFormRender() {
    new LuSearchForm(
      [
        { label: '货物类别', type: 'select', selectData: [], name: 's1' },
        { label: '货品名称', type: 'text', name: 's2' },
      ]
    )
  }

  async function tableRender() {
    const tableData = await $lulib.getMockData('/htmls/mock/bim/inventoryManageTableData.json', 7, '', false)
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 50 },
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '货物名称', minWidth: 180 },
          { field: 't2', title: '货物类别', minWidth: 120 },
          { field: 't3', title: '规格型号', minWidth: 120 },
          { field: 't4', title: '单位', width: 90 },
          { field: 't10', title: '最低库存', width: 90 },
          { field: 't8', title: '最高库存', width: 90 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', iconStr: 'icon-bianji', txtStr: '编辑' },
        { eventStr: 'del', iconStr: 'icon-shanchu1', txtStr: '删除' },
      ],
      methods: {
        edit(data) {
          addNewGoods(data)
        },
        del(_, obj) {
          LuLayer.confirm('确定删除？', () => obj.del())
        },
      },
    }
    const lt = new LuTable(tableData, tableOptions)
  }

  async function categoryRender() {
    categoryList = await new Promise(resolve => {
      resolve([
        { id: 1, name: '机械设备' },
        { id: 2, name: '日用品类及零食等' },
        { id: 3, name: '骨料' },
        { id: 4, name: '机电等' },
        { id: 5, name: '钢结构材料等' },
        { id: 6, name: '五金电器装饰材料等' },
        { id: 7, name: '易耗用品' },
      ])
    })
  }

  function initMethods() {
    function categorySettings() {
      const formHtml = pt.addCategorySettings()
      const opts = {
        title: '货品类别设置',
        id: 'addCategorySettings',
        area: ['600px', '500px'],
        content: formHtml,
      }
      luLayer = new LuLayer(opts)
    }

    function submitCategory() {
      const input = $('.add-category-settings-input')
      const val = input.val().trim()
      const id = +input.attr('data-id')
      if (!val || val.length > 20) {
        layer.msg('没有填写内容，或内容过长')
        return
      }
      if (!id) {
        categoryList.push({ id: $lulib.randomInt(999, 100), name: val })
      } else {
        const item = categoryList.find(item => item.id === id)
        item.name = val
      }
      pt.renderListBox(categoryList)
      input.val('')
      input.attr('data-id', '')
    }

    function delCategory() {
      const itemThisId = $(this).data('id')
      layer.confirm('确认删除?', { icon: 7, title: '注意' }, function (index) {
        categoryList = categoryList.filter(item => item.id !== itemThisId)
        pt.renderListBox(categoryList)
        layer.close(index)
      })
    }

    function editCategory() {
      const itemThisId = $(this).data('id')
      const input = $('.add-category-settings-input')
      const item = categoryList.find(item => item.id === itemThisId)
      input.val(item.name)
      input.attr('data-id', item.id)
    }

    $lulib.bindMethod([
      { dom: luInnerHeader.rightBtns[0], method: categorySettings },
      { dom: luInnerHeader.rightBtns[1], method: addNewGoods },
    ])

    $lulib.methodProxy.bindMethodProxy([
      { dom: 'body', domStr: '.add-category-btn', method: submitCategory },
      { dom: 'body', domStr: '.category-list-item .btn-box-edit', method: editCategory },
      { dom: 'body', domStr: '.category-list-item .btn-box-del', method: delCategory },
    ])
  }

  async function addNewGoods(editData) {
    const sel1 = categoryList
    const sel2 = await new Promise(resolve => {
      resolve([
        { id: 1, title: '单位1' },
        { id: 2, title: '吨' },
      ])
    })

    const data = { sel1, sel2 }

    const opts = {
      id: 'goodsForm',
      area: ['860px', '360px'],
    }
    let formHtml
    if (!(editData instanceof MouseEvent)) {
      opts.title = '修改货品'
      data.editData = editData
    } else {
      opts.title = '新增货品'
    }
    formHtml = pt.goodsFormSetting(data)
    opts.content = formHtml

    luLayer = new LuLayer(opts)
    form.render()
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })
})
