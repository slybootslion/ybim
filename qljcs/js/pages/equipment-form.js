layui.use(['LuCommonTemplate'], function () {
  const $ = layui.$
  const LuLayer = layui.LuLayer
  const LuTable = layui.LuTable
  const form = layui.form


  $(".page-back").on('click', () => $lulib.pageGoBack())

  class PageTemplate {
    renderContainer (data) {
      console.log(data)
      const html = `
    <form class="layui-form">
      <div class="info-block">
        <div class="top-title">${data.n1}</div>
        <div class="info-item-box">
          <div class="info-item">
            <div class="label">设备属性：</div>
            <div class="desc">${data.n2}</div>
          </div>
          <div class="info-item">
            <div class="label">设备类型：</div>
            <div class="desc">${data.n3}</div>
          </div>
          <div class="info-item">
            <div class="label">设备状态：</div>
            <div class="desc">${data.n4}</div>
          </div>
        </div>
      </div>
      <div class="info-block">
        <div class="form-title">基本信息</div>
          <div class="form-box">
          <div class="layui-form-item">
            <label class="layui-form-label w120">安装位置：</label>
            <div class="layui-input-block">
              <input type="text" name="n5" placeholder="请输入" value="${data.n5 || ''}"
              autocomplete="off" class="layui-input w350">
            </div>
          </div>
          </div>
      </div>
      <div class="info-block">
        <div class="form-title">阈值设置</div>
        <div class="form-box">
          <div class="layui-form-item">
            <label class="layui-form-label w120">一级预警：</label>
            <div class="layui-input-block">
              <input type="text" name="n7" placeholder="请输入最低值" value="${data.n7 || ''}" 
              autocomplete="off" class="layui-input w160">
              <input type="text" name="n8" placeholder="请输入高低值" value="${data.n8 || ''}"
              autocomplete="off" class="layui-input w160">
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label w120">二级预警：</label>
            <div class="layui-input-block">
              <input type="text" name="n9" placeholder="请输入最低值" value="${data.n9 || ''}"
              autocomplete="off" class="layui-input w160">
              <input type="text" name="n10" placeholder="请输入高低值" value="${data.n10 || ''}"
               autocomplete="off" class="layui-input w160">
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label w120">三级预警：</label>
            <div class="layui-input-block">
              <input type="text" name="n11" placeholder="请输入最低值" value="${data.n11 || ''}"
              autocomplete="off" class="layui-input w160">
              <input type="text" name="n12" placeholder="请输入高低值" value="${data.n12 || ''}"
              autocomplete="off" class="layui-input w160">
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label w120">四级预警：</label>
            <div class="layui-input-block">
              <input type="text" name="n13" placeholder="请输入最低值" value="${data.n13 || ''}"
              autocomplete="off" class="layui-input w160">
              <input type="text" name="n14" placeholder="请输入高低值" value="${data.n14 || ''}"
              autocomplete="off" class="layui-input w160">
            </div>
          </div>
          <div class="layui-form-item mt20">
            <div class="layui-inline">
              <label class="layui-form-label w120">预警接收人：</label>
              <div class="layui-input-block">
                <span class="layui-input name-layer w350">请选择</span>
              </div>
            </div>
            <div class="name-list-placeholder"></div>
          </div>
        </div>
      </div>
      <div class="right">
        <button type="button" class="layui-btn" lay-submit lay-filter='submit'>添加阈值</button>
      </div>
    </form>
`

      const container = $("#infoContainer")
      container.html(html)

      if (data.n15) {
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

    pListTemplate () {
      return `<input class="search-name-input" /><div class="luTableInner"></div>`
    }
  }

  // http://127.0.0.1:8080/qljcs/#/warning-message/warning-form

  let info, pt = new PageTemplate(), selectedList = [], pList, orgList = [], luLayer;
  const getInfoById = id => {
    // mock
    const flag = id % 2
    const data1 = { n1: 'LF09位移计', n2: '传感器', n3: '位移计', n4: '在线' }
    const data2 = { n1: 'TOP001裂缝计', n2: '监控器', n3: '温度计', n4: '在线' }
    let data = flag ? data1 : data2
    if (id < 4) {
      data = flag ? {
        ...data, n5: '第6跨中靠南侧面', n6: "2020-05-16", n7: "0.1mm", n8: "0.08mm",
        n9: "0.05mm", n10: "0.01mm", n11: "0.6mm", n12: "0.18mm", n13: "0.35mm",
        n14: "0.71mm", n15: "王菲", n16: "18189134680"
      } : {
        ...data, n5: '4蓝田方向北侧桥台', n6: "2020-05-16", n7: "42℃", n8: "40℃",
        n9: "38℃", n10: "36℃", n11: "55℃", n12: "56℃", n13: "57℃", n14: "58℃",
        n15: "王菲", n16: "18189134680"
      }
    }
    pt.renderContainer(data)
  }
  const init = async () => {
    const params = $lulib.getHashParams()
    await getInfoById(params.id)
  }
  init()

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

  function renderSelectedNameList () {
    let h = ''
    for (let i = 0; i < selectedList.length; i++) {
      const item = selectedList[i]
      h += `<div class="name-item"><span>${item.name}</span><span>${item.phone}</span><span>${item.company}</span><span class="iconfont icon-guanbi name-item-del" data-id="${item.id}"></span></div>`
    }
    $(".name-list-placeholder").html(h)
  }

  function delNameItem () {
    const id = $(this).data('id')
    selectedList = selectedList.filter(item => item.id !== id)
    renderSelectedNameList()
  }

  async function handlerNameSearch (e) {
    orgList = [...pList]
    const value = e.target.value.trim()
    let list = null
    if (!value) list = orgList
    else list = pList.filter(item => item.name.includes(value))
    renderInnerTable(list)
  }

  form.on('submit(submit)', function (data) {
    console.log(data.field)
    console.log(selectedList)
  })
})
