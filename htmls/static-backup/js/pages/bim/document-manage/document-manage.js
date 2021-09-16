layui.use(['LuCommonTemplate', 'LuLayer', 'zTree'], function () {
  const $ = layui.$
  const util = layui.util
  const form = layui.form

  const zTree = layui.zTree

  const LuInnerHeader = layui.LuInnerHeader
  const LuSearchForm = layui.LuSearchForm
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  const luUtilsTemplate = layui.LuUtilsTemplate
  const LuUpload = layui.LuUpload

  let luInnerHeader,
    luTable,
    currentName = '全部类别',
    luLayer,
    luUpload

  class PageTemplate {
    renderLayerForm(data) {
      const editData = { t1: '' }
      const s1 = luUtilsTemplate.renderSelectOptions(data.f1, editData.t1, 'key', 'value')

      const uploadHtml = `<div class='content-body content-upload layui-form'>
                            <div class='upload-box'>
                              <div class='file-box' id='fileBox'></div>
                            </div>
                            <div class='upload-file-placeholder'></div>
                          </div>`

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='layui-inline input-first'>
              <label class='layui-form-label'>
                <span>所属标段：</span>
              </label>
              <div class='layui-input-inline'>
                <select name='t1'>
                  ${s1}
                </select>
              </div>
            </div>
            <div class='layui-inline'>
            <label class='layui-form-label'>
              <span>文件类型：</span>
            </label>
            <div class='layui-input-inline'>
              <input type='text'
                     disabled 
                     class='layui-input' 
                     value='${data.f2}'>
            </div>
          </div>
            <div class='layui-inline'>
              <label class='layui-form-label'>
                <span>日期：</span>
              </label>
              <div class='layui-input-inline'>
                <input type='text'
                       disabled 
                       class='layui-input' 
                       value='${data.f3}'>
              </div>
            </div>
            <div class='layui-inline'>
              <label class='layui-form-label'>
                <span>上传者：</span>
              </label>
              <div class='layui-input-inline'>
                <input type='text'
                       disabled 
                       class='layui-input' 
                       value='${data.f4}'>
              </div>
            </div>
            <div class='layui-inline'>
              <label class='layui-form-label'>
                <span>所属公司：</span>
              </label>
              <div class='layui-input-inline'>
                <input type='text'
                       disabled 
                       class='layui-input' 
                       value='${data.f5}'>
              </div>
            </div>
            <div class='layui-inline'>
              <label class='layui-form-label'>
                <span>选择文件：</span>
              </label>
              <div class='layui-input-inline'>
                ${uploadHtml}
              </div>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' 
                    lay-submit 
                    lay-filter='submit' 
                    class='layui-btn'>
                    确定添加
            </button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    renderTree()
    await initTable()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '文档管理',
      rightHtml: [{ txt: '文件上传' }],
    })
  }

  function renderTree() {
    // 树结构数据
    const zNodes = [
      {
        name: '全部类别',
        open: true,
        children: [
          {
            name: '立项审批',
            open: false,
            children: [{ name: '工可', iconSkin: '' }],
          },
          {
            name: '设计审批',
            open: false,
            children: [
              { name: '初步设计', iconSkin: '' },
              { name: '施工图设计', iconSkin: '' },
              { name: '重大设计变更', iconSkin: '' },
              { name: '初步设计', iconSkin: '' },
              { name: '施工图设计', iconSkin: '' },
              { name: '重大设计变更', iconSkin: '' },
              { name: '初步设计', iconSkin: '' },
              { name: '施工图设计', iconSkin: '' },
              { name: '重大设计变更', iconSkin: '' },
            ],
          },
          {
            name: '工程准备',
            open: false,
            children: [
              {
                name: '征地拆迁资料',
                open: true,
                children: [
                  {
                    name: '建设用地申请及批复文件',
                    open: true,
                    children: [
                      { name: '征地申请报告', iconSkin: '' },
                      { name: '建设用地规划图及许可证', iconSkin: '' },
                      { name: '用地范围图、地形图', iconSkin: '' },
                      { name: '建设用地呈报表及批复', iconSkin: '' },
                      { name: '土地使用证', iconSkin: '' },
                    ],
                  },
                  {
                    name: '征地拆迁合同、协议',
                    open: true,
                    children: [
                      { name: '农田水利设施拆迁', iconSkin: '' },
                      { name: '管线拆迁', iconSkin: '' },
                      { name: '房屋拆迁及安置', iconSkin: '' },
                      { name: ' 相关税费缴纳凭证、合同及其他', iconSkin: '' },
                      { name: '征地拆迁及其他工程数量明细表', iconSkin: '' },
                      { name: '其他工程拆迁相关资料', iconSkin: '' },
                      { name: '农田水利设施拆迁', iconSkin: '' },
                      { name: '管线拆迁', iconSkin: '' },
                      { name: '房屋拆迁及安置', iconSkin: '' },
                      { name: ' 相关税费缴纳凭证、合同及其他', iconSkin: '' },
                      { name: '征地拆迁及其他工程数量明细表', iconSkin: '' },
                      { name: '其他工程拆迁相关资料', iconSkin: '' },
                    ],
                  },
                  {
                    name: '施工许可申请及批准文件',
                    open: true,
                    isParent: true,
                    children: [
                      { name: '房屋拆迁及安置', iconSkin: '' },
                      { name: ' 相关税费缴纳凭证、合同及其他', iconSkin: '' },
                      { name: '征地拆迁及其他工程数量明细表', iconSkin: '' },
                    ],
                  },
                  {
                    name: '设计交底资料',
                    open: true,
                    children: [
                      { name: '施工技术交底', iconSkin: '' },
                      { name: '房屋拆迁及安置', iconSkin: '' },
                      { name: ' 相关税费缴纳凭证、合同及其他', iconSkin: '' },
                      { name: '征地拆迁及其他工程数量明细表', iconSkin: '' },
                      { name: '其他工程拆迁相关资料', iconSkin: '' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    // 树结构回调函数设置
    const setting = {
      callback: {
        beforeClick: beforeClick,
        onClick: onClick,
      },
      view: {
        showLine: true,
      },
    }

    // 点击更新数据
    const updateNode = ele => {
      currentName = ele.name
      $('#treeId').html(currentName)
    }

    //树结构
    function beforeClick(treeId, treeNode, clickFlag) {
      return treeNode.click !== false
    }

    //树结构 点击触发选中
    function onClick(event, treeId, treeNode, clickFlag) {
      updateNode(treeNode)
    }

    zTree.init($('#fileList'), setting, zNodes)
  }

  function computedTableBoxSize() {
    const $bodyPage = $('#bodyOnePage')
    const bodyHeight = $bodyPage.height()
    const bodyWidth = $bodyPage.width()
    const RightHeight = bodyHeight - 50 - 42
    const leftWidth = parseInt((bodyWidth * 0.18).toString())
    const rightWidth = bodyWidth - leftWidth
    $('.rightDom').css({ minHeight: RightHeight, width: rightWidth })
    $('.leftDom').css({ width: leftWidth })
  }

  async function initTable() {
    computedTableBoxSize()
    searchFormRender()
    const data = await $lulib.getMockData('/htmls/mock/bim/filesTableData.json', 12, '', false)

    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '文件名称', minWidth: 180 },
          { field: 't2', title: '文件类别', minWidth: 120 },
          { field: 't3', title: '所属标段', minWidth: 120 },
          { field: 't4', title: '上传者', minWidth: 90 },
          { field: 't5', title: '所属公司', minWidth: 90 },
          { field: 't6', title: '上传日期', minWidth: 90 },
          { field: 't7', title: '文件大小', minWidth: 120 },
        ]),
      ],
      ctrlData: [
        { eventStr: 'edit', txtStr: '编辑' },
        { eventStr: 'download', txtStr: '下载' },
        { eventStr: 'del', txtStr: '删除' },
      ],
      methods: {
        edit,
        download,
        del,
      },
    }
    luTable = new LuTable(data, tableOptions)
  }

  function edit(obj) {
    uploadForm(obj)
  }

  function download(obj) {}

  function del(_, obj) {
    LuLayer.confirm('确定删除？', () => obj.del())
  }

  function searchFormRender() {
    new LuSearchForm([
      {
        label: '所属标段',
        type: 'select',
        selectData: [
          { value: '1', key: '全部' },
          { value: '2', key: '标段1' },
        ],
      },
      { label: '文件名称', type: 'text' },
      { label: '上传日期', type: 'date-s' },
    ])
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: uploadForm }])

  function uploadForm(editData) {
    const opts = {
      title: '文件上传',
      id: 'fileUploadForm',
      area: ['700px', '460px'],
    }
    // mock
    const data = {
      f1: [
        { value: 1, key: '全部' },
        { value: 2, key: '标段1' },
      ],
      f2: currentName,
      f3: util.toDateString(new Date(), 'yyyy-MM-dd'),
      f4: 'admin',
      f5: '西安市公路管理处',
    }
    opts.content = pt.renderLayerForm(data)
    luLayer = new LuLayer(opts)
    form.render()

    const uploadOpts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      label: '上传文件',
      max: 10,
      limit: 20,
      multiple: true,
      success(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      },
    }

    luUpload = new LuUpload(uploadOpts)
    patchForm()
  }

  function patchForm() {
    $('#fileUploadForm').parents('.layui-layer.layui-layer-page').css({ height: 'auto' })
  }
})
