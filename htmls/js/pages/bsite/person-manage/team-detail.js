layui.use(['LuCommonTemplate', 'LuLayer'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer

  let luInnerHeader,
    luTable,
    luLayer,
    teamId,
    dataObj = {}

  class PageTemplate {
    contentInfoBox() {
      const dict = {
        company: '所属参建单位',
        teamNum: '班组人数',
        team: '班组工种',
        name: '班组长',
        idNum: '班组长身份证号码',
        phone: '班组长身份证号码',
      }
      let h = ''
      Object.keys(dict).forEach(d => {
        h += `<div class='top-item'>
                <div class='label'>${dict[d]}：</div>
                <div class='desc'>${dataObj[d]}</div>
              </div>`
      })
      return `<div class='top-title-box'>
                <div class='title'>${dataObj.team}</div>
              </div>
              <div class='top-content'>${h}</div>`
    }

    contentSearchBox() {
      return `<div class='select-box'>
                <form class='layui-form' lay-filter='search-form'>
                  <div class='layui-inline'>
                    <div class='layui-input-inline'>
                      <input type='text'
                             name='search'
                             autocomplete='off'
                             class='layui-input'
                             placeholder='请输入班组名称'>
                    </div>
                  </div>
                  <div class='layui-inline'>
                    <button type='button' class='layui-btn btn-weaken'lay-submit lay-filter='searchBtn'>搜索</button>
                  </div>
                </form>
                <div class='btn-box'>
                  <button class='layui-btn btn-primary-sec' id='triggerForm'>更新进场日期</button>
                  <button class='layui-btn' id='outFn'>退场</button>
                </div>
              </div>`
    }

    renderChangeInTimeForm() {
      return `<form class='layui-form layer-form layer-form-flex-colm team-add-form' action=''>
                <div class='layui-inline'>
                  <label class='layui-form-label required'>
                    <span>选择进场时间：</span>
                  </label>
                  <div class='layui-input-inline'>
                    <input type='text' name='date' lay-verify='required' placeholder='请选择' autocomplete='off' class='layui-input' id='dateInput'>
                  </div>
                </div>
                <div class='layui-layer-btn btn-box'>
                  <button type='button' lay-submit lay-filter='submit' class='layui-btn layui-layer-btn0'>保存</button>
                </div>
              </form>`
    }
  }

  const pt = new PageTemplate()
  !(async () => {
    getParams()
    renderInnerHeader()
    renderContent()
    await renderTable()
  })()

  function getParams() {
    const params = $lulib.getHashParams()
    teamId = +params.id
    Object.keys(params).forEach(key => (dataObj[key] = decodeURI(params[key])))
    if (!teamId) {
      $lulib.quickMessage('没有指定班组')
      $lulib.pageGoBack()
      throw new Error()
    }
  }

  function renderInnerHeader() {
    luInnerHeader = new LuInnerHeader({
      title: '班组管理',
      rightHtml: [{ txt: '返回', isWeaken: true }],
    })
  }

  function renderContent() {
    const topHtml = pt.contentInfoBox()
    const bottomHtml = pt.contentSearchBox()
    $('.content-top').html(topHtml)
    $('.content-bottom').html(bottomHtml)
  }

  form.on('submit(searchBtn)', data => {
    const { field } = data
    console.log(field.search)
  })

  async function renderTable() {
    const tableData = await $lulib.getMockData('/htmls/mock/bsite/teamDetailTableData.json', 5, '', false)
    // mock
    if (!tableData.some(item => item.isTeamLeader === true)) tableData[$lulib.randomInt(tableData.length - 1)].isTeamLeader = true
    const ctrlHtml = `<span>
                        <span class='table-ctrl-box'>
                          <span>{{d.isTeamLeader ? '是' : '否'}}</span>
                          <button class='layui-btn btn-weaken' lay-event style="display: {{d.isTeamLeader ? 'none' : 'block'}}">
                            设为班组长
                          </button>
                        </span>
                      </span>`
    const options = {
      page: false,
      cols: [
        $lulib.tableSetCenter([
          { type: 'checkbox', width: 41 },
          { type: 'numbers', title: '序号', width: 60 },
          { field: 'name', title: '姓名', minWidth: 140 },
          { field: 'idNum', title: '身份证号', minWidth: 230 },
          { field: 'type', title: '工种', width: 120 },
          { field: 'personType', title: '人员角色', width: 120 },
          { field: 'age', title: '年龄', width: 90 },
          { field: 'gender', title: '性别', width: 90 },
          { field: 'inTime', title: '进场时间', width: 144 },
          { field: 'outTime', title: '退场时间', width: 144 },
          { title: '是否为班组长', templet: ctrlHtml, minWidth: 280 },
        ]),
      ],
      hideHeadCheck: true,
      limit: tableData.length,
    }
    luTable = new LuTable(tableData, options)
    luTable.on('tool(table)', obj => {
      tableData.forEach(item => (item.isTeamLeader = item.id === obj.data.id))
      luTable.reload(tableData)
    })
  }

  function triggerForm() {
    if (!$lulib.checkSelected(luTable)) return false
    const content = pt.renderChangeInTimeForm()
    const opts = {
      title: '更新进场日期',
      id: 'teamChangeInTime',
      area: ['678px', '228px'],
      content,
    }
    luLayer = new LuLayer(opts)
    laydate.render({
      elem: '#dateInput',
      theme: '#007fff',
    })
  }

  form.on('submit(submit)', function (obj) {
    const { field } = obj
    luLayer.close()
  })

  function outFn() {
    if (!$lulib.checkSelected(luTable)) return false
    LuLayer.confirm('确定选中人员进场？', '提示')
  }

  $lulib.bindMethod([
    { dom: luInnerHeader.rightBtns[0], method: $lulib.pageGoBack },
    { dom: $('#triggerForm'), method: triggerForm },
    { dom: $('#outFn'), method: outFn },
  ])
})
