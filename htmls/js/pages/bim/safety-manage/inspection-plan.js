layui.use(['LuCommonTemplate', 'LuLayer', 'LuUtilsTemplate'], function () {
  const $ = layui.$
  const form = layui.form
  const laydate = layui.laydate

  const LuInnerHeader = layui.LuInnerHeader
  const LuTable = layui.LuTable
  const LuLayer = layui.LuLayer
  const luUtilsTemplate = layui.LuUtilsTemplate

  let luInnerHeader, luTable, luLayer

  class PageTemplate {
    renderNewPlanForm(data) {
      const { sel1, sel2 } = data

      const h1 = luUtilsTemplate.renderSelectOptions(sel1, '', 'key', 'value')
      const h2 = luUtilsTemplate.renderSelectOptions(sel2, '', 'key', 'value')

      return `
        <form class='layui-form layer-form layer-form-flex-colm team-add-form goods-form' action=''>
          <div class='add-account-box'>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>检查部位：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text'
                         name='f1'
                         lay-verify='required' 
                         placeholder='请输入' 
                         autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>任务类型：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required' name='f3'>
                    ${h1}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>责任人：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' name='f3' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>开始时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' 
                         placeholder='请输入'
                         id='dateStart'
                         autocomplete='off' class='layui-input' 
                         name='f7'>
                </div>
              </div>
            </div>
            <div class='box-item'>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>所属区域：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' name='f2'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>检查人：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' placeholder='请输入' autocomplete='off' class='layui-input' name='f4'>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>检查频率：</span>
                </label>
                <div class='layui-input-inline'>
                  <select lay-verify='required' name='f6'>
                    ${h2}
                  </select>
                </div>
              </div>
              <div class='layui-inline'>
                <label class='layui-form-label required'>
                  <span>截止时间：</span>
                </label>
                <div class='layui-input-inline'>
                  <input type='text' lay-verify='required' 
                         placeholder='请输入'
                         id='dateEnd'
                         autocomplete='off' class='layui-input' 
                         name='f8'>
                </div>
              </div>
            </div>
          </div>
          <div class='layui-layer-btn btn-box'>
            <button type='button' lay-submit lay-filter='submit' class='layui-btn'>确定添加</button>
          </div>
        </form>
      `
    }
  }

  const pt = new PageTemplate()

  ;(async () => {
    innerHeaderRender()
    await tableRender()
  })()

  function innerHeaderRender() {
    luInnerHeader = new LuInnerHeader({
      title: '安全检查计划',
      rightHtml: [{ txt: '新增计划' }],
    })
  }

  async function tableRender() {
    const data = await $lulib.getMockData('/htmls/mock/bim/safetyInspectionTableData.json', 13, '', false)

    const opts = {
      cols: [
        $lulib.tableSetCenter([
          { field: 'id', title: '序号', width: 60 },
          { field: 't1', title: '检查部位', minWidth: 190 },
          { field: 't2', title: '所属区域', minWidth: 120 },
          { field: 't3', title: '任务类型', minWidth: 120 },
          { field: 't4', title: '检查人', minWidth: 90 },
          { field: 't5', title: '开始时间', minWidth: 120 },
          { field: 't6', title: '责任人', minWidth: 90 },
          { field: 't7', title: '检查频率', minWidth: 90 },
          { field: 't8', title: '任务截止时间', minWidth: 120 },
        ]),
      ],
      ctrlData: [{ eventStr: 'info', txtStr: '查看详情' }],
      methods: {
        info,
      },
    }

    luTable = new LuTable(data, opts)
  }

  $lulib.bindMethod([{ dom: luInnerHeader.rightBtns[0], method: addNewPlan }])

  async function addNewPlan() {
    const data = await new Promise(resolve => {
      resolve({
        sel1: [
          { value: 1, key: '任务类型1' },
          { value: 2, key: '任务类型2' },
        ],
        sel2: [
          { value: 1, key: '1天/次' },
          { value: 2, key: '2天/次' },
        ],
      })
    })

    const content = pt.renderNewPlanForm(data)

    const opts = {
      title: '新增计划',
      id: 'newPlanForm',
      area: ['860px', '400px'],
      content,
    }
    luLayer = new LuLayer(opts)
    form.render()

    laydate.render({
      elem: `#dateEnd`,
      theme: '#007fff',
    })

    laydate.render({
      elem: `#dateStart`,
      theme: '#007fff',
    })
  }

  function info(data) {
    const { id } = data
    $lulib.pagePushHash(`bim/safety-manage/inspection-scel?id=${id}`)
  }

  form.on('submit(submit)', function (data) {
    const { field } = data
    console.log(field)
    luLayer.close()
  })
})
