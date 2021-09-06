layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const tree = layui.tree
  const element = layui.element

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  const treeInstance = []
  treeInstance.init = true
  const treeNodeIdQueue = []
  const blockCount = 6

  let luInnerHeader,
    luTable,
    currentRole,
    leftListData,
    currentTabIndex = 0,
    luLayer

  class PageTemplate {
    leftTemplate(data) {
      let h = ''
      for (let i = 0; i < data.length; i++) {
        const activeStr = currentRole.name === data[i].name ? 'active' : ''
        h += `
          <div class='list-item role-active ${activeStr}'>
            <p class='item-name txt-overflow'>${data[i].name}</p>
            <div class='edit-box'>
              <span class='iconfont icon-bianji' data-mark='${data[i].name}'></span>
              <span class='iconfont icon-shanchu1' data-mark='${data[i].name}'></span>
            </div>
          </div>
        `
      }
      return `
        <div class='select-box'>
          <form class='layui-form' lay-filter='search-form'>
            <div class='layui-inline'>
              <div class='layui-input-inline'>
                <input type='text'
                       autocomplete='off'
                       class='layui-input'
                       id='dateInput'
                       placeholder='请输入角色名称'>
              </div>
              <button type='button' class='layui-btn btn-weaken'>
                搜索
              </button>
            </div>
          </form>
        </div>
        <div class='list-box' id='roleListBox'>${h}</div>                   
      `
    }

    rightTemplate(rightData) {
      const { data, per } = rightData
      const block = ['花名册管理', '考勤管理', '工资管理', '视频监控', '环境监测', '基础数据管理']
      let htmlActiveTree = ``
      block.forEach((title, index) => {
        const idStr = `tree${index}`
        htmlActiveTree += `
          <div class='tab2-tree-box'>
            <div class='tree-title'>${title}</div>
            <div class='tree-content'>
              <div id='${idStr}'></div>
            </div>
          </div>
        `
      })

      const list = [
        { title: '本人相关', sub: '选择只能查看与本人相关的数据' },
        { title: '本公司相关', sub: '选择只能查看改角色所在的公司的相关数据' },
        { title: '全部', sub: '选择将查看所有的数据' },
      ]
      let htmlActivePre = ``
      for (let i = 0; i < 3; i++) {
        htmlActivePre += `<div class='tab3-item ${per === i ? 'active' : ''}'>
            <div class='title'>${list[i].title}</div>
            <div class='sub'>${list[i].sub}</div>
            <div class='tab3-item-mask change-data-per'></div>
          </div>`
      }

      let htmlTab = '',
        htmlTabContent = '',
        tabClassName,
        tabContentClassName
      const tabList = ['角色成员', '功能权限', '数据权限']
      for (let i = 0; i < 3; i++) {
        if (currentTabIndex === i) {
          tabClassName = 'layui-this'
          tabContentClassName = 'layui-show'
        } else {
          tabClassName = ''
          tabContentClassName = ''
        }
        // tab
        htmlTab += `<li class='${tabClassName}'><span>${tabList[i]}</span></li>`
        // tabContent
        if (i === 0) {
          htmlTabContent += `
          <div class='layui-tab-item ${tabContentClassName}'>
            <div class='content-table luTable'></div>
          </div>`
        }
        if (i === 1) {
          htmlTabContent += `
          <div class='layui-tab-item ${tabContentClassName}'>
            <button class='layui-btn btn-primary-sec select-all-btn'>全选</button>
            <div class='tab-1-box'>${htmlActiveTree}</div>
          </div>`
        }
        if (i === 2) {
          htmlTabContent += `
          <div class='layui-tab-item ${tabContentClassName}'>
            <div>${htmlActivePre}</div>
          </div>
          `
        }
      }

      return `
        <div class='description-box'>
          <div class='title'>${data.name}</div>
          <div class='desc'><span>${data.desc}</span></div>
        </div>
        <div class='layui-tab layui-tab-brief' lay-filter='role'>
          <ul class='layui-tab-title'>
<!--           class='layui-this' layui-show-->
            ${htmlTab}     
          </ul>
          <div class='layui-tab-content'>
            ${htmlTabContent}
          </div>
        </div>
      `
    }

    renderLayerForm(data) {
      const editData = { f1: '', f2: '' }
      if (data.name) {
        editData.f1 = data.name
        editData.f2 = data.desc
      }
      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form' action=''>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>角色名称：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text' 
                     name='name' 
                     lay-verify='required' 
                     placeholder='请输入用户名'
                     autocomplete='off'
                     value='${editData.f1}'
                     class='layui-input w335'></div>
          </div>
          <div class='layui-inline'>
            <label class='layui-form-label required'>
              <span>角色描述：</span>
            </label>
              <div class='layui-input-inline'>
                <textarea name='desc' placeholder='请输入角色描述' 
                          lay-verify='required'
                          class='layui-textarea w335'>${editData.f2}</textarea>
              </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' 
                    lay-submit
                    lay-filter='submit' 
                    class='layui-btn layui-layer-btn0'>保存</button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()
  ;(async () => {
    innerHeader()
    renderLeft()
    await renderRight()
  })()

  function innerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '角色权限',
      rightHtml: [{ txt: '新建角色' }],
    })
  }

  function renderLeft() {
    // mock
    leftListData = [
      { name: '超级管理员', desc: '超级管理员描述' },
      { name: '业主', desc: '业主描述' },
      { name: '管理处', desc: 'S107项目公路管理处，负责监督整个项目有序的进行，组织各个部门之前的大小往来会议并记录' },
      { name: '设计单位', desc: '描述' },
      { name: '监理单位', desc: '监理单位描述' },
      { name: '施工总工', desc: '施工总工描述' },
      { name: '工程员', desc: '工程员描述' },
      { name: '安全员', desc: '安全员描述' },
      { name: '质量监督员', desc: '质量监督员描述' },
    ]
    currentRole = { name: '超级管理员', desc: '超级管理员描述' }
    const html = pt.leftTemplate(leftListData)
    $('.left-box').html(html)
  }

  async function renderRight() {
    // table mock
    const data = await $lulib.getMockData('/htmls/mock/user/rolePermissionsTableData.json', $lulib.randomInt(10, 3), '', false)
    // checkbox mock
    const checkboxData = [
      {
        title: '人员注册',
        spread: true,
        id: 1,
        children: [
          { title: '人员添加', id: 2 },
          { title: '人员编辑', id: 3 },
          { title: '人员删除', id: 4 },
          {
            title: '查看人员',
            id: 5,
          },
        ],
      },
      { title: '花名册', id: 6, },
      { title: '班组管理', id: 7 },
      { title: '工人进退场查询', id: 8 },
      { title: '劳务合同管理', id: 8 },
    ]
    // per mock
    const per = $lulib.randomInt(2, 0)

    const rightData = {
      data: currentRole,
      per,
    }
    const html = pt.rightTemplate(rightData)
    $('.right-box').html(html)

    const options = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '用户名', width: 110 },
          { field: 't2', title: '姓名', width: 90 },
          { field: 't3', title: '所在公司', minWidth: 240 },
          { field: 't4', title: '岗位', width: 120 },
          { field: 't5', title: '联系电话', width: 160 },
        ]),
      ],
    }
    luTable = new LuTable(data, options)
    // tree checkbox
    for (let i = 0; i < blockCount; i++) {
      const id = $lulib.randomStr(6)
      const data = dataBindTreeId(checkboxData, id)
      treeInstance.push(
        tree.render({
          elem: `#tree${i}`,
          showLine: false,
          showCheckbox: true,
          onlyIconControl: true,
          oncheck: checkboxCallback,
          data,
          id,
        }),
      )
    }
    //
  }

  function dataBindTreeId(list, idStr) {
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      !(treeNodeIdQueue.indexOf(node.id) > -1) && treeNodeIdQueue.push(node.id)
      node.treeId = idStr
      if (node.children && node.children.length) node.children = dataBindTreeId(node.children, idStr)
    }
    return list
  }

  function checkboxCallback(o) {
    if (treeInstance.init) {
      if (blockCount - 1 === treeInstance.length) treeInstance.init = false
      return
    }
    // tree 当前树的实例 o 所选checkbox数据
    const tree = treeInstance.find(tree => o.data.treeId === tree.config.id)
    console.log(o)
  }

  async function leftActive() {
    $(this).addClass('active').siblings('.role-active').removeClass('active').find('.item-name')
    const name = $(this).find('.item-name').html().trim()
    if (name === currentRole.name) return
    treeInstance.length = 0
    treeInstance.init = true
    currentRole = leftListData.find(item => item.name === name)
    await renderRight()
  }

  async function changeDataPer() {
    const $this = $(this)
    $this.parent('.tab3-item').addClass('active').siblings('.tab3-item').removeClass('active')
  }

  function selectAll() {
    const $this = $(this)
    const t = $this.html()
    if (t === '全选') {
      $this.html('取消全选')
      treeInstance.forEach(t => tree.setChecked(t.config.id, treeNodeIdQueue))
    } else {
      $this.html('全选')
      treeInstance.forEach(tree => tree.reload(tree.config.id))
    }
  }

  $lulib.methodProxy.bindMethodProxy([
    { dom: '.left-box', domStr: '.role-active', method: leftActive },
    { dom: '.left-box', domStr: '.icon-bianji', method: leftEdit },
    { dom: '.left-box', domStr: '.icon-shanchu1', method: leftDel },
    { dom: '.right-box', domStr: '.change-data-per', method: changeDataPer },
    { dom: '.right-box', domStr: '.select-all-btn', method: selectAll },
  ])

  element.on('tab(role)', data => (currentTabIndex = +data.index))

  const layerForm = editData => {
    const options = {
      title: '新建角色',
      id: 'addNewRole',
      area: ['638px', '405px'],
    }
    if (!(editData instanceof MouseEvent)) options.title = '编辑角色'
    const data = { f1: '', f2: '' }
    options.content = pt.renderLayerForm(editData)
    luLayer = new LuLayer(options)
  }

  async function leftEdit(e) {
    e.stopPropagation()
    const mark = $(this).data('mark')
    const editData = leftListData.find(d => d.name === mark)
    layerForm(editData)
  }

  async function leftDel(e) {
    e.stopPropagation()
    const handleLeftDel = async () => {
      const mark = $(this).data('mark')
      leftListData = leftListData.filter(item => item.name !== mark)
      currentRole = leftListData[0]
      if (!currentRole) return
      const html = pt.leftTemplate(leftListData)
      $('.left-box').html(html)
      await renderRight()
    }
    LuLayer.confirm('确定删除？', handleLeftDel)
  }

  form.on('submit(submit)', function (data) {
    luLayer.close()
  })

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: layerForm }])
})
