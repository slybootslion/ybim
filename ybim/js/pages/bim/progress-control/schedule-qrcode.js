layui.use(['LuCommonTemplate', 'LuLayer', 'zTree'], function() {
  const $ = layui.$

  const LuInnerHeader = layui.LuInnerHeader
  const LuUpload = layui.LuUpload
  const LuLayer = layui.LuLayer

  const zTree = layui.zTree

  class PageTemplate {
    asyncRenderContent (data) {
      console.log(data.f1)
      return `
        <div class="left border-top">
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title star">单项工程名称：</span>
          </div>
          <div class="table-item border-left w35">
            <input class="table-input" value='${data.f4 || ""}' type="text" placeholder="请输入单项工程名称">
          </div>
          <div class="table-item border-left w15">
            <span class="table-title star">单项工程概况：</span>
          </div>
          <div class="table-item border-rightleft w35">
            <textarea class='layui-textarea' placeholder="请输入项目概况，500字以内">${data.f5 
      || ""}</textarea>
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title star">关联任务：</span>
          </div>
          <div class="table-item border-left w35">
            <button class="btn selectMiBtn">选择任务</button>
            <span class='table-link'>查看关联任务</span>
          </div>
          <div class="table-item border-left w15">
            <span class="table-title">施工单位：</span>
          </div>
          <div class="table-item border-rightleft w35">
            <input class="table-input disabled" type="text" value="${data.f1}" disabled>
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title">标段：</span>
          </div>
          <div class="table-item border-left w35">
            <input class="table-input disabled" type="text" value="${data.f2}" disabled>
          </div>
          <div class="table-item border-left w15">
            <span class="table-title">监理单位：</span>
          </div>
          <div class="table-item border-rightleft w35">
            <input class="table-input disabled" type="text" value="${data.f3 || ''}" disabled>
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title star">现场负责人：</span>
          </div>
          <div class="table-item border-left w35">
            <input class="table-input" type="text" value='${data.f6 || ""}' placeholder="请输入现场负责人">
          </div>
          <div class="table-item border-left w15">
            <span class="table-title star">旁站监理：</span>
          </div>
          <div class="table-item border-rightleft w35">
            <input class="table-input" type="text" value='${data.f7 || ""}' placeholder="请输入旁站监理">
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title star">施工日期：</span>
          </div>
          <div class="table-item border-left w35">
            <input class="table-input" type="text" value='${data.f8 || ""}' id="dateConstruction" placeholder="请选择">
          </div>
          <div class="table-item border-left w15">
            <span class="table-title">里程桩号：</span>
          </div>
          <div class="table-item border-rightleft w35">
            <input class="table-input" type="text" value='${data.f9 || ""}' placeholder="请输入里程桩号">
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title">施工图片：</span>
          </div>
          <div class="table-item border-rightleft w85 table-fileup">
            <div class='upload-box'>
              <div class='file-box' id='fileBox'></div>
            </div>
            <div class='upload-file-placeholder'></div>
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title">施工工艺：</span>
          </div>
          <div class="table-item border-rightleft w85">
            <textarea class='layui-textarea' placeholder="请输入施工工艺，200字以内">${data.f10 || ""}</textarea>
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-left w15">
            <span class="table-title">备注：</span>
          </div>
          <div class="table-item border-rightleft w85">
            <textarea class='layui-textarea' placeholder="请输入备注，200字以内">${data.f11 || ""}</textarea>
          </div>
        </div>
        <div class="table-list border-bottom">
          <div class="table-item border-rightleft w100 h70px">
            <button class="layui-btn">生成二维码</button>
          </div>
        </div>
      </div>
      <div class="right">
        <h2 class="title">A标段工程路基路面</h2>
        <img class="pic" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9HSMFcO7nViL3Y6NZLAMhdXCPwn2CLadPj1q3inIHgRrPj_5BtuWYwR_Tn2xvD7cGcXA" alt="">
        <a class="link" href="javascript:void(0)">下载二维码</a>
      </div>
      `
    }

    contentTree (){
      return `
        <style>
          .m-tree-box {
            height: 100%;
          }
          
          .m-tree-box .ztree {
            height: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
          }
        </style>
        <div class='m-tree-box'>
          <div id='mTree' class="ztree"></div>
          <div class='layui-layer-btn btn-box'>
            <button type='button'  
                    class='layui-btn submit-btn'>
                    确定
            </button>
          </div>
        </div>
      `
    }
  }

  const pt = new PageTemplate()

  let luInnerHeader, luUpload, luLayer
  ;(async () => {
    innerHeaderRender()
    await renderContent()
  })()

  function innerHeaderRender () {
    luInnerHeader = new LuInnerHeader({
      title: '施工二维码',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  async function renderContent () {
    const params = $lulib.getHashParams()
    const editId = params.id

    // mock async
    const data = {
      f1: '陕西三秦路桥有限公司',
      f2: 'A标段',
      f3: '北京中交安通工程技术咨询有限公司'
    }

    if (editId) {
      // mock
      const res = (await $.get('/htmls/mock/bim/construcitonTableData.json')).info1
      data.f4 = res.i1
      data.f5 = res.i5
      data.f6 = res.i3
      data.f7 = res.i8
      data.f8 = res.i4
      data.f9 = res.i9
      data.f10 = res.i10
      data.f11 = res.i11
      data.image = res.image
    }

    const html = pt.asyncRenderContent(data)
    $("#infoContent").html(html)

    const opts = {
      el: '#fileBox',
      elFile: '.upload-file-placeholder',
      multiple: true,
      max: 20,
      limit: 10,
      accept: 'image/gif,image/jpg,image/jpeg,image/png',
      label: '上传图片',
      type: 'picture',
      desc: '支持jpg、jpeg、png格式，每张照片大小不超过10M，最多上传20张',
      success (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // mock
          setTimeout(() => luUpload.clearFin(file), $lulib.randomInt(10, 3) * 750)
        }
      }
    }
    luUpload = new LuUpload(opts)
    if (editId) {
      const pics = data.image.map(src => ({ name: `${$lulib.randomStr(9)}.jpg`, src }))
      luUpload.renderFileList([...pics], true)
    }
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: back }])

  $lulib.methodProxy.bindMethodProxy([
   { dom: 'body', domStr: '.selectMiBtn', method: selectMission },
   { dom: 'body', domStr: '.submit-btn', method: layerSubmit },
  ])

  function selectMission() {
    const options = {
      title: '选择任务',
      id: 'scheduleQrcodeSelectTree',
      area: ['560px', '620px'],
    }
    options.content = pt.contentTree()
    luLayer = new LuLayer(options)

    // mock
    const treeData = [
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
    const setting = {
      callback: {
        beforeClick: () => {},
        onClick: () => {},
      },
      check: {
        enable: true
      },
      view: {
        showLine: true,
      },
    }

    zTree.init($('#mTree'), setting, treeData)
  }

  function layerSubmit() {
    luLayer.close()
  }

  function back () {
    $lulib.pageGoBack()
  }
})
