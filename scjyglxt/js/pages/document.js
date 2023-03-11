layui.use(['form', 'LuCommonTemplate'], function () {
  const $ = layui.$
  const layuiForm = layui.form;
  const LuTable = layui.LuTable

  let luTable;

  function searchEventHandler () {
    // const btns = $(".top-search .layui-btn-xs")
    $(".top-search").on('click', '.layui-btn-xs', function (e) {
      const $t = $(this)
      const isActive = $t.hasClass('layui-btn-normal')
      if (isActive) {
        $t.removeClass('layui-btn-normal')
      } else {
        $t.addClass('layui-btn-normal').siblings('.layui-btn-xs').removeClass('layui-btn-normal')
      }
    })
  }

  searchEventHandler()

  layuiForm.on('submit(searchInput)', function (data) {
    const val = layuiForm.val('searchInput')
    console.log(val.search)
    return false;
  })

  $(".add-btn").on('click', function () {
    console.log('--- add ---')
  });

  async function renderTable () {
    const data = await $lulib.getMockData('/scjyglxt/mock/docData.json', 8, null, false)
    const linkTemplate = `
      <span>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="m1" title="a">
          <span class="iconfont icon-bianji"></span>
        </a>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="m2" title="b">
          <span class="iconfont icon-mima"></span>
        </a>
        <a href="javascript:void(0)" class="table-tool-link" lay-event="m3" title="c">
          <span class="iconfont icon-xiangmu"></span>
        </a>
      </span>      
    `
    const tableOptions = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '编号', width: 60 },
          { field: 't1', title: '文件编码', width: 160 },
          { field: 't2', title: '文件名称', width: 290 },
          { field: 't3', title: '所属项目', width: 400 },
          { field: 't4', title: '项目编码', width: 200 },
          { field: 't5', title: '所属部门', width: 130 },
          { field: 't6', title: '上传人', width: 110 },
          { field: 't7', title: '上传时间', width: 140 },
          { title: '附件', width: 60 },
          { field: 't8', title: '文件大小', width: 90 },
          { title: '操作', templet: linkTemplate, align: 'center' },
        ]),
      ],
      limit: 16,
      methods: { m1, m2, m3 },
    }
    luTable = new LuTable(data, tableOptions)
    luTable.tableOn()
  }

  function m1 () {
    console.log('m1')
  }

  function m2 () {
    console.log('m2')
  }

  function m3 () {
    console.log('m3')
  }

  renderTable()


})
